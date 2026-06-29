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

  it.each(ticketClassifierScenarios)(
    'POST /tickets should persist classification for: $message',
    async ({ message, classification }) => {
      const userId = await createUserId();

      const response = await request(app)
        .post('/tickets')
        .send({ userId, message })
        .expect(HttpStatus.CREATED);

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

  it('GET /tickets/:id should return the ticket', async () => {
    const userId = await createUserId();
    const message = ticketClassifierScenarios[0].message;

    const created = await request(app).post('/tickets').send({ userId, message }).expect(HttpStatus.CREATED);

    const response = await request(app).get(`/tickets/${created.body.id}`).expect(HttpStatus.OK);

    expect(response.body.id).toBe(created.body.id);
    expect(response.body.message).toBe(message);
  });

  it('PUT /tickets/:id/status should update status', async () => {
    const userId = await createUserId();
    const message = ticketClassifierScenarios[0].message;

    const created = await request(app).post('/tickets').send({ userId, message }).expect(HttpStatus.CREATED);

    const response = await request(app)
      .put(`/tickets/${created.body.id}/status`)
      .send({ status: TicketStatus.IN_PROGRESS })
      .expect(HttpStatus.OK);

    expect(response.body.status).toBe(TicketStatus.IN_PROGRESS);
  });
});
