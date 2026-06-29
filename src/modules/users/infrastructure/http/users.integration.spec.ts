import request from 'supertest';
import { faker } from '@faker-js/faker';
import { app } from '@/app';
import { prisma } from '@/shared/database/prisma';
import { HttpStatus } from '@/shared/http/http-status';
import { resetDatabase } from '@/test/integration/reset-database';

describe('Users API (integration)', () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it('POST /users should create a user and return 201', async () => {
    const payload = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
    };

    const response = await request(app).post('/users').send(payload).expect(HttpStatus.CREATED);

    expect(response.body).toMatchObject({
      name: payload.name,
      email: payload.email,
    });
    expect(response.body.id).toBeDefined();

    const userInDb = await prisma.user.findUnique({ where: { id: response.body.id } });
    expect(userInDb).toMatchObject(payload);
  });

  it('GET /users/:id should return the user', async () => {
    const created = await request(app)
      .post('/users')
      .send({ name: faker.person.fullName(), email: faker.internet.email() })
      .expect(HttpStatus.CREATED);

    const response = await request(app).get(`/users/${created.body.id}`).expect(HttpStatus.OK);

    expect(response.body).toMatchObject({
      id: created.body.id,
      name: created.body.name,
      email: created.body.email,
    });
  });

  it('POST /users should return 400 when email is invalid', async () => {
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

  it('GET /users/:id should return 404 when user does not exist', async () => {
    const response = await request(app)
      .get(`/users/${faker.string.uuid()}`)
      .expect(HttpStatus.NOT_FOUND);

    expect(response.body.status).toBe('error');
    expect(response.body.message).toBe('User not found');
  });
});
