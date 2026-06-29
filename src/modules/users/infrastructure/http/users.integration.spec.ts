import request from 'supertest';
import { faker } from '@faker-js/faker';
import { app } from '@/app';
import { prisma } from '@/shared/database/prisma';
import { HttpStatus } from '@/shared/http/http-status';
import { resetDatabase } from '@/test/integration/reset-database';

async function createUserViaApi(overrides?: { name?: string; email?: string }) {
  const payload = {
    name: overrides?.name ?? faker.person.fullName(),
    email: overrides?.email ?? faker.internet.email(),
  };

  const response = await request(app).post('/users').send(payload).expect(HttpStatus.CREATED);

  return { payload, user: response.body as { id: string; name: string; email: string } };
}

describe('Users API (integration)', () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  describe('POST /users', () => {
    it('should create a user and return 201', async () => {
      const { payload, user } = await createUserViaApi();

      expect(user).toMatchObject({
        name: payload.name,
        email: payload.email,
      });
      expect(user.id).toBeDefined();

      const userInDb = await prisma.user.findUnique({ where: { id: user.id } });
      expect(userInDb).toMatchObject(payload);
    });

    it('should return 400 when email is invalid', async () => {
      const response = await request(app)
        .post('/users')
        .send({ name: faker.person.fullName(), email: 'invalid-email' })
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body.status).toBe('error');
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'email',
            source: 'body',
          }),
        ]),
      );
    });
  });

  describe('GET /users', () => {
    it('should return an empty array when there are no users', async () => {
      const response = await request(app).get('/users').expect(HttpStatus.OK);

      expect(response.body).toEqual([]);
    });

    it('should return all users', async () => {
      const first = await createUserViaApi();
      const second = await createUserViaApi();

      const response = await request(app).get('/users').expect(HttpStatus.OK);

      expect(response.body).toHaveLength(2);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: first.user.id, name: first.user.name, email: first.user.email }),
          expect.objectContaining({ id: second.user.id, name: second.user.name, email: second.user.email }),
        ]),
      );
    });
  });

  describe('GET /users/:id', () => {
    it('should return the user', async () => {
      const { user } = await createUserViaApi();

      const response = await request(app).get(`/users/${user.id}`).expect(HttpStatus.OK);

      expect(response.body).toMatchObject({
        id: user.id,
        name: user.name,
        email: user.email,
      });
    });

    it('should return 404 when user does not exist', async () => {
      const response = await request(app).get(`/users/${faker.string.uuid()}`).expect(HttpStatus.NOT_FOUND);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('User not found');
    });
  });

  describe('PUT /users/:id', () => {
    it('should update the user and return 200', async () => {
      const { user } = await createUserViaApi();
      const updatedPayload = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
      };

      const response = await request(app).put(`/users/${user.id}`).send(updatedPayload).expect(HttpStatus.OK);

      expect(response.body).toMatchObject({
        id: user.id,
        name: updatedPayload.name,
        email: updatedPayload.email,
      });

      const userInDb = await prisma.user.findUnique({ where: { id: user.id } });
      expect(userInDb).toMatchObject(updatedPayload);
    });

    it('should return 404 when user does not exist', async () => {
      const response = await request(app)
        .put(`/users/${faker.string.uuid()}`)
        .send({ name: faker.person.fullName() })
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('User not found');
    });

    it('should return 400 when email is invalid', async () => {
      const { user } = await createUserViaApi();

      const response = await request(app)
        .put(`/users/${user.id}`)
        .send({ email: 'invalid-email' })
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body.status).toBe('error');
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'email',
            source: 'body',
          }),
        ]),
      );
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete the user and return 204', async () => {
      const { user } = await createUserViaApi();

      await request(app).delete(`/users/${user.id}`).expect(HttpStatus.NO_CONTENT);

      const userInDb = await prisma.user.findUnique({ where: { id: user.id } });
      expect(userInDb).toBeNull();
    });

    it('should return 404 when user does not exist', async () => {
      const response = await request(app).delete(`/users/${faker.string.uuid()}`).expect(HttpStatus.NOT_FOUND);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('User not found');
    });

    it('should return 409 when user has associated tickets', async () => {
      const { user } = await createUserViaApi();

      await prisma.ticket.create({
        data: {
          message: 'Test ticket',
          channel: 'customer_service',
          priority: 'medium',
          userId: user.id,
        },
      });

      const response = await request(app).delete(`/users/${user.id}`).expect(HttpStatus.CONFLICT);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('User has associated tickets and cannot be deleted');

      const userInDb = await prisma.user.findUnique({ where: { id: user.id } });
      expect(userInDb).not.toBeNull();
    });
  });
});
