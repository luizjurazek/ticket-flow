import request from 'supertest';
import { faker } from '@faker-js/faker';
import { HttpStatus } from '@/shared/http/http-status';
import { prisma } from '@/shared/database/prisma';
import { resetDatabase } from '@/test/integration/reset-database';
import { ticketClassifierScenarios } from '@/test/helpers/ticket-classifier-scenarios';
import { TicketStatus } from '@/shared/domain/ticket/ticket.enums';

const classifyMock = jest.fn();

jest.mock('@/modules/ticket-classifier/infrastructure/factories/ticket-classifier.factory', () => ({
  makeTicketClassifier: () => ({
    classify: (message: string) => classifyMock(message),
  }),
}));

import { app } from '@/app';

async function createUserId(): Promise<string> {
  const response = await request(app)
    .post('/users')
    .send({ name: faker.person.fullName(), email: faker.internet.email() })
    .expect(HttpStatus.CREATED);

  return response.body.id as string;
}

async function createTicketViaApi(userId: string, message?: string) {
  const ticketMessage = message ?? ticketClassifierScenarios[0].message;

  const response = await request(app)
    .post('/tickets')
    .send({ userId, message: ticketMessage })
    .expect(HttpStatus.CREATED);

  return response.body as { id: string; userId: string; message: string };
}

describe('Tickets API (integration)', () => {
  beforeEach(async () => {
    await resetDatabase();
    classifyMock.mockReset();
    classifyMock.mockImplementation(async (message: string) => {
      const scenario = ticketClassifierScenarios.find((item) => item.message === message);
      if (!scenario) {
        throw new Error(`No classifier scenario configured for message: ${message}`);
      }
      return scenario.classification;
    });
  });

  describe('POST /tickets', () => {
    it.each(ticketClassifierScenarios)(
      'should persist classification for: $message',
      async ({ message, classification }) => {
        const userId = await createUserId();

        const response = await request(app).post('/tickets').send({ userId, message }).expect(HttpStatus.CREATED);

        expect(response.body).toMatchObject({
          userId,
          message,
          channel: classification.channel,
          priority: classification.priority,
          manuallyReview: classification.manuallyReview,
          status: TicketStatus.OPEN,
        });
        expect(classifyMock).toHaveBeenCalledWith(message);

        const ticketInDb = await prisma.ticket.findUnique({ where: { id: response.body.id } });
        expect(ticketInDb).toMatchObject({
          channel: classification.channel,
          priority: classification.priority,
          manuallyReview: classification.manuallyReview,
        });
      },
    );

    it('should return 404 when user does not exist', async () => {
      const response = await request(app)
        .post('/tickets')
        .send({ userId: faker.string.uuid(), message: ticketClassifierScenarios[0].message })
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('User not found');
      expect(classifyMock).not.toHaveBeenCalled();
    });

    it('should return 400 when userId is invalid', async () => {
      const response = await request(app)
        .post('/tickets')
        .send({ userId: 'invalid-id', message: ticketClassifierScenarios[0].message })
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body.status).toBe('error');
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'userId',
            source: 'body',
          }),
        ]),
      );
    });
  });

  describe('GET /tickets', () => {
    it('should return an empty array when there are no tickets', async () => {
      const response = await request(app).get('/tickets').expect(HttpStatus.OK);

      expect(response.body).toEqual([]);
    });

    it('should return all tickets', async () => {
      const firstUserId = await createUserId();
      const secondUserId = await createUserId();
      const firstTicket = await createTicketViaApi(firstUserId, ticketClassifierScenarios[0].message);
      const secondTicket = await createTicketViaApi(secondUserId, ticketClassifierScenarios[1].message);

      const response = await request(app).get('/tickets').expect(HttpStatus.OK);

      expect(response.body).toHaveLength(2);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: firstTicket.id, userId: firstUserId }),
          expect.objectContaining({ id: secondTicket.id, userId: secondUserId }),
        ]),
      );
    });
  });

  describe('GET /tickets/:id', () => {
    it('should return the ticket', async () => {
      const userId = await createUserId();
      const message = ticketClassifierScenarios[0].message;
      const created = await createTicketViaApi(userId, message);

      const response = await request(app).get(`/tickets/${created.id}`).expect(HttpStatus.OK);

      expect(response.body).toMatchObject({
        id: created.id,
        userId,
        message,
      });
    });

    it('should return 404 when ticket does not exist', async () => {
      const response = await request(app).get(`/tickets/${faker.string.uuid()}`).expect(HttpStatus.NOT_FOUND);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Ticket not found');
    });
  });

  describe('GET /tickets/user/:id', () => {
    it('should return tickets for the user', async () => {
      const userId = await createUserId();
      const otherUserId = await createUserId();
      const firstTicket = await createTicketViaApi(userId, ticketClassifierScenarios[0].message);
      const secondTicket = await createTicketViaApi(userId, ticketClassifierScenarios[1].message);
      await createTicketViaApi(otherUserId, ticketClassifierScenarios[2].message);

      const response = await request(app).get(`/tickets/user/${userId}`).expect(HttpStatus.OK);

      expect(response.body).toHaveLength(2);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: firstTicket.id, userId }),
          expect.objectContaining({ id: secondTicket.id, userId }),
        ]),
      );
    });

    it('should return an empty array when user has no tickets', async () => {
      const userId = await createUserId();

      const response = await request(app).get(`/tickets/user/${userId}`).expect(HttpStatus.OK);

      expect(response.body).toEqual([]);
    });
  });

  describe('PUT /tickets/:id/status', () => {
    it('should update ticket status and return 200', async () => {
      const userId = await createUserId();
      const created = await createTicketViaApi(userId);

      const response = await request(app)
        .put(`/tickets/${created.id}/status`)
        .send({ status: TicketStatus.IN_PROGRESS })
        .expect(HttpStatus.OK);

      expect(response.body.status).toBe(TicketStatus.IN_PROGRESS);

      const ticketInDb = await prisma.ticket.findUnique({ where: { id: created.id } });
      expect(ticketInDb?.status).toBe(TicketStatus.IN_PROGRESS);
    });

    it('should return 404 when ticket does not exist', async () => {
      const response = await request(app)
        .put(`/tickets/${faker.string.uuid()}/status`)
        .send({ status: TicketStatus.IN_PROGRESS })
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Ticket not found');
    });

    it('should return 400 when status is invalid', async () => {
      const userId = await createUserId();
      const created = await createTicketViaApi(userId);

      const response = await request(app)
        .put(`/tickets/${created.id}/status`)
        .send({ status: 'invalid-status' })
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body.status).toBe('error');
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'status',
            source: 'body',
          }),
        ]),
      );
    });
  });
});
