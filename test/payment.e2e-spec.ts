import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';

import request from 'supertest';

import { AppModule } from './../src/app.module';

describe('Payment API (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  let paymentId: string;
  let orderId: string;

  const auth = (req: request.Test) =>
    req.set('Authorization', `Bearer ${accessToken}`);

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'Password@123',
      });

    accessToken =
      loginResponse.body.accessToken ?? loginResponse.body.data?.accessToken;

    // Create an Order for Payment tests
    const unique = Date.now();

    const orderResponse = await auth(
      request(app.getHttpServer()).post('/orders'),
    )
      .send({
        title: `Payment Test Order ${unique}`,
        description: 'Created for Payment E2E testing',
      })
      .expect(201);

    orderId = orderResponse.body.data.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should login successfully', () => {
    expect(accessToken).toBeDefined();
  });

  describe('POST /payments', () => {
    it('should create payment successfully', async () => {
      const unique = Date.now();

      const payment = {
        orderId,
        paymentReference: `PAY-${unique}`,
        provider: 'Stripe',
        method: 'CARD',
        currency: 'INR',
        amount: 1499.99,
        gatewayTransactionId: `txn-${unique}`,
        metadata: {
          source: 'checkout',
          device: 'mobile',
        },
      };

      const response = await auth(
        request(app.getHttpServer()).post('/payments'),
      )
        .send(payment)
        .expect(201);

      paymentId = response.body.data.id;

      expect(response.body.success).toBe(true);

      expect(response.body.message).toBe('Payment created successfully.');

      expect(response.body.data.paymentReference).toBe(
        payment.paymentReference,
      );

      expect(response.status).toBe(201);
    });
  });

  describe('GET /payments/:id', () => {
    it('should retrieve payment by id', async () => {
      const response = await auth(
        request(app.getHttpServer()).get(`/payments/${paymentId}`),
      ).expect(200);

      expect(response.body.success).toBe(true);

      expect(response.body.message).toBe('Payment retrieved successfully.');

      expect(response.body.data.id).toBe(paymentId);
    });
  });

  describe('GET /payments', () => {
    it('should retrieve payment list', async () => {
      const response = await auth(
        request(app.getHttpServer()).get('/payments'),
      ).expect(200);

      expect(response.body.success).toBe(true);

      expect(response.body.message).toBe('Payments retrieved successfully.');

      expect(Array.isArray(response.body.data)).toBe(true);

      expect(
        response.body.data.some((payment: any) => payment.id === paymentId),
      ).toBe(true);
    });
  });

  describe('PATCH /payments/:id', () => {
    it('should update payment successfully', async () => {
      const updatePayment = {
        provider: 'Razorpay',
        gatewayTransactionId: 'txn-updated-123',
      };

      const response = await auth(
        request(app.getHttpServer()).patch(`/payments/${paymentId}`),
      )
        .send(updatePayment)
        .expect(200);

      expect(response.body.success).toBe(true);

      expect(response.body.message).toBe('Payment updated successfully.');

      expect(response.body.data.provider).toBe('Razorpay');

      expect(response.body.data.gatewayTransactionId).toBe('txn-updated-123');
    });
  });
});
