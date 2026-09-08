import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://host.docker.internal:3000';

const EMAIL = __ENV.TEST_EMAIL || 'admin@example.com';
const PASSWORD = __ENV.TEST_PASSWORD || 'Password@123';

export const options = {
  vus: 1,
  iterations: 1,

  thresholds: {
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  // ------------------------------------------------------------
  // 1. Login
  // ------------------------------------------------------------
  const loginResponse = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({
      email: EMAIL,
      password: PASSWORD,
    }),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  const loginOk = check(loginResponse, {
    'login returns 200': (response) => response.status === 200,
    'login returns access token': (response) => {
      try {
        return Boolean(response.json('data.accessToken'));
      } catch {
        return false;
      }
    },
  });

  if (!loginOk) {
    console.log(`LOGIN_STATUS=${loginResponse.status}`);
    console.log(`LOGIN_BODY=${loginResponse.body}`);
    throw new Error('Authentication failed');
  }

  const accessToken = loginResponse.json('data.accessToken');

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  };

  // ------------------------------------------------------------
  // 2. Create Order
  // ------------------------------------------------------------
  const uniqueOrderTitle =
    `Load Test Order ${__VU}-${__ITER}-${Date.now()}`;

  const orderResponse = http.post(
    `${BASE_URL}/orders`,
    JSON.stringify({
      title: uniqueOrderTitle,
      description: 'Order created by Sprint 24 performance test',
    }),
    {
      headers,
    },
  );

  const orderOk = check(orderResponse, {
    'create order returns 201': (response) => response.status === 201,
    'create order returns order id': (response) => {
      try {
        return Boolean(response.json('data.id'));
      } catch {
        return false;
      }
    },
  });

  if (!orderOk) {
    console.log(`ORDER_STATUS=${orderResponse.status}`);
    console.log(`ORDER_BODY=${orderResponse.body}`);
    throw new Error('Order creation failed');
  }

  const orderId = orderResponse.json('data.id');

  // ------------------------------------------------------------
  // 3. List Orders
  // ------------------------------------------------------------
  const ordersResponse = http.get(
    `${BASE_URL}/orders`,
    {
      headers,
    },
  );

  check(ordersResponse, {
    'list orders returns 200': (response) => response.status === 200,
  });

  // ------------------------------------------------------------
  // 4. Create Payment
  // ------------------------------------------------------------
  const paymentReference =
    `LOAD-${__VU}-${__ITER}-${Date.now()}`;

  const paymentResponse = http.post(
    `${BASE_URL}/payments`,
    JSON.stringify({
      orderId,
      paymentReference,
      provider: 'LoadTestProvider',
      method: 'CARD',
      currency: 'INR',
      amount: 1499.99,
      metadata: {
        source: 'sprint-24-load-test',
        vu: __VU,
        iteration: __ITER,
      },
    }),
    {
      headers,
    },
  );

  const paymentOk = check(paymentResponse, {
    'create payment returns 201': (response) => response.status === 201,
    'create payment returns payment id': (response) => {
      try {
        return Boolean(response.json('data.id'));
      } catch {
        return false;
      }
    },
  });

  if (!paymentOk) {
    console.log(`PAYMENT_STATUS=${paymentResponse.status}`);
    console.log(`PAYMENT_BODY=${paymentResponse.body}`);
    throw new Error('Payment creation failed');
  }

  // ------------------------------------------------------------
  // 5. List Payments
  // ------------------------------------------------------------
  const paymentsResponse = http.get(
    `${BASE_URL}/payments`,
    {
      headers,
    },
  );

  check(paymentsResponse, {
    'list payments returns 200': (response) => response.status === 200,
  });

  sleep(1);
}