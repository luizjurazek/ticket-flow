import swaggerUi from 'swagger-ui-express';

import { ControllerRegistry } from '@/shared/infra/swagger/registry/controller.registry';
import { SwaggerExplorer } from '@/shared/infra/swagger/explorer/swagger.explorer';
import { SwaggerGenerator } from '@/shared/infra/swagger/generator/swagger.generator';
import { createSwaggerDocument } from '@/shared/infra/swagger/swagger.document';

export class SwaggerModule {
  static setup(app: any) {
    const explorer = new SwaggerExplorer();
    const generator = new SwaggerGenerator();

    const endpoints = ControllerRegistry.getAll().flatMap((controller) => explorer.explore(controller));

    const { paths, tags } = generator.generate(endpoints);
    const document = createSwaggerDocument(paths, tags);

    app.use('/docs', swaggerUi.serve, swaggerUi.setup(document));
  }
}
