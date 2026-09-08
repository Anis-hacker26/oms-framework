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
  // 1. Authenticate
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

  const loginSuccess = check(loginResponse, {
    'login returns 200': (response) => response.status === 200,
    'login response contains access token': (response) => {
      try {
        const body = response.json();
        return Boolean(body?.data?.accessToken);
      } catch {
        return false;
      }
    },
  });

  if (!loginSuccess) {
    console.log(`LOGIN_STATUS=${loginResponse.status}`);
    console.log(`LOGIN_BODY=${loginResponse.body}`);
    throw new Error('Authentication failed');
  }

  const accessToken = loginResponse.json('data.accessToken');

  // 2. Retrieve authenticated profile
  const profileResponse = http.get(
    `${BASE_URL}/auth/profile`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  check(profileResponse, {
    'profile returns 200': (response) => response.status === 200,
  });

  // 3. Retrieve tenant list
  const tenantsResponse = http.get(
    `${BASE_URL}/tenants`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  check(tenantsResponse, {
    'tenant list returns 200': (response) => response.status === 200,
  });

  sleep(1);
}