import http from 'k6/http';

export const options = {
  vus: 1,
  iterations: 1,
};

export default function () {
  const response = http.get(`${__ENV.BASE_URL}/health`);

  console.log(`STATUS=${response.status}`);

  if (response.status !== 200) {
    throw new Error(`Health check failed: ${response.status}`);
  }
}
