import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://host.docker.internal:3000';

const EMAIL = __ENV.TEST_EMAIL || 'admin@example.com';
const PASSWORD = __ENV.TEST_PASSWORD || 'Password@123';

export function setup() {
  const response = http.post(
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

  const loginOk = check(response, {
    'setup login returns 200': (res) => res.status === 200,
    'setup login returns access token': (res) => {
      try {
        return Boolean(res.json('data.accessToken'));
      } catch {
        return false;
      }
    },
  });

  if (!loginOk) {
    console.log(`LOGIN_STATUS=${response.status}`);
    console.log(`LOGIN_BODY=${response.body}`);
    throw new Error('Setup authentication failed');
  }

  return {
    accessToken: response.json('data.accessToken'),
  };
}

export const options = {
  scenarios: {
    paymentsRead: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 2 },
        { duration: '60s', target: 5 },
        { duration: '60s', target: 10 },
        { duration: '30s', target: 0 },
      ],
      gracefulRampDown: '10s',
    },
  },

  thresholds: {
    http_req_failed: ['rate<0.01'],
  },
};

export default function (data) {
  const response = http.get(
    `${BASE_URL}/payments?page=1&limit=10`,
    {
      headers: {
        Authorization: `Bearer ${data.accessToken}`,
      },
    },
  );

  check(response, {
    'list payments returns 200': (res) => res.status === 200,

    'payments returns items array': (res) => {
      try {
        return Array.isArray(res.json('data.items'));
      } catch {
        return false;
      }
    },

    'payments returns pagination metadata': (res) => {
      try {
        return res.json('data.meta') !== undefined;
      } catch {
        return false;
      }
    },

    'payments page contains at most 10 items': (res) => {
      try {
        return res.json('data.items').length <= 10;
      } catch {
        return false;
      }
    },
  });
}
