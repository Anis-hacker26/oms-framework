import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://host.docker.internal:3000';

const EMAIL = __ENV.TEST_EMAIL || 'admin@example.com';
const PASSWORD = __ENV.TEST_PASSWORD || 'Password@123';

export const options = {
  vus: 20,
  duration: '30s',

  thresholds: {
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
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

  const passed = check(response, {
    'login returns 200': (res) => res.status === 200,
    'login returns access token': (res) => {
      try {
        return Boolean(res.json('data.accessToken'));
      } catch {
        return false;
      }
    },
  });

  if (!passed) {
    console.log(`LOGIN_STATUS=${response.status}`);
    console.log(`LOGIN_BODY=${response.body}`);
  }
}