# Ticket Flow API

Sistema de fluxo de tickets com integração ao Google Gemini.

## Como Rodar o Projeto

### 🐳 Com Docker (Recomendado)

#### 1. Ambiente de Desenvolvimento (Hot Reload)

Usa o perfil `dev` para habilitar volumes e refletir alterações no código automaticamente.

```bash
docker compose --profile dev up --build
```

- **Acessível em**: `http://localhost:3000`
- **Serviços**: API (ts-node-dev) + PostgreSQL.

#### 2. Ambiente de Produção

Build otimizado da aplicação.

```bash
docker compose up --build
```

---

### 💻 Localmente (Sem Docker)

Se preferir rodar sem containers:

1.  **Instale as dependências**:
    ```bash
    npm install
    ```
2.  **Configure o `.env`**:
    Certifique-se de ter um banco PostgreSQL rodando e a `DATABASE_URL` configurada.
3.  **Execute as migrations**:
    ```bash
    npx prisma migrate dev
    ```
4.  **Inicie o servidor**:
    ```bash
    npm run dev
    ```

---

## 🧪 Testes

O projeto utiliza **Jest** para testes unitários e de integração.

```bash
# Rodar todos os testes
npm test

# Modo Watch
npm run test:watch
```

## Requisitos

- Node.js (versão no `.nvmrc`)
- Docker & Docker Compose (opcional)
- Chave de API do Gemini no `.env`
