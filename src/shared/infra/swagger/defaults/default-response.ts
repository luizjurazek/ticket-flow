import { HttpMethod } from '@swagger/types/api-route.type';

export const DEFAULT_RESPONSES: Record<HttpMethod, Record<number, { description: string }>> = {
  get: {
    200: {
      description: 'Success',
    },
  },

  post: {
    201: {
      description: 'Created',
    },
  },

  put: {
    200: {
      description: 'Updated successfully',
    },
  },

  patch: {
    200: {
      description: 'Updated successfully',
    },
  },

  delete: {
    204: {
      description: 'Deleted successfully',
    },
  },
};
