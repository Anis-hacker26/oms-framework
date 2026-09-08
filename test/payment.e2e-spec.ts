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

    describe('GET /orders', () => {
    it('should retrieve paginated order list', async () => {
      const pageOne = await auth(
        request(app.getHttpServer()).get('/orders?page=1&limit=10'),
      ).expect(200);

      expect(pageOne.body.success).toBe(true);
      expect(pageOne.body.message).toBe('Orders retrieved successfully.');

      expect(Array.isArray(pageOne.body.data.items)).toBe(true);
      expect(pageOne.body.data.items.length).toBeLessThanOrEqual(10);

      expect(pageOne.body.data.meta.page).toBe(1);
      expect(pageOne.body.data.meta.limit).toBe(10);
      expect(pageOne.body.data.meta.totalItems).toBeGreaterThanOrEqual(1);
      expect(pageOne.body.data.meta.totalPages).toBeGreaterThanOrEqual(1);

      const pageTwo = await auth(
        request(app.getHttpServer()).get('/orders?page=2&limit=10'),
      ).expect(200);

      expect(pageTwo.body.success).toBe(true);

      expect(Array.isArray(pageTwo.body.data.items)).toBe(true);
      expect(pageTwo.body.data.items.length).toBeLessThanOrEqual(10);

      expect(pageTwo.body.data.meta.page).toBe(2);
      expect(pageTwo.body.data.meta.limit).toBe(10);

      if (pageTwo.body.data.items.length > 0) {
        expect(pageTwo.body.data.items[0].id).not.toBe(
          pageOne.body.data.items[0]?.id,
        );
      }
    });
  });

  describe('GET /payments', () => {
    it('should retrieve payment list', async () => {
      const response = await auth(
        request(app.getHttpServer()).get('/payments'),
      ).expect(200);

      expect(response.body.success).toBe(true);

expect(response.body.message).toBe('Payments retrieved successfully.');

expect(Array.isArray(response.body.data.items)).toBe(true);

expect(response.body.data.meta).toBeDefined();

expect(
  response.body.data.items.some(
    (payment: any) => payment.id === paymentId,
  ),
).toBe(true);

expect(response.body.data.meta.page).toBe(1);
expect(response.body.data.meta.limit).toBe(10);

expect(response.body.data.items.length).toBeLessThanOrEqual(10);
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
