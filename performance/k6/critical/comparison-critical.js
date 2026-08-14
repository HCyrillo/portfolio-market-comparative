import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.API_BASE_URL || 'http://localhost:3000';

export const options = {
  scenarios: {
    comparison_profile: {
      executor: 'constant-vus',
      vus: 30,
      duration: '1m',
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<200'],
    http_req_failed: ['rate<0.01'],
    checks: ['rate>0.99'],
  },
};

const headers = {
  'Content-Type': 'application/json',
};

function uniqueProductName() {
  return `PROD-${__VU}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createProduct() {
  const name = uniqueProductName();
  const payload = JSON.stringify({
    name,
    category: 'Mercearia',
    available: true,
  });

  const res = http.post(`${BASE_URL}/api/v1/products`, payload, { headers });

  check(res, {
    'product created': (r) => r.status === 201,
  });

  if (res.status !== 201) {
    return null;
  }

  return res.json('data');
}

function createPrice(productId, marketId, amount) {
  const payload = JSON.stringify({
    marketId,
    productId,
    price: amount,
  });

  const res = http.post(`${BASE_URL}/api/v1/prices`, payload, { headers });

  check(res, {
    'price created': (r) => r.status === 201,
  });

  return res;
}

export default function () {
  const product = createProduct();

  if (!product) {
    sleep(0.5);
    return;
  }

  const priceA = Number((8.9 + Math.random() * 0.5).toFixed(2));
  const priceB = Number((9.5 + Math.random() * 0.8).toFixed(2));

  createPrice(product.id, 1, priceA);
  createPrice(product.id, 2, priceB);

  const comparisonRes = http.get(`${BASE_URL}/api/v1/comparison`, {
    params: {
      originMarketId: 1,
      targetMarketId: 2,
      productId: product.id,
    },
    headers: { Accept: 'application/json' },
  });

  check(comparisonRes, {
    'comparison ok': (r) => r.status === 200,
  });

  sleep(0.2);
}
