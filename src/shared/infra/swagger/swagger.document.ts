interface SwaggerTag {
  name: string;
  description?: string;
}

export function createSwaggerDocument(paths: object, tags?: SwaggerTag[]) {
  return {
    openapi: '3.0.3',

    info: {
      title: 'Ticket Flow API',
      version: '1.0.0',
    },

    ...(tags?.length && { tags }),

    paths,
  };
}
