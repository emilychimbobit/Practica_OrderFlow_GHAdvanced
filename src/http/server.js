import http from 'node:http';
import { InMemoryOrderRepository } from '../repositories/in-memory-order-repository.js';
import {
  InvalidOrderStateError,
  OrderNotFoundError,
  OrderService,
  ValidationError
} from '../services/order-service.js';

const repository = new InMemoryOrderRepository();
const orderService = new OrderService(repository);

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host}`);

    if (request.method === 'GET' && url.pathname === '/health') {
      return sendJson(response, 200, { status: 'ok' });
    }

    if (request.method === 'GET' && url.pathname === '/orders') {
      return sendJson(response, 200, await orderService.listOrders());
    }

    if (request.method === 'POST' && url.pathname === '/orders') {
      const body = await readJsonBody(request);
      return sendJson(response, 201, await orderService.createOrder(body));
    }

    const orderMatch = url.pathname.match(/^\/orders\/([^/]+)$/);
    if (request.method === 'GET' && orderMatch) {
      return sendJson(response, 200, await orderService.getOrder(orderMatch[1]));
    }

    const cancelMatch = url.pathname.match(/^\/orders\/([^/]+)\/cancel$/);
    if (request.method === 'POST' && cancelMatch) {
      return sendJson(response, 200, await orderService.cancelOrder(cancelMatch[1]));
    }

    return sendJson(response, 404, { error: 'Route not found' });
  } catch (error) {
    return handleError(response, error);
  }
});

const port = Number(process.env.PORT ?? 3000);
server.listen(port, () => {
  console.log(`OrderFlow listening on http://localhost:${port}`);
});

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { 'content-type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(payload));
}

async function readJsonBody(request) {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  const rawBody = Buffer.concat(chunks).toString('utf8');

  if (!rawBody) {
    return {};
  }

  try {
    return JSON.parse(rawBody);
  } catch {
    throw new ValidationError('Request body must contain valid JSON');
  }
}

function handleError(response, error) {
  if (error instanceof ValidationError) {
    return sendJson(response, 400, { error: error.message });
  }

  if (error instanceof OrderNotFoundError) {
    return sendJson(response, 404, { error: error.message });
  }

  if (error instanceof InvalidOrderStateError) {
    return sendJson(response, 409, { error: error.message });
  }

  console.error(error);
  return sendJson(response, 500, { error: 'Unexpected server error' });
}
