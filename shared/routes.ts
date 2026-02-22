import { z } from 'zod';
import { runSimulationRequestSchema, simulations } from './schema';

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
};

export const api = {
  simulations: {
    list: {
      method: 'GET' as const,
      path: '/api/simulations' as const,
      responses: {
        200: z.array(z.custom<typeof simulations.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/simulations/:id' as const,
      responses: {
        200: z.custom<typeof simulations.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/simulations' as const,
      input: runSimulationRequestSchema,
      responses: {
        201: z.custom<typeof simulations.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
