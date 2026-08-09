# Planejamento de Cenários de Teste — Discovery Market API

## 1. Objetivo

Este documento apresenta os principais cenários de teste identificados para a **Discovery Market API**.

Os cenários foram derivados considerando:

* regras de negócio;
* riscos do produto;
* contratos da API;
* comportamentos esperados;
* entradas válidas e inválidas;
* técnicas de teste aplicáveis.

Este documento representa **condições e cenários de teste**, não casos de teste detalhados passo a passo.

A implementação dos testes automatizados será mantida separadamente no diretório `tests/`.

---

## 2. Convenções

### Prioridade

| Prioridade | Definição                                                        |
| ---------- | ---------------------------------------------------------------- |
| P0         | Comportamento crítico para o objetivo principal do produto       |
| P1         | Comportamento importante que pode comprometer uma funcionalidade |
| P2         | Comportamento de menor impacto ou complementar                   |

### Níveis de teste

| Nível       | Objetivo                                        |
| ----------- | ----------------------------------------------- |
| Unit        | Validar regra ou comportamento isolado          |
| Integration | Validar interação entre componentes internos    |
| API         | Validar comportamento através da interface HTTP |
| E2E         | Validar fluxo completo do sistema               |

### Automação

| Valor   | Significado                                  |
| ------- | -------------------------------------------- |
| Sim     | Cenário candidato à automação                |
| Não     | Cenário prioritariamente exploratório/manual |
| Avaliar | Automação depende do custo/benefício         |

---

# 3. Health Check

## TS-HEALTH-001 — Aplicação disponível

**Cenário**

Consultar o Health Check com a aplicação disponível.

**Resultado esperado**

* retornar HTTP `200`;
* indicar status `UP`;
* resposta respeitar o contrato definido.

| Atributo   | Valor             |
| ---------- | ----------------- |
| Prioridade | P2                |
| Técnica    | Cenário funcional |
| Nível      | API               |
| Automação  | Sim               |

---

# 4. Mercados

## TS-MKT-001 — Consultar mercados cadastrados

**Cenário**

Consultar a lista de mercados disponíveis.

**Resultado esperado**

* retornar HTTP `200`;
* retornar os mercados configurados;
* estrutura da resposta respeitar o contrato.

| Atributo   | Valor             |
| ---------- | ----------------- |
| Prioridade | P1                |
| Técnica    | Cenário funcional |
| Nível      | API               |
| Automação  | Sim               |

---

# 5. Produtos

## TS-PRD-001 — Cadastrar produto válido

**Condição**

Produto possui todos os dados obrigatórios válidos.

**Exemplo**

```json
{
  "name": "Coca-Cola Original",
  "category": "Bebidas",
  "available": true
}
```

**Resultado esperado**

* produto cadastrado;
* HTTP `201`;
* identificador gerado;
* produto retornado na resposta.

| Atributo   | Valor                           |
| ---------- | ------------------------------- |
| Prioridade | P1                              |
| Técnica    | Particionamento de Equivalência |
| Nível      | API                             |
| Automação  | Sim                             |

---

## TS-PRD-002 — Cadastrar produto sem nome

**Condição**

Campo `name` ausente ou vazio.

**Resultado esperado**

* produto não cadastrado;
* erro de validação;
* resposta seguindo o padrão de erros da API.

| Atributo   | Valor                           |
| ---------- | ------------------------------- |
| Prioridade | P1                              |
| Técnica    | Particionamento de Equivalência |
| Nível      | Unit / API                      |
| Automação  | Sim                             |

---

## TS-PRD-003 — Consultar produtos

**Cenário**

Existem produtos cadastrados.

**Resultado esperado**

* HTTP `200`;
* produtos retornados;
* estrutura respeitando o contrato.

| Atributo   | Valor             |
| ---------- | ----------------- |
| Prioridade | P1                |
| Técnica    | Cenário funcional |
| Nível      | API               |
| Automação  | Sim               |

---

## TS-PRD-004 — Buscar produto por nome

**Cenário**

Realizar busca utilizando parte do nome de um produto existente.

Exemplo:

```text
GET /api/v1/products?search=coca
```

**Resultado esperado**

* retornar produtos correspondentes;
* busca funcionar conforme regras definidas para o endpoint.

| Atributo   | Valor                           |
| ---------- | ------------------------------- |
| Prioridade | P2                              |
| Técnica    | Particionamento de Equivalência |
| Nível      | API                             |
| Automação  | Sim                             |

---

# 6. Disponibilidade do Produto

## TS-AVL-001 — Tornar produto indisponível

**Pré-condição**

Produto existente e disponível.

**Ação**

```json
{
  "available": false
}
```

**Resultado esperado**

* disponibilidade atualizada;
* produto continua cadastrado;
* demais dados do produto permanecem inalterados.

| Atributo   | Valor                |
| ---------- | -------------------- |
| Prioridade | P1                   |
| Técnica    | Transição de Estados |
| Nível      | Integration / API    |
| Automação  | Sim                  |

---

## TS-AVL-002 — Reativar produto

**Pré-condição**

Produto existente e indisponível.

**Ação**

```json
{
  "available": true
}
```

**Resultado esperado**

* produto volta ao estado disponível.

```text
UNAVAILABLE
     ↓
 AVAILABLE
```

| Atributo   | Valor                |
| ---------- | -------------------- |
| Prioridade | P1                   |
| Técnica    | Transição de Estados |
| Nível      | Integration / API    |
| Automação  | Sim                  |

---

## TS-AVL-003 — Alterar disponibilidade de produto inexistente

**Resultado esperado**

* alteração não realizada;
* erro correspondente retornado.

| Atributo   | Valor                           |
| ---------- | ------------------------------- |
| Prioridade | P1                              |
| Técnica    | Particionamento de Equivalência |
| Nível      | API                             |
| Automação  | Sim                             |

---

# 7. Preços

## TS-PRC-001 — Cadastrar preço válido

**Condição**

* mercado existente;
* produto existente;
* preço válido.

Exemplo:

```json
{
  "marketId": 1,
  "productId": 5,
  "price": 8.90
}
```

**Resultado esperado**

* preço cadastrado;
* relacionamento entre mercado e produto preservado.

| Atributo   | Valor                           |
| ---------- | ------------------------------- |
| Prioridade | P0                              |
| Técnica    | Particionamento de Equivalência |
| Nível      | Integration / API               |
| Automação  | Sim                             |

---

## TS-PRC-002 — Preço igual a zero

**Entrada**

```json
{
  "price": 0.00
}
```

**Resultado esperado**

* preço rejeitado.

| Atributo   | Valor                   |
| ---------- | ----------------------- |
| Prioridade | P0                      |
| Técnica    | Análise de Valor Limite |
| Nível      | Unit / API              |
| Automação  | Sim                     |

---

## TS-PRC-003 — Menor preço válido

**Entrada**

```json
{
  "price": 0.01
}
```

**Resultado esperado**

* preço aceito.

| Atributo   | Valor                   |
| ---------- | ----------------------- |
| Prioridade | P0                      |
| Técnica    | Análise de Valor Limite |
| Nível      | Unit / API              |
| Automação  | Sim                     |

---

## TS-PRC-004 — Preço negativo

**Entrada**

```json
{
  "price": -0.01
}
```

**Resultado esperado**

* preço rejeitado.

| Atributo   | Valor                   |
| ---------- | ----------------------- |
| Prioridade | P0                      |
| Técnica    | Análise de Valor Limite |
| Nível      | Unit / API              |
| Automação  | Sim                     |

---

## TS-PRC-005 — Preço com mais de duas casas decimais

**Entrada**

```json
{
  "price": 8.999
}
```

**Resultado esperado**

* preço rejeitado.

| Atributo   | Valor                           |
| ---------- | ------------------------------- |
| Prioridade | P1                              |
| Técnica    | Particionamento de Equivalência |
| Nível      | Unit / API                      |
| Automação  | Sim                             |

---

## TS-PRC-006 — Cadastrar preço para produto inexistente

**Resultado esperado**

* preço não cadastrado;
* erro correspondente retornado.

| Atributo   | Valor                           |
| ---------- | ------------------------------- |
| Prioridade | P0                              |
| Técnica    | Particionamento de Equivalência |
| Nível      | Integration / API               |
| Automação  | Sim                             |

---

## TS-PRC-007 — Cadastrar preço para mercado inexistente

**Resultado esperado**

* preço não cadastrado;
* erro correspondente retornado.

| Atributo   | Valor                           |
| ---------- | ------------------------------- |
| Prioridade | P0                              |
| Técnica    | Particionamento de Equivalência |
| Nível      | Integration / API               |
| Automação  | Sim                             |

---

## TS-PRC-008 — Atualizar preço existente

**Pré-condição**

Existe preço:

```text
Produto: Coca-Cola
Mercado: Assaí
Preço: R$ 8,90
```

**Ação**

Atualizar para:

```text
R$ 9,20
```

**Resultado esperado**

* preço atualizado;
* não criar relacionamento duplicado para o mesmo mercado e produto;
* consultas posteriores retornam `9.20`.

| Atributo   | Valor                         |
| ---------- | ----------------------------- |
| Prioridade | P0                            |
| Técnica    | Transição / Cenário funcional |
| Nível      | Integration / API             |
| Automação  | Sim                           |

---

# 8. Comparação de Preços

A comparação representa a principal funcionalidade de negócio e terá maior profundidade de testes.

---

## TS-CMP-001 — Primeiro mercado comparado possui menor preço

**Dados**

```text
Assaí      R$ 8,90
Extra      R$ 9,50
```

**Resultado esperado**

```text
Melhor preço: Assaí
Economia: R$ 0,60
```

| Atributo   | Valor             |
| ---------- | ----------------- |
| Prioridade | P0                |
| Técnica    | Tabela de Decisão |
| Nível      | Unit / API        |
| Automação  | Sim               |

---

## TS-CMP-002 — Segundo mercado comparado possui menor preço

**Dados**

```text
Assaí      R$ 9,50
Extra      R$ 8,90
```

**Resultado esperado**

```text
Melhor preço: Extra
Economia: R$ 0,60
```

| Atributo   | Valor             |
| ---------- | ----------------- |
| Prioridade | P0                |
| Técnica    | Tabela de Decisão |
| Nível      | Unit / API        |
| Automação  | Sim               |

---

## TS-CMP-003 — Preços iguais

**Dados**

```text
Assaí      R$ 8,90
Extra      R$ 8,90
```

**Resultado esperado**

* comparação identifica empate;
* nenhum mercado é apresentado incorretamente como mais barato;
* economia não deve indicar ganho inexistente.

| Atributo   | Valor             |
| ---------- | ----------------- |
| Prioridade | P0                |
| Técnica    | Tabela de Decisão |
| Nível      | Unit / API        |
| Automação  | Sim               |

---

## TS-CMP-004 — Produto inexistente

**Resultado esperado**

* comparação não realizada;
* HTTP conforme contrato;
* mensagem correspondente.

| Atributo   | Valor             |
| ---------- | ----------------- |
| Prioridade | P0                |
| Técnica    | Tabela de Decisão |
| Nível      | API               |
| Automação  | Sim               |

---

## TS-CMP-005 — Produto indisponível

**Pré-condição**

```text
available = false
```

**Resultado esperado**

* comparação não realizada;
* erro de regra de negócio.

| Atributo   | Valor                                    |
| ---------- | ---------------------------------------- |
| Prioridade | P0                                       |
| Técnica    | Tabela de Decisão + Transição de Estados |
| Nível      | Unit / API                               |
| Automação  | Sim                                      |

---

## TS-CMP-006 — Primeiro mercado comparado sem preço

**Condição**

```text
Mercado A → sem preço
Mercado B → R$ 8,90
```

**Resultado esperado**

* comparação não realizada;
* HTTP `422`;
* mensagem informando ausência do preço.

| Atributo   | Valor             |
| ---------- | ----------------- |
| Prioridade | P0                |
| Técnica    | Tabela de Decisão |
| Nível      | API               |
| Automação  | Sim               |

---

## TS-CMP-007 — Segundo mercado comparado sem preço

**Condição**

```text
Mercado A → R$ 8,90
Mercado B → sem preço
```

**Resultado esperado**

* comparação não realizada;
* HTTP `422`.

| Atributo   | Valor             |
| ---------- | ----------------- |
| Prioridade | P0                |
| Técnica    | Tabela de Decisão |
| Nível      | API               |
| Automação  | Sim               |

---

## TS-CMP-008 — Mercado inexistente

**Resultado esperado**

* comparação não realizada;
* erro correspondente retornado.

| Atributo   | Valor             |
| ---------- | ----------------- |
| Prioridade | P0                |
| Técnica    | Tabela de Decisão |
| Nível      | API               |
| Automação  | Sim               |

---

## TS-CMP-009 — Comparar o mesmo mercado

**Entrada conceitual**

```text
originMarketId = 1
targetMarketId = 1
```

**Objetivo**

Investigar como a API trata uma comparação sem sentido de negócio.

**Resultado esperado**

O comportamento deverá seguir a regra definida para a aplicação.

Caso a regra ainda não exista, o cenário deverá ser utilizado para discutir e definir o comportamento esperado antes da automação.

| Atributo   | Valor                         |
| ---------- | ----------------------------- |
| Prioridade | P1                            |
| Técnica    | Error Guessing / Exploratório |
| Nível      | API                           |
| Automação  | Avaliar                       |

---

# 9. Fluxo End-to-End

## TS-E2E-001 — Cadastrar produto e comparar preços

**Fluxo**

```text
Cadastrar Produto
       ↓
Cadastrar preço no Assaí
       ↓
Cadastrar preço no Extra
       ↓
Consultar preços
       ↓
Comparar produto
       ↓
Validar mercado mais barato
```

**Resultado esperado**

Todo o fluxo deve manter consistência entre os dados cadastrados e o resultado final da comparação.

| Atributo   | Valor                    |
| ---------- | ------------------------ |
| Prioridade | P0                       |
| Técnica    | Cenário baseado em fluxo |
| Nível      | E2E                      |
| Automação  | Sim                      |

---

# 10. Cenários Exploratórios

Os cenários abaixo representam pontos de investigação e não necessariamente casos de teste automatizados.

### EXP-001 — Entradas inesperadas

Explorar:

* `null`;
* strings vazias;
* espaços;
* caracteres especiais;
* números enviados como string;
* propriedades extras;
* propriedades duplicadas;
* JSON malformado.

### EXP-002 — Comparação

Explorar:

* mercados iguais;
* preços muito próximos;
* preços muito altos;
* alteração de preço imediatamente antes da comparação;
* produto desativado após possuir preços cadastrados.

### EXP-003 — Consistência

Explorar:

* múltiplas atualizações consecutivas;
* consulta após atualização;
* alteração de disponibilidade;
* preservação dos preços após indisponibilidade.

---

# 11. Resumo dos Cenários Prioritários

| ID         | Área       | Cenário                      | Técnica               | Nível           | Prioridade | Automação |
| ---------- | ---------- | ---------------------------- | --------------------- | --------------- | ---------- | --------- |
| TS-PRD-001 | Produto    | Cadastro válido              | Equivalência          | API             | P1         | Sim       |
| TS-PRD-002 | Produto    | Nome inválido                | Equivalência          | Unit/API        | P1         | Sim       |
| TS-AVL-001 | Produto    | Tornar indisponível          | Estado                | Integration/API | P1         | Sim       |
| TS-PRC-001 | Preço      | Cadastro válido              | Equivalência          | Integration/API | P0         | Sim       |
| TS-PRC-002 | Preço      | Zero                         | BVA                   | Unit/API        | P0         | Sim       |
| TS-PRC-003 | Preço      | `0.01`                       | BVA                   | Unit/API        | P0         | Sim       |
| TS-PRC-004 | Preço      | Negativo                     | BVA                   | Unit/API        | P0         | Sim       |
| TS-PRC-008 | Preço      | Atualização                  | Funcional             | Integration/API | P0         | Sim       |
| TS-CMP-001 | Comparação | Origem mais barata           | Decision Table        | Unit/API        | P0         | Sim       |
| TS-CMP-002 | Comparação | Destino mais barato          | Decision Table        | Unit/API        | P0         | Sim       |
| TS-CMP-003 | Comparação | Empate                       | Decision Table        | Unit/API        | P0         | Sim       |
| TS-CMP-005 | Comparação | Produto indisponível         | Decision Table/Estado | Unit/API        | P0         | Sim       |
| TS-CMP-006 | Comparação | Origem sem preço             | Decision Table        | API             | P0         | Sim       |
| TS-CMP-007 | Comparação | Destino sem preço            | Decision Table        | API             | P0         | Sim       |
| TS-E2E-001 | Fluxo      | Produto → Preço → Comparação | Fluxo                 | E2E             | P0         | Sim       |

---

# 12. Observações

Este documento deverá evoluir durante o projeto.

Novos cenários podem ser adicionados quando:

* novos riscos forem identificados;
* testes exploratórios revelarem novos comportamentos;
* defeitos forem encontrados;
* regras de negócio forem alteradas;
* novas funcionalidades forem adicionadas.

A existência de um cenário neste documento não significa obrigatoriamente que ele deverá possuir um teste automatizado.

A decisão de automação deverá considerar risco, repetibilidade, valor do feedback e custo de manutenção.
