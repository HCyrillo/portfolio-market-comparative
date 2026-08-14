# Market Comparative API

## Regras de negocio

### Mercados

- Mercados sao dados de referencia da aplicacao: podem ser consultados, mas nao ha endpoint para cria-los, altera-los ou remove-los.
- Um mercado precisa existir para receber um preco ou participar de uma comparacao.

### Produtos

- Um produto canonico e criado com nome, categoria e disponibilidade obrigatorios.
- O nome e a categoria devem conter texto; a disponibilidade deve ser booleana.
- Produtos nao sao removidos fisicamente. A disponibilidade pode ser alterada, preservando os precos ja cadastrados e seu historico.
- Um produto indisponivel pode continuar com precos cadastrados, mas nao pode ser usado em uma comparacao.
- A busca de produtos considera apenas o nome e nao diferencia maiusculas de minusculas, seguindo as regras de localidade `pt-BR`.

### Precos

- Um preco sempre pertence a um unico par de mercado e produto; ambos devem existir antes do cadastro.
- So pode existir um preco por combinacao de mercado e produto. Uma segunda tentativa para o mesmo par retorna conflito (`409`).
- O valor deve ser um numero positivo, com no maximo duas casas decimais.
- Valores sao armazenados como centavos inteiros (`priceInCents`) e convertidos para reais apenas nas respostas da API. Isso evita imprecisao de ponto flutuante no calculo da economia.
- A atualizacao de preco altera somente o valor e a data de atualizacao; mercado e produto vinculados nao mudam.
- A listagem de precos pode ser filtrada por mercado, produto ou ambos e retorna o nome das entidades relacionadas.

### Comparacao

- A comparacao recebe exatamente um produto e dois mercados: origem e destino.
- Os dois mercados devem ser diferentes.
- Produto e mercados devem existir. Para comparacao, erros de inexistencia retornam `400`.
- O produto precisa estar disponivel para comparacao.
- Os dois mercados devem ter preco cadastrado para o produto. A ausencia de preco em qualquer um deles retorna `422` e identifica o mercado sem cadastro.
- Quando os valores sao iguais, o resultado informa que os dois mercados possuem o mesmo preco e nao define um vencedor.
- Quando os valores diferem, o menor preco e declarado como melhor preco. A economia corresponde a diferenca exata entre o maior e o menor valor.

### Identificadores e historico

- Identificadores de produtos e precos sao numericos, sequenciais e gerados a partir do maior identificador existente no respectivo conjunto de dados.
- Registros possuem `createdAt` e `updatedAt`. A criacao define ambos; alteracoes de disponibilidade ou preco atualizam somente `updatedAt`.

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

Instale as dependências:

```bash
npm install
```

Execute a aplicação:

```bash
npm start
```

Modo de desenvolvimento:

```bash
npm run dev
```

Lint:

```bash
npm run lint
npm run lint:fix
```

API: `http://localhost:3000`  
Swagger: `http://localhost:3000/portfolio-market-comparative`

---

## Testes automatizados

A suíte de testes é organizada por nível para manter responsabilidades claras e evitar duplicação desnecessária de cobertura.

```text
test/
├── unit/
│   ├── comparison.service.test.js
│   └── money.test.js
│
├── integration/
│   ├── json-data-store.integration.test.js
│   ├── product.service.integration.test.js
│   └── price.service.integration.test.js
│
├── api/
│   ├── products.api.test.js
│   ├── prices.api.test.js
│   ├── comparison.api.test.js
│   ├── errors.api.test.js
│   └── health-and-markets.api.test.js
│
├── e2e/
│   └── comparison-flow.e2e.test.js
│
└── helpers/
    ├── data-directory.js
    ├── fixtures.js
    └── mocha.setup.js
```

### Estratégia por nível

- **Unit**: valida regras isoladas e funções puras, sem acessar filesystem ou HTTP.
- **Integration**: valida a interação entre services, repositories e persistência em arquivos JSON.
- **API**: valida comportamento HTTP, status codes, payloads, validações e contratos observáveis pelo consumidor.
- **E2E**: valida apenas os fluxos críticos de negócio de ponta a ponta.

Os testes utilizam **Mocha**, **Chai**, **chai-as-promised** e **Supertest**.

O setup global dos testes deve configurar:

```text
NODE_ENV=test
```

e inicializar as extensões necessárias do Chai.

### Scripts recomendados

Para permitir execução por nível, configure os seguintes scripts no `package.json`:

```json
{
  "scripts": {
    "test": "npm run test:unit && npm run test:integration && npm run test:api && npm run test:e2e",
    "test:unit": "mocha \"test/unit/**/*.test.js\"",
    "test:integration": "mocha \"test/integration/**/*.test.js\"",
    "test:api": "mocha \"test/api/**/*.test.js\"",
    "test:e2e": "mocha \"test/e2e/**/*.test.js\""
  }
}
```

Caso o projeto utilize um setup global do Mocha, incluir o arquivo na configuração ou nos comandos de execução.

Exemplo:

```bash
mocha --require test/helpers/mocha.setup.js "test/unit/**/*.test.js"
```

Os scripts também podem incluir esse `--require` diretamente no `package.json`.

### Executar todos os testes

```bash
npm test
```

A execução completa segue:

```text
Unit
 ↓
Integration
 ↓
API
 ↓
E2E
```

### Executar apenas testes unitários

```bash
npm run test:unit
```

Principais alvos:

- regras de comparação;
- cálculo de valores monetários;
- validações de domínio isoladas.

### Executar apenas testes de integração

```bash
npm run test:integration
```

Principais alvos:

- services + repositories;
- persistência em arquivos JSON;
- atualização e recuperação de dados;
- consistência e duplicidade.

### Executar apenas testes de API

```bash
npm run test:api
```

Principais alvos:

- status HTTP;
- estrutura de request/response;
- validações;
- tratamento de erros;
- contrato exposto pela API.

### Executar apenas testes E2E

```bash
npm run test:e2e
```

### Relatório Allure local

Os relatórios Allure podem ser gerados localmente a partir das execuções automatizadas.

Para executar toda a suíte com o reporter Allure:

```bash
npm run test:allure
```

Esse comando gera os arquivos brutos em:

```text
allure-results/
```

Depois, gere o relatório HTML:

```bash
npm run allure:generate
```

O relatório será criado em:

```text
allure-report/
```

Para abrir o relatório no navegador:

```bash
npm run allure:open
```

No Windows PowerShell, caso a política de execução bloqueie o `npx.ps1`, utilize:

```powershell
npx.cmd allure open allure-report
```

Também é possível executar apenas um nível específico com Allure:

```bash
npm run test:unit:allure
npm run test:integration:allure
npm run test:api:allure
npm run test:e2e:allure
```

Após executar o nível desejado:

```bash
npm run allure:generate
npm run allure:open
```

> Antes de uma nova execução, o script `test:allure` deve limpar `allure-results` para evitar mistura de resultados de execuções anteriores.

---

### Abrir o relatório gerado pelo CI no GitHub Actions

O workflow de CI gera os seguintes artifacts quando aplicável:

```text
allure-results
allure-report
coverage-report
```

Para consultar o relatório após uma execução do GitHub Actions:

1. Acesse a aba **Actions** do repositório.
2. Abra a execução desejada do workflow **CI**.
3. Na seção **Artifacts**, baixe:

```text
allure-report
```

4. Extraia o `.zip` para uma pasta local.

Exemplo:

```text
C:\Users\SeuUsuario\Downloads\allure-report
```

5. Abra o **CMD** ou PowerShell nessa pasta.

No CMD:

```cmd
npx allure open .
```

No PowerShell, se houver bloqueio de `npx.ps1`:

```powershell
npx.cmd allure open .
```

Também é possível apontar diretamente para a pasta extraída:

```cmd
npx allure open C:\Users\SeuUsuario\Downloads\allure-report
```

ou no PowerShell:

```powershell
npx.cmd allure open C:\Users\SeuUsuario\Downloads\allure-report
```

O Allure iniciará um servidor HTTP local e abrirá o relatório no navegador.

Esse comando deve ser utilizado apenas localmente. No GitHub Actions, o workflow deve somente gerar e publicar o relatório como artifact, sem executar `allure open` ou `allure serve`.

---

### Diferença entre `allure-results` e `allure-report`

```text
Testes automatizados
        ↓
allure-results/
        ↓
allure generate
        ↓
allure-report/
        ↓
Visualização no navegador
```

- `allure-results/`: contém os resultados brutos produzidos durante a execução.
- `allure-report/`: contém o relatório HTML processado e pronto para visualização.

Para apenas consultar uma execução do CI, baixe preferencialmente `allure-report`.

O artifact `allure-results` é útil quando for necessário regenerar o relatório localmente.

Exemplo no CMD:

```cmd
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report
```

No PowerShell:

```powershell
npx.cmd allure generate allure-results --clean -o allure-report
npx.cmd allure open allure-report
```

---

### Testes de performance com k6

A API possui um conjunto de testes de performance focado em endpoints críticos, com estrutura separada em:

```text
performance/
├── k6/
│   ├── smoke/
│   │   └── health-smoke.js
│   └── critical/
│       └── comparison-critical.js
``` 

Esse conjunto tem como objetivo validar a API em carga realista e medir o comportamento do endpoint de comparação entre mercados por produto.

#### Requisitos

- a aplicação deve estar em execução localmente em `http://localhost:3000`;
- o binário do `k6` deve estar instalado no ambiente Windows;
- o cenário principal usa `30 VUs` durante `1 minuto` e verifica `p(95) < 200 ms`.

#### Instalar o k6 no Windows

A forma mais direta em Windows é usar o gerenciador de pacotes `winget`:

```powershell
winget install --id=k6.k6 -e
```

Se o `winget` não estiver disponível, também é possível usar `Chocolatey`:

```powershell
choco install k6 -y
```

Verifique a instalação:

```powershell
k6 version
```

> O k6 é um binário standalone; não exige stack adicional do Node para execução. O que precisa existir é a API em execução e o k6 instalado no sistema.

#### Executar os cenários de performance

Smoke test do health endpoint:

```powershell
npm run perf:k6:smoke
```

Carga do fluxo crítico de comparação:

```powershell
npm run perf:k6:comparison
```

Também é possível executar diretamente via k6 sem usar o script do `package.json`:

```powershell
$env:API_BASE_URL = 'http://localhost:3000'
k6 run .\performance\k6\critical\comparison-critical.js
```

O cenário crítico valida que o endpoint `/api/v1/comparison` responda com tempo compatível com a necessidade de negócio e sem falhas relevantes.

---

### Evidências no Allure

Os testes de **API** e **E2E** podem anexar evidências diretamente ao relatório.

As evidências podem incluir:

```text
Request
├── Method
├── URL
├── Query
└── Body

Response
├── Status
└── Body
```

A coleta é centralizada em:

```text
test/helpers/evidence.js
```

Isso facilita a rastreabilidade entre risco, cenário, teste e resultado.

Exemplo:

```text
RSK-003
   ↓
TS-PRD-002
   ↓
products.api.test.js
   ↓
API Evidence
   ↓
DEF-004
```


Os testes E2E são intencionalmente reduzidos e cobrem principalmente o fluxo:

```text
Cadastrar Produto
       ↓
Cadastrar Preço no Mercado A
       ↓
Cadastrar Preço no Mercado B
       ↓
Comparar Produto
       ↓
Validar Resultado
```

Também pode ser validado o fluxo de atualização de preço seguido de nova comparação.

### Isolamento dos dados de teste

Os testes automatizados devem utilizar diretórios e arquivos de dados próprios, evitando modificar os arquivos utilizados pela execução normal da aplicação.

O diretório de persistência pode ser alterado pela variável:

```text
DATA_DIR
```

Durante os testes, os helpers criam bases temporárias e independentes, permitindo que:

- um teste não dependa do resultado de outro;
- a ordem de execução não altere o resultado;
- dados de desenvolvimento não sejam modificados;
- os testes possam ser repetidos de forma determinística.

### Executar um arquivo específico

Exemplo:

```bash
npx mocha --require test/helpers/mocha.setup.js test/api/comparison.api.test.js
```

### Executar um teste pelo nome

Exemplo:

```bash
npx mocha \
  --require test/helpers/mocha.setup.js \
  test/unit/comparison.service.test.js \
  --grep "identifica o menor preço"
```

### Rastreabilidade

Quando aplicável, os testes automatizados podem utilizar os identificadores definidos nos artefatos de qualidade.

Exemplo:

```text
RSK-001
   ↓
TS-CMP-001
   ↓
comparison.service.test.js
   ↓
Execução automatizada
```

Isso permite relacionar:

```text
Risco
 ↓
Cenário
 ↓
Teste
 ↓
Resultado
```

Os documentos de estratégia, riscos e cenários ficam disponíveis no diretório `quality/`.

---

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
