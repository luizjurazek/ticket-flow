# Ticket Flow API

## Como Rodar o Projeto com Docker

### 1. Ambiente de Desenvolvimento (Hot Reload)
Recomendado para programar. As alterações no código refletem automaticamente no container.
```bash
docker compose --profile dev up api-dev --build
```
*   **Porta**: 3000
*   **Serviço**: `api-dev`

### 2. Ambiente de Produção (Build)
Usa o build otimizado. As alterações no código **não** refletem automaticamente.
```bash
docker compose up api --build
```
*   **Porta**: 3000
*   **Serviço**: `api`

### Requisitos
- Docker e Docker Compose instalados.
- Variáveis de ambiente configuradas no arquivo `.env`.
