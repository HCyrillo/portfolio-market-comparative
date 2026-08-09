# Market Comparative API

API REST em Node.js para cadastrar produtos e preços de supermercados e comparar o valor de um produto entre dois mercados. O projeto foi desenvolvido para estudos de Engenharia de Software e Qualidade e usa arquivos JSON locais como persistência.

## Funcionalidades

- consulta dos mercados cadastrados;
- cadastro e busca de produtos canônicos;
- alteração da disponibilidade de produtos;
- cadastro, atualização e consulta de preços;
- filtros de preço por mercado e produto;
- comparação entre dois mercados, com indicação do menor preço e da economia;
- documentação interativa com Swagger UI;
- respostas e erros em formato padronizado.

## Tecnologias e requisitos

- Node.js 18 ou superior;
- Express 4;
- express-validator;
- Swagger UI e OpenAPI 3;
- Morgan;
- ESLint 9.

## Como executar

Instale as dependências e inicie a aplicação:

```bash
npm install
npm start
```

Para desenvolvimento com reinicialização automática:

```bash
npm run dev
```

Por padrão, a API fica disponível em `http://localhost:3000`.

| Recurso | Endereço |
|---|---|
| API | `http://localhost:3000/api/v1` |
| Swagger UI | `http://localhost:3000/portfolio-market-comparative` |
| Health check | `http://localhost:3000/api/v1/health` |

### Variáveis de ambiente

| Variável | Descrição | Padrão |
|---|---|---|
| `PORT` | Porta do servidor HTTP | `3000` |
| `DATA_DIR` | Diretório dos arquivos JSON utilizados pela aplicação | `src/resources/data` |
| `NODE_ENV` | Em `production`, habilita o formato de log HTTP `combined` | não definido |

Exemplo no PowerShell:

```powershell
$env:PORT=8080
$env:DATA_DIR="C:\dados\market-comparative"
npm start
```

## Endpoints

Todas as rotas da API usam o prefixo `/api/v1`.

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/health` | Verifica a disponibilidade da API |
| `GET` | `/markets` | Lista os mercados cadastrados |
| `POST` | `/products` | Cadastra um produto canônico |
| `GET` | `/products?search=coca` | Lista produtos e permite busca parcial por nome |
| `PATCH` | `/products/:id/availability` | Altera a disponibilidade de um produto |
| `POST` | `/prices` | Cadastra o preço de um produto em um mercado |
| `GET` | `/prices?marketId=1&productId=2` | Lista preços com filtros opcionais |
| `PATCH` | `/prices/:id` | Atualiza somente o valor de um preço |
| `GET` | `/comparison?originMarketId=1&targetMarketId=2&productId=2` | Compara um produto entre dois mercados |

Os payloads, parâmetros, exemplos e códigos HTTP completos estão disponíveis no Swagger UI.

## Exemplos de uso

### Criar um produto

```bash
curl -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Café Torrado 500g","category":"Mercearia","available":true}'
```

### Cadastrar um preço

```bash
curl -X POST http://localhost:3000/api/v1/prices \
  -H "Content-Type: application/json" \
  -d '{"marketId":1,"productId":1,"price":18.90}'
```

### Comparar preços

```bash
curl "http://localhost:3000/api/v1/comparison?originMarketId=1&targetMarketId=2&productId=2"
```

Quando existe um vencedor, a resposta contém o mercado com o menor preço e a economia:

```json
{
  "data": {
    "product": { "id": 2, "name": "Arroz Tipo 1 5kg" },
    "markets": [
      { "id": 1, "name": "Assaí", "price": 28.9 },
      { "id": 2, "name": "Extra", "price": 31.9 }
    ],
    "bestPrice": {
      "marketId": 1,
      "marketName": "Assaí",
      "price": 28.9,
      "saving": 3
    }
  },
  "metadata": { "timestamp": "2026-08-09T12:00:00.000Z" }
}
```

Em caso de empate, `bestPrice` não é retornado; a resposta contém a mensagem `Os dois mercados possuem o mesmo preço.`.

## Regras de negócio

### Mercados

- Mercados são dados de referência e possuem apenas endpoint de consulta.
- Um mercado precisa existir para receber um preço ou participar de uma comparação.
- A base inicial contém Assaí, Extra, Sonda, Carrefour e Pão de Açúcar.

### Produtos

- Nome, categoria e disponibilidade são obrigatórios.
- Nome e categoria devem ser textos não vazios, e `available` deve ser booleano.
- Campos adicionais no corpo da criação ou da alteração de disponibilidade são rejeitados.
- Produtos não são excluídos: sua disponibilidade pode ser alterada, preservando os preços cadastrados.
- A busca por nome é parcial e não diferencia maiúsculas de minúsculas, conforme a localidade `pt-BR`.
- Um produto indisponível não pode participar de uma comparação.

### Preços

- Mercado e produto devem existir antes do cadastro do preço.
- Só pode existir um preço para cada combinação de mercado e produto; duplicidades retornam `409 Conflict`.
- O preço deve ser um número positivo com no máximo duas casas decimais.
- O valor é armazenado em centavos inteiros (`priceInCents`) e convertido para reais nas respostas.
- A atualização modifica somente o valor e o campo `updatedAt`.
- A listagem pode ser filtrada por `marketId`, `productId` ou ambos e inclui os nomes relacionados.

### Comparação

- A comparação exige `originMarketId`, `targetMarketId` e `productId`.
- Os mercados de origem e destino devem ser diferentes.
- Produto e mercados devem existir, e o produto deve estar disponível.
- Os dois mercados precisam ter preço para o produto; a ausência de preço retorna `422 Unprocessable Entity`.
- Em caso de diferença, vence o menor preço e `saving` representa a diferença exata entre os valores.
- Em caso de empate, nenhum vencedor é definido.

### Identificadores e datas

- IDs de produtos e preços são inteiros sequenciais, calculados a partir do maior ID existente.
- Registros possuem `createdAt` e `updatedAt` no formato ISO 8601.
- Na criação, as duas datas são iguais; atualizações modificam apenas `updatedAt`.

## Formato das respostas

Respostas de sucesso são envelopadas em `data` e `metadata`:

```json
{
  "data": {},
  "metadata": {
    "timestamp": "2026-08-09T12:00:00.000Z"
  }
}
```

Erros usam um formato único:

```json
{
  "timestamp": "2026-08-09T12:00:00.000Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Descrição do erro."
}
```

## Arquitetura

O projeto separa a interface HTTP, as regras de negócio e a persistência:

```text
Requisição HTTP
      ↓
Routes → Middlewares → Controllers
                         ↓
                      Services
                         ↓
                    Repositories
                         ↓
                    Arquivos JSON
```

```text
src/
├── config/             composição das dependências e constantes
├── controllers/        adaptação entre HTTP e serviços
├── middlewares/        validação, erros e rotas inexistentes
├── models/             entidades do domínio
├── repositories/       acesso e gravação dos arquivos JSON
├── resources/
│   ├── data/           base de dados padrão
│   └── swagger/        especificação OpenAPI
├── routes/             rotas e validações de entrada
├── services/           regras de negócio
├── utils/              erros, datas e conversão monetária
├── app.js              composição da aplicação Express
└── server.js           inicialização e encerramento do servidor
```

O armazenamento é persistente e local. As gravações são serializadas por arquivo e usam arquivo temporário seguido de renomeação, reduzindo o risco de escrita parcial. O diretório pode ser substituído com `DATA_DIR`, o que permite isolar dados em diferentes ambientes.

## Qualidade e comandos disponíveis

```bash
npm run lint
npm run lint:fix
```

A estratégia de testes está documentada em [`quality/strategy.md`](quality/strategy.md). Atualmente o projeto não possui suíte automatizada nem script `npm test`; essa documentação descreve a abordagem planejada para testes unitários, de integração, API, contrato e exploração.

## Limitações atuais

- não possui autenticação ou autorização;
- não utiliza banco de dados externo ou ORM;
- não possui paginação;
- não possui suíte de testes automatizados configurada;
- os arquivos JSON são adequados ao estudo e à execução local, não a múltiplas instâncias distribuídas.
