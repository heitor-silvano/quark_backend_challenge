import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../app.module';
import { PrismaService } from '../../../prisma/prisma.service';

let app: INestApplication;
let prisma: PrismaService;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleRef.createNestApplication();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.init();

  prisma = moduleRef.get(PrismaService);
});

afterAll(async () => {
  await app.close();
});

beforeEach(async () => {
  await prisma.leadClassification.deleteMany();
  await prisma.leadEnrichment.deleteMany();
  await prisma.lead.deleteMany();
});

const validLead = {
  fullName: 'João da Silva',
  email: 'joao@techcorp.com.br',
  phone: '+5511999991111',
  companyName: 'Tech Corp',
  companyCnpj: '11222333000181',
  source: 'WEBSITE',
};

describe('POST /leads', () => {
  it('should create a lead and return 201', async () => {
    const response = await request(app.getHttpServer())
      .post('/leads')
      .send(validLead);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      fullName: validLead.fullName,
      email: validLead.email,
      companyCnpj: validLead.companyCnpj,
    });
    expect(response.body.id).toBeDefined();
  });

  it('should return 400 for invalid CNPJ', async () => {
    const response = await request(app.getHttpServer())
      .post('/leads')
      .send({ ...validLead, companyCnpj: '11111111111111' });

    expect(response.status).toBe(400);
  });

  it('should return 400 for invalid email', async () => {
    const response = await request(app.getHttpServer())
      .post('/leads')
      .send({ ...validLead, email: 'not-an-email' });

    expect(response.status).toBe(400);
  });

  it('should return 400 for invalid phone format', async () => {
    const response = await request(app.getHttpServer())
      .post('/leads')
      .send({ ...validLead, phone: '11999991111' });

    expect(response.status).toBe(400);
  });
});

describe('GET /leads', () => {
  it('should return all leads', async () => {
    await request(app.getHttpServer()).post('/leads').send(validLead);

    const response = await request(app.getHttpServer()).get('/leads');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  it('should filter leads by source', async () => {
    await request(app.getHttpServer()).post('/leads').send(validLead);
    await request(app.getHttpServer()).post('/leads').send({
      ...validLead,
      email: 'outro@email.com',
      companyCnpj: '33444555000150',
      source: 'REFERRAL',
    });

    const response = await request(app.getHttpServer())
      .get('/leads')
      .query({ source: 'WEBSITE' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].source).toBe('WEBSITE');
  });

  it('should return 400 for invalid source filter', async () => {
    const response = await request(app.getHttpServer())
      .get('/leads')
      .query({ source: 'INVALID' });

    expect(response.status).toBe(400);
  });
});

describe('GET /leads/:id', () => {
  it('should return a lead by id', async () => {
    const created = await request(app.getHttpServer())
      .post('/leads')
      .send(validLead);

    const response = await request(app.getHttpServer())
      .get(`/leads/${created.body.id}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(created.body.id);
  });
});

describe('PATCH /leads/:id', () => {
  it('should update a lead', async () => {
    const created = await request(app.getHttpServer())
      .post('/leads')
      .send(validLead);

    const response = await request(app.getHttpServer())
      .patch(`/leads/${created.body.id}`)
      .send({ fullName: 'João Atualizado' });

    expect(response.status).toBe(200);
    expect(response.body.fullName).toBe('João Atualizado');
  });

  it('should return 400 when trying to update email', async () => {
    const created = await request(app.getHttpServer())
      .post('/leads')
      .send(validLead);

    const response = await request(app.getHttpServer())
      .patch(`/leads/${created.body.id}`)
      .send({ email: 'novo@email.com' });

    expect(response.status).toBe(400);
  });

  it('should return 400 when trying to update companyCnpj', async () => {
    const created = await request(app.getHttpServer())
      .post('/leads')
      .send(validLead);

    const response = await request(app.getHttpServer())
      .patch(`/leads/${created.body.id}`)
      .send({ companyCnpj: '11222333000181' });

    expect(response.status).toBe(400);
  });
});

describe('DELETE /leads/:id', () => {
  it('should soft delete a lead', async () => {
    const created = await request(app.getHttpServer())
      .post('/leads')
      .send(validLead);

    const deleteResponse = await request(app.getHttpServer())
      .delete(`/leads/${created.body.id}`);

    expect(deleteResponse.status).toBe(200);

    const listResponse = await request(app.getHttpServer()).get('/leads');
    expect(listResponse.body).toHaveLength(0);
  });
});

describe('POST /leads/:id/enrichment', () => {
  it('should enqueue enrichment and return 201', async () => {
    const created = await request(app.getHttpServer())
      .post('/leads')
      .send(validLead);

    const response = await request(app.getHttpServer())
      .post(`/leads/${created.body.id}/enrichment`);

    expect(response.status).toBe(201);
    expect(response.body.status).toBe('PENDING');
  });

  it('should return 404 for non-existent lead', async () => {
    const response = await request(app.getHttpServer())
      .post('/leads/non-existent/enrichment');

    expect(response.status).toBe(404);
  });
});