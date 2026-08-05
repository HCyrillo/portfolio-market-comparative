# Market Comparative API

API REST em Node.js para estudo de Engenharia de Software e Engenharia de Qualidade. Ela compara preços de Produtos Canônicos entre os mercados Assaí, Extra, Sonda e Carrefour, persistindo os dados em arquivos JSON locais.

## Tecnologias

- Node.js e Express
- express-validator para validação
- Morgan para logs HTTP
- Swagger UI / OpenAPI 3
- ESLint

## Arquitetura

O projeto utiliza MVC com Repository. Controllers coordenam HTTP, Services concentram regras de negócio e Repositories isolam o armazenamento em memória. Essa separação reduz acoplamento e permite trocar arrays por PostgreSQL, adicionar cache, JWT, mensageria, observabilidade, testes e CI/CD sem refatorar as regras centrais.

```text
src/
├── config/          composição e configurações
├── controllers/     HTTP e formatação de respostas
├── middlewares/     validação, erros e rota inexistente
├── models/          entidades do domínio
├── repositories/    acesso aos arrays em memória
├── resources/       Swagger, Postman, exemplos e base JSON local
├── routes/          definição dos endpoints
├── services/        regras de negócio
├── app.js           composição do Express
└── server.js         inicialização
```

Fluxo principal:

```text
Mercado
  ↓
Produto Canônico
  ↓
Preço
  ↓
Comparação
```

## Instalação e execução

```bash
npm install
npm start
```

Desenvolvimento:

```bash
npm run dev
```

Lint:

```bash
npm run lint
npm run lint:fix
```

API: `http://localhost:3000`  
Swagger: `http://localhost:3000/api-docs`

## Endpoints

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/v1/health` | Health check |
| GET | `/api/v1/markets` | Lista mercados padrão |
| POST | `/api/v1/products` | Cria produto canônico |
| GET | `/api/v1/products?search=coca` | Lista e busca produtos |
| PATCH | `/api/v1/products/:id/availability` | Altera disponibilidade |
| POST | `/api/v1/prices` | Cria preço |
| PATCH | `/api/v1/prices/:id` | Atualiza o valor de um preço |
| GET | `/api/v1/prices` | Lista preços, filtrável por mercado/produto |
| GET | `/api/v1/comparison` | Compara dois mercados |

As respostas de sucesso são envelopadas em `data` e `metadata.timestamp`; erros seguem um formato único com timestamp, status, error e message. Toda a documentação de payloads, parâmetros, exemplos e códigos HTTP está disponível no Swagger.

## Decisões

Os dados são persistidos localmente em `data/markets.json`, `data/products.json` e `data/prices.json`, sem banco de dados ou ORM. O diretório pode ser alterado com a variável `DATA_DIR`, permitindo uma base isolada nos testes. Escritas usam arquivo temporário e rename atômico. Os valores monetários são armazenados internamente em centavos inteiros e convertidos para BRL apenas nas respostas. Produtos não são removidos fisicamente: sua disponibilidade é alterada e o histórico de preços permanece íntegro.
