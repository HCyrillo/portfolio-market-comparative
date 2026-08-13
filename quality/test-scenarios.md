# Planejamento de Cenários de Teste --- Discovery Market API

## 1. Objetivo

Este documento apresenta os principais cenários de teste identificados
para a **Discovery Market API**.

Os cenários foram derivados considerando:

-   regras de negócio;
-   riscos do produto;
-   contratos da API;
-   comportamentos esperados;
-   entradas válidas e inválidas;
-   técnicas de teste aplicáveis.

Este documento representa **condições e cenários de teste**, não casos
de teste detalhados passo a passo.

A implementação dos testes automatizados será mantida separadamente no
diretório `tests/`.

------------------------------------------------------------------------

## 2. Convenções

### Prioridade

  --------------------------------------------------------------------------
  Prioridade   Definição
  ------------ -------------------------------------------------------------
  P0           Comportamento crítico para o objetivo principal do produto

  P1           Comportamento importante que pode comprometer uma
               funcionalidade

  P2           Comportamento de menor impacto ou complementar
  --------------------------------------------------------------------------

### Níveis de teste

  Nível         Objetivo
  ------------- -------------------------------------------------
  Unit          Validar regra ou comportamento isolado
  Integration   Validar interação entre componentes internos
  API           Validar comportamento através da interface HTTP
  E2E           Validar fluxo completo do sistema

### Automação

  Valor     Significado
  --------- ----------------------------------------------
  Sim       Cenário candidato à automação
  Não       Cenário prioritariamente exploratório/manual
  Avaliar   Automação depende do custo/benefício

### Heurísticas

A análise de cenários também considera heurísticas de exploração, como:

-   VADER (Stuart Ashman) --- gera ideias de teste para variações, dados
    inválidos e diferentes estados/fluxos. Essa heurística é aplicada
    especialmente na definição dos cenários exploratórios.

### Técnicas de teste

-   Particionamento de Equivalência
-   Análise de Valor Limite
-   Tabela de Decisão
-   Transição de Estados

### Tipos de teste

-   Exploratório --- valida hipóteses e busca comportamentos inesperados
    durante a execução.

------------------------------------------------------------------------

## Estrutura dos Cenários

Cada cenário registra apenas as informações necessárias para o
planejamento e design dos testes:

-   identificador;
-   risco relacionado;
-   condição, entrada ou fluxo;
-   resultado esperado;
-   prioridade;
-   técnica;
-   nível;
-   decisão de automação.

Os detalhes executáveis permanecem nos testes automatizados no diretório
`tests/`.

------------------------------------------------------------------------

# 3. Health Check

## TS-HEALTH-001 --- Aplicação disponível

**Risco relacionado:** N/A --- não há risco específico mapeado no
`risk-analysis.md` para o Health Check.

**Condição**

Aplicação inicializada e disponível para receber requisições.

**Ação**

``` text
GET /api/v1/health
```

**Resultado esperado**

-   HTTP `200`;
-   campo `status` com valor `UP`;
-   estrutura da resposta conforme contrato.

  Atributo     Valor
  ------------ -------------------
  Prioridade   P2
  Técnica      Cenário funcional
  Nível        API
  Automação    Sim

------------------------------------------------------------------------

# 4. Mercados

## TS-MKT-001 --- Consultar mercados cadastrados

**Risco relacionado:** N/A --- não há risco específico mapeado no
`risk-analysis.md` para a consulta de mercados.

**Condição**

Existem mercados inicializados na base de dados utilizada pela
aplicação.

**Ação**

``` text
GET /api/v1/markets
```

**Resultado esperado**

-   HTTP `200`;
-   array `data` contendo os mercados cadastrados;
-   cada mercado respeita a estrutura definida no contrato.

  Atributo     Valor
  ------------ -------------------
  Prioridade   P1
  Técnica      Cenário funcional
  Nível        API
  Automação    Sim

------------------------------------------------------------------------

# 5. Produtos

## TS-PRD-001 --- Cadastrar produto válido

**Risco relacionado:** N/A --- não há risco específico mapeado no
`risk-analysis.md` para o cadastro válido de produto.

**Condição**

Payload contém todos os campos obrigatórios válidos.

**Dados**

``` json
{
  "name": "Coca-Cola Original",
  "category": "Bebidas",
  "available": true
}
```

**Resultado esperado**

-   HTTP `201`;
-   produto criado;
-   identificador gerado;
-   estrutura da resposta conforme contrato;
-   produto disponível para consultas posteriores.

  Atributo     Valor
  ------------ ---------------------------------
  Prioridade   P1
  Técnica      Particionamento de Equivalência
  Nível        API
  Automação    Sim

------------------------------------------------------------------------

## TS-PRD-002 --- Cadastrar produto sem nome

**Risco relacionado:** N/A --- não há risco específico mapeado no
`risk-analysis.md` para validação do nome do produto.

**Condição**

Campo `name` ausente ou vazio.

**Resultado esperado**

-   produto não cadastrado;
-   erro de validação;
-   resposta seguindo o padrão de erros da API.

  Atributo     Valor
  ------------ ---------------------------------
  Prioridade   P1
  Técnica      Particionamento de Equivalência
  Nível        Unit / API
  Automação    Sim

------------------------------------------------------------------------

## TS-PRD-003 --- Consultar produtos

**Risco relacionado:** N/A --- não há risco específico mapeado no
`risk-analysis.md` para consulta de produtos.

**Cenário**

Existem produtos cadastrados.

**Resultado esperado**

-   HTTP `200`;
-   produtos retornados;
-   estrutura respeitando o contrato.

  Atributo     Valor
  ------------ -------------------
  Prioridade   P1
  Técnica      Cenário funcional
  Nível        API
  Automação    Sim

------------------------------------------------------------------------

## TS-PRD-004 --- Buscar produto por nome

**Risco relacionado:** N/A --- não há risco específico mapeado no
`risk-analysis.md` para busca de produtos por nome.

**Cenário**

Realizar busca utilizando parte do nome de um produto existente.

Exemplo:

``` text
GET /api/v1/products?search=coca
```

**Resultado esperado**

-   retornar produtos correspondentes;
-   busca funcionar conforme regras definidas para o endpoint.

  Atributo     Valor
  ------------ ---------------------------------
  Prioridade   P2
  Técnica      Particionamento de Equivalência
  Nível        API
  Automação    Sim

------------------------------------------------------------------------

# 6. Disponibilidade do Produto

## TS-AVL-001 --- Tornar produto indisponível

**Risco relacionado:** RSK-005 --- Produto indisponível ainda participa
da comparação.

**Pré-condição**

Produto existente e disponível.

**Ação**

``` json
{
  "available": false
}
```

**Resultado esperado**

-   disponibilidade atualizada;
-   produto continua cadastrado;
-   demais dados do produto permanecem inalterados.

  Atributo     Valor
  ------------ ----------------------
  Prioridade   P1
  Técnica      Transição de Estados
  Nível        Integration / API
  Automação    Sim

------------------------------------------------------------------------

## TS-AVL-002 --- Reativar produto

**Risco relacionado:** RSK-005 --- Produto indisponível ainda participa
da comparação.

**Pré-condição**

Produto existente e indisponível.

**Ação**

``` json
{
  "available": true
}
```

**Resultado esperado**

-   produto volta ao estado disponível.

``` text
UNAVAILABLE
     ↓
 AVAILABLE
```

  Atributo     Valor
  ------------ ----------------------
  Prioridade   P1
  Técnica      Transição de Estados
  Nível        Integration / API
  Automação    Sim

------------------------------------------------------------------------

## TS-AVL-003 --- Alterar disponibilidade de produto inexistente

**Risco relacionado:** RSK-006 --- Entidade inexistente utilizada em
operação.

**Resultado esperado**

-   alteração não realizada;
-   erro correspondente retornado.

  Atributo     Valor
  ------------ ---------------------------------
  Prioridade   P1
  Técnica      Particionamento de Equivalência
  Nível        API
  Automação    Sim

------------------------------------------------------------------------

# 7. Preços

## TS-PRC-001 --- Cadastrar preço válido

**Risco relacionado:** RSK-003 --- Preço inválido aceito.

**Condição**

-   mercado existente;
-   produto existente;
-   preço válido.

Exemplo:

``` json
{
  "marketId": 1,
  "productId": 5,
  "price": 8.90
}
```

**Resultado esperado**

-   preço cadastrado;
-   relacionamento entre mercado e produto preservado.

  Atributo     Valor
  ------------ ---------------------------------
  Prioridade   P0
  Técnica      Particionamento de Equivalência
  Nível        Integration / API
  Automação    Sim

------------------------------------------------------------------------

## TS-PRC-002 --- Preço igual a zero

**Risco relacionado:** RSK-003 --- Preço inválido aceito.

**Entrada**

``` json
{
  "price": 0.00
}
```

**Resultado esperado**

-   preço rejeitado.

  Atributo     Valor
  ------------ -------------------------
  Prioridade   P0
  Técnica      Análise de Valor Limite
  Nível        Unit / API
  Automação    Sim

------------------------------------------------------------------------

## TS-PRC-003 --- Menor preço válido

**Risco relacionado:** RSK-003 --- Preço inválido aceito.

**Entrada**

``` json
{
  "price": 0.01
}
```

**Resultado esperado**

-   preço aceito.

  Atributo     Valor
  ------------ -------------------------
  Prioridade   P0
  Técnica      Análise de Valor Limite
  Nível        Unit / API
  Automação    Sim

------------------------------------------------------------------------

## TS-PRC-004 --- Preço negativo

**Risco relacionado:** RSK-003 --- Preço inválido aceito.

**Entrada**

``` json
{
  "price": -0.01
}
```

**Resultado esperado**

-   preço rejeitado.

  Atributo     Valor
  ------------ -------------------------
  Prioridade   P0
  Técnica      Análise de Valor Limite
  Nível        Unit / API
  Automação    Sim

------------------------------------------------------------------------

## TS-PRC-005 --- Preço com mais de duas casas decimais

**Risco relacionado:** RSK-003 --- Preço inválido aceito.

**Entrada**

``` json
{
  "price": 8.999
}
```

**Resultado esperado**

-   preço rejeitado.

  Atributo     Valor
  ------------ ---------------------------------
  Prioridade   P1
  Técnica      Particionamento de Equivalência
  Nível        Unit / API
  Automação    Sim

------------------------------------------------------------------------

## TS-PRC-006 --- Cadastrar preço para produto inexistente

**Risco relacionado:** RSK-006 --- Entidade inexistente utilizada em
operação.

**Resultado esperado**

-   preço não cadastrado;
-   erro correspondente retornado.

  Atributo     Valor
  ------------ ---------------------------------
  Prioridade   P0
  Técnica      Particionamento de Equivalência
  Nível        Integration / API
  Automação    Sim

------------------------------------------------------------------------

## TS-PRC-007 --- Cadastrar preço para mercado inexistente

**Risco relacionado:** RSK-006 --- Entidade inexistente utilizada em
operação.

**Resultado esperado**

-   preço não cadastrado;
-   erro correspondente retornado.

  Atributo     Valor
  ------------ ---------------------------------
  Prioridade   P0
  Técnica      Particionamento de Equivalência
  Nível        Integration / API
  Automação    Sim

------------------------------------------------------------------------

## TS-PRC-008 --- Atualizar preço existente

**Risco relacionado:** RSK-004 --- Atualização de preço gera
duplicidade.

**Pré-condição**

Existe preço:

``` text
Produto: Coca-Cola
Mercado: Assaí
Preço: R$ 8,90
```

**Ação**

Atualizar para:

``` text
R$ 9,20
```

**Resultado esperado**

-   preço atualizado;
-   não criar relacionamento duplicado para o mesmo mercado e produto;
-   consultas posteriores retornam `9.20`.

  Atributo     Valor
  ------------ -------------------------------
  Prioridade   P0
  Técnica      Transição / Cenário funcional
  Nível        Integration / API
  Automação    Sim

------------------------------------------------------------------------

## TS-PRC-009 --- Preço com tipo inválido

**Risco relacionado:** RSK-003 --- Preço inválido aceito.

**Entrada**

``` json
{
  "price": "8.90"
}
```

**Resultado esperado**

-   preço rejeitado;
-   erro de validação;
-   resposta seguindo o padrão de erros da API.

  Atributo     Valor
  ------------ ---------------------------------
  Prioridade   P0
  Técnica      Particionamento de Equivalência
  Nível        Unit / API
  Automação    Sim

------------------------------------------------------------------------

# 8. Comparação de Preços

A comparação representa a principal funcionalidade de negócio e terá
maior profundidade de testes.

------------------------------------------------------------------------

## TS-CMP-001 --- Primeiro mercado comparado possui menor preço

**Risco relacionado:** RSK-001 --- Comparação de preços incorreta.

**Dados**

``` text
Assaí      R$ 8,90
Extra      R$ 9,50
```

**Resultado esperado**

``` text
Melhor preço: Assaí
Economia: R$ 0,60
```

  Atributo     Valor
  ------------ -------------------
  Prioridade   P0
  Técnica      Tabela de Decisão
  Nível        Unit / API
  Automação    Sim

------------------------------------------------------------------------

## TS-CMP-002 --- Segundo mercado comparado possui menor preço

**Risco relacionado:** RSK-001 --- Comparação de preços incorreta.

**Dados**

``` text
Assaí      R$ 9,50
Extra      R$ 8,90
```

**Resultado esperado**

``` text
Melhor preço: Extra
Economia: R$ 0,60
```

  Atributo     Valor
  ------------ -------------------
  Prioridade   P0
  Técnica      Tabela de Decisão
  Nível        Unit / API
  Automação    Sim

------------------------------------------------------------------------

## TS-CMP-003 --- Preços iguais

**Risco relacionado:** RSK-001 --- Comparação de preços incorreta.

**Dados**

``` text
Assaí      R$ 8,90
Extra      R$ 8,90
```

**Resultado esperado**

-   comparação identifica empate;
-   nenhum mercado é apresentado incorretamente como mais barato;
-   economia não deve indicar ganho inexistente.

  Atributo     Valor
  ------------ -------------------
  Prioridade   P0
  Técnica      Tabela de Decisão
  Nível        Unit / API
  Automação    Sim

------------------------------------------------------------------------

## TS-CMP-004 --- Produto inexistente

**Risco relacionado:** RSK-006 --- Entidade inexistente utilizada em
operação.

**Resultado esperado**

-   comparação não realizada;
-   HTTP conforme contrato;
-   mensagem correspondente.

  Atributo     Valor
  ------------ -------------------
  Prioridade   P0
  Técnica      Tabela de Decisão
  Nível        API
  Automação    Sim

------------------------------------------------------------------------

## TS-CMP-005 --- Produto indisponível

**Risco relacionado:** RSK-005 --- Produto indisponível ainda participa
da comparação.

**Pré-condição**

``` text
available = false
```

**Resultado esperado**

-   comparação não realizada;
-   erro de regra de negócio.

  Atributo     Valor
  ------------ ------------------------------------------
  Prioridade   P0
  Técnica      Tabela de Decisão + Transição de Estados
  Nível        Unit / API
  Automação    Sim

------------------------------------------------------------------------

## TS-CMP-006 --- Primeiro mercado comparado sem preço

**Risco relacionado:** RSK-002 --- Comparação realizada sem preço
válido.

**Condição**

``` text
Mercado A → sem preço
Mercado B → R$ 8,90
```

**Resultado esperado**

-   comparação não realizada;
-   HTTP `422`;
-   mensagem informando ausência do preço.

  Atributo     Valor
  ------------ -------------------
  Prioridade   P0
  Técnica      Tabela de Decisão
  Nível        API
  Automação    Sim

------------------------------------------------------------------------

## TS-CMP-007 --- Segundo mercado comparado sem preço

**Risco relacionado:** RSK-002 --- Comparação realizada sem preço
válido.

**Condição**

``` text
Mercado A → R$ 8,90
Mercado B → sem preço
```

**Resultado esperado**

-   comparação não realizada;
-   HTTP `422`.

  Atributo     Valor
  ------------ -------------------
  Prioridade   P0
  Técnica      Tabela de Decisão
  Nível        API
  Automação    Sim

------------------------------------------------------------------------

## TS-CMP-008 --- Mercado inexistente

**Risco relacionado:** RSK-006 --- Entidade inexistente utilizada em
operação.

**Resultado esperado**

-   comparação não realizada;
-   erro correspondente retornado.

  Atributo     Valor
  ------------ -------------------
  Prioridade   P0
  Técnica      Tabela de Decisão
  Nível        API
  Automação    Sim

------------------------------------------------------------------------

## TS-CMP-009 --- Comparar o mesmo mercado

**Risco relacionado:** N/A --- cenário exploratório para uma regra de
negócio ainda não definida.

**Entrada conceitual**

``` text
originMarketId = 1
targetMarketId = 1
```

**Objetivo**

Investigar como a API trata uma comparação sem sentido de negócio.

**Resultado esperado**

O comportamento deverá seguir a regra definida para a aplicação.

Caso a regra ainda não exista, o cenário deverá ser utilizado para
discutir e definir o comportamento esperado antes da automação.

  Atributo     Valor
  ------------ -------------------------------
  Prioridade   P1
  Técnica      Error Guessing / Exploratório
  Nível        API
  Automação    Avaliar

------------------------------------------------------------------------

# 9. Fluxo End-to-End

## TS-E2E-001 --- Cadastrar produto e comparar preços

**Risco relacionado:** RSK-001 / RSK-003 --- valida o fluxo crítico de
preço e comparação.

**Fluxo**

``` text
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

Todo o fluxo deve manter consistência entre os dados cadastrados e o
resultado final da comparação.

  Atributo     Valor
  ------------ --------------------------
  Prioridade   P0
  Técnica      Cenário baseado em fluxo
  Nível        E2E
  Automação    Sim

------------------------------------------------------------------------

## TS-E2E-002 --- Produto torna-se indisponível antes da comparação

**Risco relacionado:** RSK-005 --- Produto indisponível ainda participa
da comparação.

**Fluxo**

``` text
Cadastrar Produto
       ↓
Cadastrar preço no Assaí
       ↓
Cadastrar preço no Extra
       ↓
Alterar produto para indisponível
       ↓
Tentar comparar produto
```

**Resultado esperado**

A comparação não deve ser realizada e a API deve retornar o erro de
regra de negócio.

  Atributo     Valor
  ------------ ----------------------
  Prioridade   P0
  Técnica      Transição de Estados
  Nível        E2E
  Automação    Sim

------------------------------------------------------------------------

## TS-E2E-003 --- Atualizar preço e validar comparação com preço atualizado

**Risco relacionado:** RSK-004 / RSK-001 --- valida atualização de preço
e reflexo correto na comparação.

**Fluxo**

``` text
Cadastrar Produto
       ↓
Cadastrar preço no Assaí
       ↓
Atualizar preço no Assaí
       ↓
Cadastrar preço no Extra
       ↓
Comparar produto
       ↓
Validar economia com preço atualizado
```

**Resultado esperado**

A comparação deve usar o preço atualizado e calcular a economia
corretamente.

  Atributo     Valor
  ------------ -----------------
  Prioridade   P0
  Técnica      Fluxo funcional
  Nível        E2E
  Automação    Sim

------------------------------------------------------------------------

## TS-E2E-004 --- Comparação falha quando apenas um mercado tem preço

**Risco relacionado:** RSK-002 --- Comparação realizada sem preço
válido.

**Fluxo**

``` text
Cadastrar Produto
       ↓
Cadastrar preço no Assaí
       ↓
Tentar comparar produto
```

**Resultado esperado**

A comparação não deve ser realizada e a API deve retornar a mensagem de
preço ausente.

  Atributo     Valor
  ------------ -----------------
  Prioridade   P0
  Técnica      Fluxo funcional
  Nível        E2E
  Automação    Sim

------------------------------------------------------------------------

# 10. Cenários Exploratórios

Os cenários abaixo representam pontos de investigação e não
necessariamente casos de teste automatizados.

### EXP-001 --- Entradas inesperadas

**Risco relacionado:** RSK-003 / RSK-006 --- entradas inválidas podem
afetar validações de preço e referências de entidades.

Explorar:

-   `null`;
-   strings vazias;
-   espaços;
-   caracteres especiais;
-   números enviados como string;
-   propriedades extras;
-   propriedades duplicadas;
-   JSON malformado.

### EXP-002 --- Comparação

**Risco relacionado:** RSK-001 / RSK-002 / RSK-005 --- exploração
concentrada nos principais riscos da comparação.

Explorar:

-   mercados iguais;
-   preços muito próximos;
-   preços muito altos;
-   alteração de preço imediatamente antes da comparação;
-   produto desativado após possuir preços cadastrados.

Esses itens também foram pensados com base em VADER, para cobrir
variações de estado e dados inesperados.

### EXP-003 --- Consistência

**Risco relacionado:** RSK-004 / RSK-005 --- consistência após
atualização de preço e mudança de disponibilidade.

Explorar:

-   múltiplas atualizações consecutivas;
-   consulta após atualização;
-   alteração de disponibilidade;
-   preservação dos preços após indisponibilidade.

------------------------------------------------------------------------

# 11. Resumo dos Cenários Prioritários

  ----------------------------------------------------------------------------------------------------------
  ID           Área         Cenário             Técnica           Nível             Prioridade   Automação
  ------------ ------------ ------------------- ----------------- ----------------- ------------ -----------
  TS-PRD-001   Produto      Cadastro válido     Equivalência      API               P1           Sim

  TS-PRD-002   Produto      Nome inválido       Equivalência      Unit/API          P1           Sim

  TS-AVL-001   Produto      Tornar indisponível Estado            Integration/API   P1           Sim

  TS-PRC-001   Preço        Cadastro válido     Equivalência      Integration/API   P0           Sim

  TS-PRC-002   Preço        Zero                BVA               Unit/API          P0           Sim

  TS-PRC-003   Preço        `0.01`              BVA               Unit/API          P0           Sim

  TS-PRC-004   Preço        Negativo            BVA               Unit/API          P0           Sim

  TS-PRC-009   Preço        Tipo inválido       Equivalência      Unit/API          P0           Sim

  TS-PRC-008   Preço        Atualização         Funcional         Integration/API   P0           Sim

  TS-CMP-001   Comparação   Origem mais barata  Decision Table    Unit/API          P0           Sim

  TS-CMP-002   Comparação   Destino mais barato Decision Table    Unit/API          P0           Sim

  TS-CMP-003   Comparação   Empate              Decision Table    Unit/API          P0           Sim

  TS-CMP-005   Comparação   Produto             Decision          Unit/API          P0           Sim
                            indisponível        Table/Estado                                     

  TS-CMP-006   Comparação   Origem sem preço    Decision Table    API               P0           Sim

  TS-CMP-007   Comparação   Destino sem preço   Decision Table    API               P0           Sim

  TS-E2E-001   Fluxo        Produto → Preço →   Fluxo             E2E               P0           Sim
                            Comparação                                                           

  TS-E2E-002   Fluxo        Produto             Transição/Fluxo   E2E               P0           Sim
                            indisponível antes                                                   
                            da comparação                                                        

  TS-E2E-003   Fluxo        Atualizar preço e   Fluxo funcional   E2E               P0           Sim
                            comparar resultado                                                   

  TS-E2E-004   Fluxo        Um mercado sem      Fluxo funcional   E2E               P0           Sim
                            preço                                                                
  ----------------------------------------------------------------------------------------------------------

------------------------------------------------------------------------

# 12. Observações

Este documento deverá evoluir durante o projeto.

Novos cenários podem ser adicionados quando:

-   novos riscos forem identificados;
-   testes exploratórios revelarem novos comportamentos;
-   defeitos forem encontrados;
-   regras de negócio forem alteradas;
-   novas funcionalidades forem adicionadas.

A existência de um cenário neste documento não significa
obrigatoriamente que ele deverá possuir um teste automatizado.

A decisão de automação deverá considerar risco, repetibilidade, valor do
feedback e custo de manutenção.

------------------------------------------------------------------------

## Fonte

Estes cenários foram definidos com base na análise de riscos e na
estratégia de teste orientada por risco, aplicando técnicas de
particionamento de equivalência, BVA e tabela de decisão amplamente
utilizadas no mercado e referenciadas em
`Lessons Learned in Software Testing`.
