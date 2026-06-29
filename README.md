# Ticket Flow API

Sistema de fluxo de tickets com integração ao Google Gemini.

## Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) e [Docker Compose](https://docs.docker.com/compose/install/)
- Node.js `24.18.0` (versão definida no `.nvmrc`) — necessário apenas se rodar localmente sem Docker
- Conta Google com acesso ao [Google AI Studio](https://aistudio.google.com/)

## Configuração do ambiente

O projeto utiliza variáveis de ambiente para conectar ao banco de dados e à API do Gemini. Um arquivo de exemplo já vem pronto para uso:

```bash
cp .env.example .env
```

O `.env.example` contém todos os valores padrão necessários (usuário, senha e banco PostgreSQL). **Você só precisa alterar a chave do Gemini** — os demais valores já funcionam com o Docker Compose.

| Variável                            | Descrição                                                       |
| ----------------------------------- | --------------------------------------------------------------- |
| `POSTGRES_USER`                     | Usuário do PostgreSQL                                           |
| `POSTGRES_PASSWORD`                 | Senha do PostgreSQL                                             |
| `POSTGRES_DB`                       | Nome do banco de dados                                          |
| `DATABASE_URL`                      | URL de conexão com o PostgreSQL                                 |
| `GEMINI_API_KEY`                    | Chave de API do Google Gemini (**obrigatória**)                 |
| `NODE_ENV`                          | Ambiente de execução (`development` ou `production`)          |
| `TICKET_CREATE_RATE_LIMIT_MAX`      | Máximo de `POST /tickets` por janela (padrão: `10`)             |
| `TICKET_CREATE_RATE_LIMIT_WINDOW_MS`| Janela do rate limit em ms (padrão: `30000` local / `60000` .env.example) |

> **Importante:** a integração com o Gemini é essencial para o funcionamento do projeto. Sem uma `GEMINI_API_KEY` válida, as funcionalidades que dependem de IA não vão operar.

## Como obter a chave do Gemini

1. Acesse o [Google AI Studio](https://aistudio.google.com/apikey) e faça login com sua conta Google.
2. Clique em **Create API key** (Criar chave de API).
3. Selecione ou crie um projeto no Google Cloud (o AI Studio guia esse passo).
4. Crie e copie a chave gerada.
5. Cole no arquivo `.env`, substituindo o valor de `GEMINI_API_KEY`:

```env
GEMINI_API_KEY=sua-chave-aqui
```

A chave é gratuita para uso em desenvolvimento, com limites de requisições definidos pelo Google. Consulte a [documentação oficial](https://ai.google.dev/gemini-api/docs/api-key) para mais detalhes.

## Como rodar o projeto

O projeto usa **Docker** para subir a API e o PostgreSQL juntos, sem precisar instalar o banco manualmente. O `docker-compose.yml` define dois serviços:

- **database** — PostgreSQL 17, exposto na porta `5432`
- **api** / **api-dev** — aplicação Node.js, exposta na porta `3000`

### Com Docker (recomendado)

#### Desenvolvimento (hot reload)

Usa o perfil `dev` para montar o código como volume e refletir alterações automaticamente. As migrations do Prisma são aplicadas na subida.

```bash
docker compose --profile dev up --build
```

- **API:** `http://localhost:3000`
- **Serviços:** API (ts-node-dev) + PostgreSQL

Para parar os containers:

```bash
docker compose --profile dev down
```

#### Produção

Build otimizado da aplicação, sem hot reload.

```bash
docker compose up --build
```

- **API:** `http://localhost:3000`
- **Serviços:** API (Node compilado) + PostgreSQL

Para parar:

```bash
docker compose down
```

> **Dica:** na primeira execução, o Docker baixa as imagens e faz o build — pode levar alguns minutos. Nas próximas vezes, o processo é bem mais rápido.

### Localmente (sem Docker)

Se preferir rodar sem containers, você precisa ter um PostgreSQL disponível localmente.

1. **Instale as dependências:**

   ```bash
   npm install
   ```

2. **Configure o `.env`:**

   ```bash
   cp .env.example .env
   ```

   Ajuste a `DATABASE_URL` para apontar ao seu PostgreSQL local e defina a `GEMINI_API_KEY`.

3. **Execute as migrations:**

   ```bash
   npx prisma migrate dev
   ```

4. **Inicie o servidor:**

   ```bash
   npm run dev
   ```

A API ficará disponível em `http://localhost:3000`.

### Documentação da API

Com a aplicação rodando, a documentação interativa (Swagger) fica em:

**http://localhost:3000/docs**

Para testar as rotas manualmente, use também:

- [`ticket-flow.http`](ticket-flow.http) — REST Client (VS Code / Cursor)
- [`ticket-flow.postman_collection.json`](ticket-flow.postman_collection.json) — importar no Postman

---

## Referência da API

**Base URL:** `http://localhost:3000`

Todas as requisições com corpo devem enviar `Content-Type: application/json`.

### Formato de erro

Erros de negócio e validação retornam JSON no formato:

```json
{
  "status": "error",
  "message": "Descrição do erro"
}
```

Erros de validação de DTO incluem também o campo `errors`:

```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    { "field": "email", "source": "body", "message": "Invalid email address" }
  ]
}
```

### Fluxo recomendado

1. Criar um **usuário** (`POST /users`)
2. Criar um **ticket** com o `userId` retornado (`POST /tickets`) — a IA classifica canal e prioridade
3. Consultar ou atualizar tickets conforme necessário

---

### Users

#### `POST /users` — Criar usuário

Cria um novo usuário.

| Item        | Valor              |
| ----------- | ------------------ |
| **Status**  | `201 Created`      |

**Body:**

```json
{
  "name": "João Silva",
  "email": "joao.silva@example.com"
}
```

| Campo   | Tipo   | Obrigatório | Regras                          |
| ------- | ------ | ----------- | ------------------------------- |
| `name`  | string | sim         | mínimo 3 caracteres             |
| `email` | string | sim         | email válido, único no banco    |

**Resposta (`201`):**

```json
{
  "id": "uuid",
  "name": "João Silva",
  "email": "joao.silva@example.com",
  "createdAt": "2026-06-29T12:00:00.000Z",
  "updatedAt": "2026-06-29T12:00:00.000Z"
}
```

**Erros comuns:** `400` — email inválido ou já cadastrado.

---

#### `GET /users` — Listar usuários

Retorna todos os usuários cadastrados.

| Item       | Valor         |
| ---------- | ------------- |
| **Status** | `200 OK`      |
| **Body**   | não enviar    |

**Resposta (`200`):** array de usuários (mesmo formato do `POST`).

---

#### `GET /users/:id` — Buscar usuário por ID

| Item       | Valor                    |
| ---------- | ------------------------ |
| **Status** | `200 OK`                 |
| **Params** | `id` — UUID do usuário   |

**Resposta (`200`):** objeto usuário.

**Erros comuns:** `404` — usuário não encontrado.

---

#### `PUT /users/:id` — Atualizar usuário

Atualiza nome e/ou email. Pelo menos um campo deve ser enviado.

| Item       | Valor                  |
| ---------- | ---------------------- |
| **Status** | `200 OK`               |
| **Params** | `id` — UUID do usuário |

**Body (pelo menos um campo):**

```json
{
  "name": "João Silva Atualizado",
  "email": "joao.novo@example.com"
}
```

| Campo   | Tipo   | Obrigatório | Regras              |
| ------- | ------ | ----------- | ------------------- |
| `name`  | string | não         | mínimo 3 caracteres |
| `email` | string | não         | email válido        |

**Resposta (`200`):** usuário atualizado.

**Erros comuns:** `404` — usuário não encontrado; `400` — email inválido ou já em uso.

---

#### `DELETE /users/:id` — Remover usuário

| Item       | Valor                  |
| ---------- | ---------------------- |
| **Status** | `204 No Content`       |
| **Params** | `id` — UUID do usuário |
| **Body**   | não enviar             |

**Resposta (`204`):** corpo vazio.

**Erros comuns:**

- `404` — usuário não encontrado
- `409` — usuário possui tickets associados (delete bloqueado)

---

### Tickets

> **Rate limit:** `POST /tickets` é limitado por IP. Configure via `TICKET_CREATE_RATE_LIMIT_MAX` e `TICKET_CREATE_RATE_LIMIT_WINDOW_MS`. Ao exceder o limite, a API retorna `429 Too Many Requests`.

#### `POST /tickets` — Criar ticket

Cria um ticket e classifica automaticamente via Gemini (canal, prioridade e flag `manuallyReview`).

| Item       | Valor         |
| ---------- | ------------- |
| **Status** | `201 Created` |

**Body:**

```json
{
  "userId": "uuid-do-usuario",
  "message": "Não consigo acessar minha conta."
}
```

| Campo     | Tipo   | Obrigatório | Regras                          |
| --------- | ------ | ----------- | ------------------------------- |
| `userId`  | string | sim         | UUID v4 de usuário existente    |
| `message` | string | sim         | máximo 2000 caracteres          |

**Resposta (`201`):**

```json
{
  "id": "uuid",
  "userId": "uuid-do-usuario",
  "message": "Não consigo acessar minha conta.",
  "channel": "technical_support",
  "priority": "high",
  "status": "open",
  "manuallyReview": false,
  "reviewedBy": null,
  "reviewedAt": null,
  "createdAt": "2026-06-29T12:00:00.000Z",
  "updatedAt": "2026-06-29T12:00:00.000Z"
}
```

**Valores possíveis de classificação:**

| Campo            | Valores                                                                 |
| ---------------- | ----------------------------------------------------------------------- |
| `channel`        | `ombudsman`, `customer_service`, `technical_support`, `finance`, `out_of_scope` |
| `priority`       | `low`, `medium`, `high`                                                 |
| `status` inicial | sempre `open`                                                           |

**Erros comuns:**

- `400` — `userId` inválido ou `message` vazio/grande demais
- `404` — usuário não encontrado (IA **não** é chamada)
- `429` — rate limit excedido
- `500` — falha na API Gemini (fallback rule-based pode ser acionado internamente)

---

#### `GET /tickets` — Listar tickets

| Item       | Valor      |
| ---------- | ---------- |
| **Status** | `200 OK`   |
| **Body**   | não enviar |

**Resposta (`200`):** array de tickets (formato do `POST /tickets`).

---

#### `GET /tickets/:id` — Buscar ticket por ID

| Item       | Valor                    |
| ---------- | ------------------------ |
| **Status** | `200 OK`                 |
| **Params** | `id` — UUID do ticket    |

**Resposta (`200`):** objeto ticket.

**Erros comuns:** `404` — ticket não encontrado.

---

#### `GET /tickets/user/:id` — Listar tickets de um usuário

| Item       | Valor                              |
| ---------- | ---------------------------------- |
| **Status** | `200 OK`                           |
| **Params** | `id` — UUID do usuário (no path)   |

**Resposta (`200`):** array de tickets do usuário. Retorna `[]` se o usuário não tiver tickets (não valida se o usuário existe).

**Exemplo:** `GET /tickets/user/550e8400-e29b-41d4-a716-446655440000`

---

#### `PUT /tickets/:id/status` — Atualizar status do ticket

| Item       | Valor                  |
| ---------- | ---------------------- |
| **Status** | `200 OK`               |
| **Params** | `id` — UUID do ticket  |

**Body:**

```json
{
  "status": "in_progress"
}
```

| Campo    | Tipo   | Obrigatório | Valores válidos                    |
| -------- | ------ | ----------- | ---------------------------------- |
| `status` | string | sim         | `open`, `closed`, `in_progress`    |

**Resposta (`200`):** ticket com status atualizado.

**Erros comuns:** `404` — ticket não encontrado; `400` — status inválido.

---

### Resumo das rotas

| Método   | Rota                    | Descrição                    |
| -------- | ----------------------- | ---------------------------- |
| `POST`   | `/users`                | Criar usuário                |
| `GET`    | `/users`                | Listar usuários              |
| `GET`    | `/users/:id`            | Buscar usuário               |
| `PUT`    | `/users/:id`            | Atualizar usuário            |
| `DELETE` | `/users/:id`            | Remover usuário              |
| `POST`   | `/tickets`              | Criar ticket (com IA)        |
| `GET`    | `/tickets`              | Listar tickets               |
| `GET`    | `/tickets/:id`          | Buscar ticket                |
| `GET`    | `/tickets/user/:id`     | Tickets por usuário          |
| `PUT`    | `/tickets/:id/status`   | Atualizar status do ticket   |
| `GET`    | `/docs`                 | Documentação Swagger (UI)    |

---

O projeto utiliza **Jest** com dois tipos de teste:

| Tipo           | Arquivo                 | Banco                        | Docker           |
| -------------- | ----------------------- | ---------------------------- | ---------------- |
| **Unitário**   | `*.spec.ts`             | Não (repositórios in-memory) | Não              |
| **Integração** | `*.integration.spec.ts` | Sim (`ticket_flow_test`)     | Sim (PostgreSQL) |

### Testes unitários

Testam use cases de forma isolada, com repositórios fake (`InMemoryUserRepository`, `InMemoryTicketRepository`). Não precisam de Docker nem banco de dados.

```bash
# Rodar todos os testes unitários
npm test

# Modo watch
npm run test:watch

# Com cobertura
npm run test:cov
```

Os testes unitários usam o arquivo `.env.test` apenas para variáveis padrão (como `GEMINI_API_KEY` fake). A `DATABASE_URL` não é utilizada nesse fluxo.

### Testes de integração

Testam a API de ponta a ponta via **supertest** (HTTP → middleware → controller → use case → Prisma → PostgreSQL). Os arquivos seguem o sufixo `*.integration.spec.ts` (ex.: `users.integration.spec.ts`).

#### Pré-requisitos

1. Dependências instaladas:

   ```bash
   npm install
   npx prisma generate
   ```

2. PostgreSQL rodando via Docker:

   ```bash
   docker compose up -d database
   ```

3. Banco de teste `ticket_flow_test` disponível no mesmo Postgres:
   - Em **volume novo**, o script `docker/postgres/init-test-db.sql` cria o banco automaticamente na primeira subida.
   - Se o volume **já existia** antes desse script, crie o banco manualmente (apenas uma vez):

     ```bash
     docker compose exec database psql -U postgres -c "CREATE DATABASE ticket_flow_test;"
     ```

4. Arquivo `.env.test` na raiz do projeto (já incluído no repositório):

   ```env
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ticket_flow_test
   GEMINI_API_KEY=fake-key-for-testing
   NODE_ENV=test
   ```

#### Rodando

```bash
npm run test:integration
```

O comando executa automaticamente:

- **`globalSetup`** — aplica `prisma migrate deploy` no banco `ticket_flow_test`
- **Testes** — cada spec limpa as tabelas no `beforeEach` via `resetDatabase()`
- **`globalTeardown`** — fecha as conexões com o PostgreSQL

#### Primeira vez após clonar o repositório

```bash
npm install
npx prisma generate
docker compose up -d database
npm run test:integration
```

### Resumo dos scripts

| Script                     | Descrição                                |
| -------------------------- | ---------------------------------------- |
| `npm test`                 | Testes unitários                         |
| `npm run test:watch`       | Unitários em modo watch                  |
| `npm run test:cov`         | Unitários com cobertura                  |
| `npm run test:integration` | Testes de integração (HTTP + banco real) |

## Arquitetura

O projeto segue **Domain-Driven Design (DDD)** organizado em módulos de negócio independentes. Cada módulo encapsula sua própria lógica em camadas bem definidas, com **Injeção de Dependência (DI)** manual via construtores e factories.

Esse desenho traz benefícios concretos:

- **Baixo acoplamento** — camadas internas não conhecem detalhes de banco, HTTP ou frameworks
- **Facilidade de testes** — use cases são testados com implementações fake, sem banco ou servidor
- **Manutenção** — cada operação fica isolada em seu próprio use case, fácil de localizar e alterar
- **Escalabilidade** — novos módulos seguem o mesmo padrão; trocar Prisma por outro ORM exige mudar só o adapter

### Estrutura de pastas

```
src/
├── modules/
│   ├── users/                    # Módulo de usuários (exemplo de referência)
│   │   ├── domain/               # Regras de negócio puras
│   │   │   ├── entities/
│   │   │   └── repositories/     # Contratos (ports)
│   │   ├── application/          # Casos de uso e DTOs de saída
│   │   └── infrastructure/       # HTTP, Prisma, factories
│   ├── tickets/
│   └── ticket-classifier/        # Serviço de classificação com Gemini
├── shared/                       # Infraestrutura compartilhada
│   ├── database/                 # Cliente Prisma
│   ├── errors/                   # AppError, validação, parser
│   └── infra/                    # Logger, middlewares, Swagger, AI
├── app.ts                        # Configuração do Express
└── server.ts                     # Entry point HTTP
```

### Camadas (módulo `users`)

| Camada             | Pasta             | Responsabilidade                                                 |
| ------------------ | ----------------- | ---------------------------------------------------------------- |
| **Domain**         | `domain/`         | Entidades ricas, regras de negócio e contratos de repositório    |
| **Application**    | `application/`    | Casos de uso — orquestram o domínio sem conhecer infraestrutura  |
| **Infrastructure** | `infrastructure/` | Adapters: Prisma, controllers, rotas, DTOs de entrada, factories |

A regra de dependência é unidirecional: **Infrastructure → Application → Domain**. O domínio nunca importa Prisma, Express ou qualquer detalhe externo.

### Domain — entidade e contrato

A entidade `User` concentra regras de negócio e validações do domínio:

```typescript
// src/modules/users/domain/entities/user.entity.ts
export class User {
  static create(userData: ICreateUserData): User {
    return new User(userData);
  }

  update(userData: IUpdateUserData): void {
    if (!userData.name && !userData.email) {
      throw new AppError('At least one field is required to update', HttpStatus.BAD_REQUEST);
    }
    if (userData.name) this.name = userData.name;
    if (userData.email) this.email = userData.email;
    this.updatedAt = new Date();
  }
}
```

O repositório é definido como **interface (port)** no domínio — a implementação concreta fica na infraestrutura:

```typescript
// src/modules/users/domain/repositories/user.repository.interface.ts
export interface IUserRepository {
  create(user: User): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(user: User): Promise<User>;
  delete(id: string): Promise<void>;
}
```

### Application — casos de uso

Cada operação é uma classe com uma única responsabilidade. O use case recebe a interface do repositório via construtor — nunca a implementação Prisma:

```typescript
// src/modules/users/application/create-user/create-user.usecase.ts
export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userData: ICreateUserData): Promise<UserOutputDTO> {
    const userExists = await this.userRepository.findByEmail(userData.email);
    if (userExists) {
      throw new AppError('User already exists', HttpStatus.BAD_REQUEST);
    }

    const newUser = User.create(userData);
    await this.userRepository.create(newUser);
    return UserOutputDTO.fromEntity(newUser);
  }
}
```

### Infrastructure — adapters e composição (DI)

A implementação Prisma **implementa** o contrato do domínio e faz o mapeamento entre o banco e a entidade:

```typescript
// src/modules/users/infrastructure/prisma/prisma-users.repository.ts
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(user: User): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: {
        /* ... */
      },
    });
    return new User(createdUser);
  }
}
```

A **factory** é o único ponto que conhece implementações concretas — ela monta o grafo de dependências e injeta tudo via construtor:

```typescript
// src/modules/users/infrastructure/http/factories/users.controller.factory.ts
export function makeUsersController(): UsersController {
  const userRepository = new PrismaUserRepository(prisma);

  const controller = new UsersController(
    new CreateUserUseCase(userRepository),
    new UpdateUserUseCase(userRepository),
    new GetUsersUseCase(userRepository),
    new GetUserByIdUseCase(userRepository),
    new DeleteUserUseCase(userRepository),
  );

  ControllerRegistry.register(controller);
  return controller;
}
```

O controller, por sua vez, recebe os use cases prontos — sem saber como foram construídos:

```typescript
// src/modules/users/infrastructure/http/users.controller.ts
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly getUsersUseCase: GetUsersUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}
}
```

### Fluxo de uma requisição

```
HTTP Request
    ↓
users.routes.ts          → valida entrada (class-validator)
    ↓
UsersController          → delega ao use case
    ↓
CreateUserUseCase        → aplica regras de negócio
    ↓
IUserRepository          → contrato do domínio
    ↓
PrismaUserRepository     → persiste no PostgreSQL
    ↓
UserOutputDTO            → resposta JSON
```

### Testabilidade

Como os use cases dependem de **interfaces**, os testes usam um repositório em memória — sem banco, sem Docker, sem HTTP:

```typescript
// src/modules/users/application/create-user/create-user.usecase.spec.ts
describe('CreateUserUseCase', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    createUserUseCase = new CreateUserUseCase(userRepository);
  });

  it('should create a new user successfully', async () => {
    const user = await createUserUseCase.execute(buildUserData());
    expect(user.id).toBeDefined();
  });
});
```

O `InMemoryUserRepository` implementa a mesma interface `IUserRepository`, provando que a DI por contrato funciona na prática.

Para validar o fluxo HTTP completo (rotas, validação de DTOs e persistência real), utilize os **testes de integração** descritos na seção [Testes](#testes).

### Adicionando uma nova funcionalidade

Para estender um módulo existente (ex.: `users`), siga a ordem:

1. **Domain** — ajuste a entidade ou crie novos contratos, se necessário
2. **Application** — crie o use case em `application/<operacao>/`
3. **Infrastructure** — implemente no repositório Prisma, crie DTOs de entrada e método no controller
4. **Factory** — registre o novo use case em `makeUsersController()`
5. **Routes** — adicione a rota com middleware de validação
6. **Testes** — teste o use case com `InMemoryUserRepository`

Para um **novo módulo**, replique a estrutura de `users/` e registre as rotas em `src/shared/infra/http/routes/routes.ts`.

## Logs estruturados

A aplicação utiliza **Winston** encapsulado em `StructuredLogger` para registrar eventos com contexto padronizado. Em vez de strings soltas, cada log carrega metadados que facilitam rastreamento e análise em produção.

### Níveis de log

| Nível   | Uso                                               |
| ------- | ------------------------------------------------- |
| `error` | Falhas e exceções                                 |
| `warn`  | Situações inesperadas que não interrompem o fluxo |
| `info`  | Eventos gerais (ex.: servidor iniciado)           |
| `http`  | Requisições HTTP concluídas                       |
| `debug` | Detalhes para desenvolvimento                     |

O nível ativo é definido pela variável `LOG_LEVEL` ou, na ausência dela, pelo ambiente: `debug` em development e `http` em production.

### Contexto padronizado

Cada log aceita um objeto `LogContext` opcional com campos como `requestId`, `method`, `path`, `statusCode`, `durationMs`, `errorType` e `stack`. Isso permite correlacionar logs da mesma requisição e filtrar por tipo de erro.

```typescript
// src/shared/infra/logger/log-context.interface.ts
export interface LogContext {
  requestId?: string;
  method?: string;
  path?: string;
  statusCode?: number;
  errorType?: string;
  durationMs?: number;
  details?: unknown;
  stack?: string;
}
```

### Onde os logs são emitidos

- **Startup** — `server.ts` registra a porta ao subir
- **Requisições HTTP** — middleware `httpLogger` registra método, path, status e duração ao final de cada request
- **Erros** — `ErrorParser` normaliza exceções e registra com contexto completo antes de responder ao cliente
- **Request ID** — middleware `requestContext` gera (ou reutiliza) um `x-request-id` por requisição, propagado nos logs

Exemplo de log de requisição:

```typescript
// src/shared/infra/http/middlewares/http-logger.middleware.ts
StructuredLogger.http('Request completed', {
  requestId: req.requestId,
  method: req.method,
  path: req.originalUrl,
  statusCode: res.statusCode,
  durationMs: Date.now() - start,
});
```

### Formato por ambiente

- **Development** — saída colorida e legível no terminal, com stack trace e detalhes de validação formatados
- **Production** — JSON estruturado, ideal para agregadores como Datadog, CloudWatch ou ELK

## Swagger com decorators customizados

A documentação da API é gerada automaticamente a partir de **decorators TypeScript** aplicados nos controllers — sem manter um arquivo OpenAPI separado. O sistema usa `reflect-metadata` para ler metadados em tempo de execução e montar o spec.

### Acessando a documentação

Com a API rodando, acesse:

```
http://localhost:3000/docs
```

### Como funciona

1. A **factory** de cada módulo registra o controller no `ControllerRegistry`
2. O `SwaggerExplorer` percorre os métodos do controller e lê os metadados dos decorators
3. O `SwaggerGenerator` converte os metadados em paths OpenAPI 3.0
4. O `SwaggerModule` expõe a UI via `swagger-ui-express` na rota `/docs`

### Decorators disponíveis

| Decorator       | Escopo            | Função                                   |
| --------------- | ----------------- | ---------------------------------------- |
| `@ApiTags`      | Classe            | Agrupa endpoints (ex.: "Users")          |
| `@ApiRoute`     | Método            | Define método HTTP e path                |
| `@ApiOperation` | Método            | Summary e description do endpoint        |
| `@ApiResponse`  | Método            | Status code, descrição e tipo de retorno |
| `@ApiBody`      | Método            | Schema do corpo da requisição            |
| `@ApiParams`    | Método            | Parâmetros de path ou query              |
| `@ApiProperty`  | Propriedade (DTO) | Marca campos para o schema OpenAPI       |

### Exemplo no módulo `users`

O controller declara a documentação junto ao código — mesma classe que trata a requisição:

```typescript
// src/modules/users/infrastructure/http/users.controller.ts
@ApiTags('Users')
export class UsersController {
  @ApiRoute({ method: 'post', path: '/users' })
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Creates a new user with the given name and email',
  })
  @ApiResponse({
    statusCode: HttpStatus.CREATED,
    description: 'User created successfully',
    type: UserOutputDTO,
  })
  @ApiBody({ type: CreateUserInputDTO, description: 'User data' })
  async create(req: Request, res: Response): Promise<Response | void> {
    // ...
  }
}
```

Os DTOs de entrada usam `@ApiProperty` junto com `class-validator` — validação e documentação no mesmo lugar:

```typescript
// src/modules/users/infrastructure/http/dtos/create-user-input.dto.ts
export class CreateUserInputDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name!: string;

  @ApiProperty()
  @IsEmail({}, { message: 'Invalid email address' })
  email!: string;
}
```

### Registrando um novo controller

Ao criar um módulo, basta chamar `ControllerRegistry.register(controller)` na factory — o Swagger descobre os endpoints automaticamente:

```typescript
// src/modules/users/infrastructure/http/factories/users.controller.factory.ts
export function makeUsersController(): UsersController {
  const controller = new UsersController(/* use cases */);
  ControllerRegistry.register(controller);
  return controller;
}
```

Novos endpoints aparecem em `/docs` assim que o controller é registrado e os decorators estão aplicados — sem editar arquivos de configuração do Swagger manualmente.
