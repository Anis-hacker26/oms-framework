import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';

import request from 'supertest';

import { AppModule } from './../src/app.module';

describe('Tenant API (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let tenantId: string;

   // Helper for authenticated requests
  const auth = (req: request.Test) =>
    req.set('Authorization', `Bearer ${accessToken}`);

  beforeAll(async () => {
  const moduleFixture: TestingModule =
    await Test.createTestingModule({
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

console.log('LOGIN STATUS:', loginResponse.status);
console.log('LOGIN BODY:', JSON.stringify(loginResponse.body, null, 2));

accessToken =
  loginResponse.body.accessToken ??
  loginResponse.body.data?.accessToken;

  });

  afterAll(async () => {
    await app.close();
  });

  const unique = Date.now();

  const tenant = {
    name: `Netflix-${unique}`,
    slug: `netflix-${unique}`,
    contactEmail: `admin${unique}@netflix.com`,
  };

  describe('POST /tenants', () => {
    it('should create tenant successfully', async () => {
      const response = await auth(
        request(app.getHttpServer()).post('/tenants'),
        )
        .send(tenant)
        .expect(201);

      tenantId = response.body.data.id;

      expect(response.body.success).toBe(true);

      expect(response.body.message).toBe('Tenant created successfully.');

      expect(response.body.data.name).toBe(tenant.name);
    });

    it('should reject duplicate slug', async () => {
      await auth(
        request(app.getHttpServer()).post('/tenants'),
        )
        .send({
          name: 'Duplicate Name',
          slug: tenant.slug,
          contactEmail: 'duplicate@test.com',
        })
        .expect(409);
    });

    it('should reject invalid payload', async () => {
      await auth(
        request(app.getHttpServer()).post('/tenants'),
        )
        .send({
          name: '',
          slug: '',
          contactEmail: 'invalid-email',
        })
        .expect(400);
    });

    it('should return standardized response', async () => {
      const response = await auth(
        request(app.getHttpServer()).post('/tenants'),
        )
        .send({
          name: `Microsoft-${unique}`,
          slug: `microsoft-${unique}`,
          contactEmail: `admin${unique}@microsoft.com`,
        });

      expect(response.body).toHaveProperty('success');

      expect(response.body).toHaveProperty('message');

      expect(response.body).toHaveProperty('data');

      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /tenants/:id', () => {
    it('should return tenant by id', async () => {
      const response = await auth(
        request(app.getHttpServer()).get(`/tenants/${tenantId}`)
      ).expect(200);

      expect(response.body.success).toBe(true);

      expect(response.body.message).toBe('Tenant retrieved successfully.');

      expect(response.body.data.id).toBe(tenantId);
    });

    it('should return 404 for unknown tenant', async () => {
      await auth(
        request(app.getHttpServer()).get('/tenants/123e4567-e89b-42d3-a456-426614174000')
      ).expect(404);
    });

    it('should return 400 for invalid uuid', async () => {
      await auth(
  request(app.getHttpServer()).get('/tenants/abc'),
    ).expect(400);
    });

    it('should return standardized response', async () => {
      const response = await auth(
        request(app.getHttpServer()).get(`/tenants/${tenantId}`)
      ).expect(200);

      expect(response.body).toHaveProperty('success');

      expect(response.body).toHaveProperty('message');

      expect(response.body).toHaveProperty('data');

      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /tenants', () => {
    it('should return paginated tenants', async () => {
      const response = await auth(
        request(app.getHttpServer()).get('/tenants')
      ).expect(200);

      expect(response.body.success).toBe(true);

      expect(response.body.data).toHaveProperty('items');

      expect(response.body.data).toHaveProperty('meta');
    });

    it('should search tenants', async () => {
      const response = await auth(
        request(app.getHttpServer()).get('/tenants'),
        )
          .query({
          search: 'netflix',
  })
  .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should filter ACTIVE tenants', async () => {
      const response = await auth(
        request(app.getHttpServer()).get('/tenants')
      ).query({
        status: 'ACTIVE',
      }).expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should filter SUSPENDED tenants', async () => {
      const response = await auth(
        request(app.getHttpServer()).get('/tenants'),
        )
          .query({
          status: 'SUSPENDED',
  })
  .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should combine search and status filter', async () => {
      const response = await auth(
        request(app.getHttpServer()).get('/tenants')
      ).query({
        search: 'netflix',
        status: 'ACTIVE',
      })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should reject invalid sort field', async () => {
      await auth(
  request(app.getHttpServer()).get('/tenants'),
)
  .query({
    sortBy: 'hack',
  })
  .expect(400);
    });

    it('should reject invalid page', async () => {
      await auth(
  request(app.getHttpServer()).get('/tenants'),
)
  .query({
    page: 0,
  })
  .expect(400);
    });

    it('should reject invalid limit', async () => {
      await auth(
  request(app.getHttpServer()).get('/tenants'),
)
  .query({
    limit: 0,
  })
  .expect(400);
    });
  });


  describe('PATCH /tenants/:id', () => {
    it('should update tenant name', async () => {
      const response = await auth(
        request(app.getHttpServer())
          .patch(`/tenants/${tenantId}`)
          .set('Authorization', `Bearer ${accessToken}`)
      )
        .send({
          name: `Netflix Updated ${unique}`,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Tenant updated successfully.');
      expect(response.body.data.name).toBe(`Netflix Updated ${unique}`);
    });

    it('should update tenant slug', async () => {
      const response = await auth(
        request(app.getHttpServer())
          .patch(`/tenants/${tenantId}`)
          .set('Authorization', `Bearer ${accessToken}`)
      )
        .send({
          slug: `netflix-updated-${unique}`,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.slug).toBe(`netflix-updated-${unique}`);
    });

    it('should update tenant contact email', async () => {
      const response = await auth(
        request(app.getHttpServer())
          .patch(`/tenants/${tenantId}`)
          .set('Authorization', `Bearer ${accessToken}`)
      )
        .send({
          contactEmail: `updated${unique}@netflix.com`,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.contactEmail).toBe(
        `updated${unique}@netflix.com`,
      );
    });

    it('should update multiple fields', async () => {
      const response = await auth(
        request(app.getHttpServer())
          .patch(`/tenants/${tenantId}`)
          .set('Authorization', `Bearer ${accessToken}`)
      )
        .send({
          name: `Netflix Global ${unique}`,
          slug: `netflix-global-${unique}`,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(`Netflix Global ${unique}`);
      expect(response.body.data.slug).toBe(`netflix-global-${unique}`);
    });

    it('should reject empty update payload', async () => {
      await auth(
        request(app.getHttpServer())
          .patch(`/tenants/${tenantId}`)
          .set('Authorization', `Bearer ${accessToken}`)
      )
        .send({})
        .expect(400);
    });

    it('should reject update with same values', async () => {
      await auth(
        request(app.getHttpServer())
          .patch(`/tenants/${tenantId}`)
          .set('Authorization', `Bearer ${accessToken}`)
      )
        .send({
          name: `Netflix Global ${unique}`,
        })
        .expect(400);
    });

    it('should reject invalid uuid', async () => {
      await auth(
        request(app.getHttpServer())
          .patch('/tenants/abc')
          .set('Authorization', `Bearer ${accessToken}`)
      )
        .send({
          name: 'Google',
        })
        .expect(400);
    });

    it('should return 404 for unknown tenant', async () => {
      await auth(
        request(app.getHttpServer())
          .patch('/tenants/123e4567-e89b-42d3-a456-426614174000')
          .set('Authorization', `Bearer ${accessToken}`)
      )
        .send({
          name: 'Google',
        })
        .expect(404);
    });

    it('should reject duplicate name', async () => {
      const duplicateName = `Microsoft Duplicate ${unique}`;

      await auth(
        request(app.getHttpServer())
          .post('/tenants')
          .set('Authorization', `Bearer ${accessToken}`)
      )
        .send({
          name: duplicateName,
          slug: `microsoft-duplicate-${unique}`,
          contactEmail: `duplicate${unique}@microsoft.com`,
        })
        .expect(201);

      await auth(
        request(app.getHttpServer())
          .patch(`/tenants/${tenantId}`)
          .set('Authorization', `Bearer ${accessToken}`)
      )
        .send({
          name: duplicateName,
        })
        .expect(409);
    });

    it('should reject duplicate slug', async () => {
      const duplicateSlug = `duplicate-slug-${unique}`;

      await auth(
        request(app.getHttpServer())
          .post('/tenants')
          .set('Authorization', `Bearer ${accessToken}`)
      )
        .send({
          name: `Amazon ${unique}`,
          slug: duplicateSlug,
          contactEmail: `amazon${unique}@test.com`,
        })
        .expect(201);

      await auth(
        request(app.getHttpServer())
          .patch(`/tenants/${tenantId}`)
          .set('Authorization', `Bearer ${accessToken}`)
      )
        .send({
          slug: duplicateSlug,
        })
        .expect(409);
    });
  });


  describe('PATCH /tenants/:id', () => {
    it('should update tenant successfully', async () => {
      const response = await auth(
        request(app.getHttpServer())
          .patch(`/tenants/${tenantId}`)
          .set('Authorization', `Bearer ${accessToken}`)
      )
        .send({
          name: `Updated Netflix ${unique}`,
        })
        .expect(200);

      await auth(
        request(app.getHttpServer())
          .patch(`/tenants/${tenantId}`)
          .set('Authorization', `Bearer ${accessToken}`)
      )
        .send({
          slug: 'existing-slug',
        })
        .expect(409);
    });

    it('should reject duplicate contact email', async () => {
      const duplicateEmail = `duplicate${unique}@gmail.com`;

      await auth(
        request(app.getHttpServer())
          .post('/tenants')
          .set('Authorization', `Bearer ${accessToken}`)
      )
        .send({
          name: `Apple ${unique}`,
          slug: `apple-${unique}`,
          contactEmail: duplicateEmail,
        })
        .expect(201);

      await auth(
        request(app.getHttpServer())
          .patch(`/tenants/${tenantId}`)
          .set('Authorization', `Bearer ${accessToken}`)
      )
        .send({
          contactEmail: duplicateEmail,
        })
        .expect(409);
    });
  });


  describe('PATCH /tenants/:id/suspend', () => {
    it('should suspend tenant successfully', async () => {
      const response = await auth(
        request(app.getHttpServer())
          .patch(`/tenants/${tenantId}/suspend`)
          .set('Authorization', `Bearer ${accessToken}`)
      )
        .send({})
        .expect(200);

      expect(response.body.success).toBe(true);

      expect(response.body.data.isSuspended).toBe(true);
    });

    it('should reject already suspended tenant', async () => {
      await auth(
        request(app.getHttpServer())
          .patch(`/tenants/${tenantId}/suspend`)
          .set('Authorization', `Bearer ${accessToken}`)
      )
        .send({})
        .expect(400);
    });

    it('should reject invalid uuid', async () => {
      await auth(
        request(app.getHttpServer())
          .patch('/tenants/abc/suspend')
      )
        .send({})
        .expect(400);
    });

    it('should return 404 for unknown tenant', async () => {
      await auth(
        request(app.getHttpServer())
          .patch('/tenants/123e4567-e89b-42d3-a456-426614174000/suspend')
      )
        .send({})
        .expect(404);
    });
  });

  describe('PATCH /tenants/:id/activate', () => {
    it('should activate tenant successfully', async () => {
      const response = await auth(
        request(app.getHttpServer())
          .patch(`/tenants/${tenantId}/activate`)
          .set('Authorization', `Bearer ${accessToken}`)
      )
        .send({})
        .expect(200);

      expect(response.body.success).toBe(true);

      expect(response.body.data.isSuspended).toBe(false);
    });

    it('should reject already active tenant', async () => {
      await auth(
            request(app.getHttpServer())
            .patch(`/tenants/${tenantId}/activate`),
      )
          .send({})
          .expect(400);
    });

    it('should reject invalid uuid', async () => {
      await auth(
      request(app.getHttpServer())
      .patch('/tenants/abc/activate'),
    )
      .send({})
      .expect(400);
    });

    it('should return 404 for unknown tenant', async () => {
      await auth(
        request(app.getHttpServer())
        .patch('/tenants/123e4567-e89b-42d3-a456-426614174000/activate'),
      )
        .send({})
        .expect(404);
    });
  });
});
