export function createSwaggerDocument(paths: object) {
  return {
    openapi: '3.0.3',

    info: {
      title: 'Ticket Flow API',
      version: '1.0.0',
    },

    paths,
  };
}
