import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = __ENV.API_BASE_URL || 'http://localhost:3000';

export const options = {
  vus: 1,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<200'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const res = http.get(`${BASE_URL}/api/v1/health`);

  check(res, {
    'health status ok': (r) => r.status === 200,
    'health payload valid': (r) => JSON.parse(r.body).data.status === 'UP',
  });
}
