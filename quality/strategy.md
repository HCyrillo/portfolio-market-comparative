# Estratégia de Testes — Discovery Market API

## 1. Objetivo

Este documento define a estratégia de testes para a primeira versão da **Discovery Market API**.

O objetivo é estabelecer como a qualidade do software será avaliada, considerando:

* características do produto;
* regras de negócio;
* riscos;
* técnicas de teste;
* níveis de teste;
* tipos de teste;
* testes manuais e automatizados;
* critérios de entrada e saída;
* evidências e resultados.

A estratégia não tem como objetivo testar todas as possibilidades existentes, mas concentrar esforços nos comportamentos que apresentam maior risco para o produto.

---

## 2. Contexto do Produto

O **Discovery Market** é uma API REST que simula um sistema de comparação de preços entre supermercados.

A aplicação permite:

* consultar mercados;
* cadastrar Produtos Canônicos;
* consultar produtos;
* alterar disponibilidade de produtos;
* cadastrar preços;
* atualizar preços;
* consultar preços;
* comparar o preço de um produto entre dois mercados.

O fluxo principal do sistema é:

```text
Mercado
   ↓
Produto
   ↓
Preço
   ↓
Comparação
```

A primeira versão utiliza armazenamento em memória e não possui:

* autenticação;
* autorização;
* banco de dados;
* cache;
* mensageria;
* infraestrutura distribuída.

---

## 3. Objetivo da Área de Testes

A Área de Testes tem como objetivo fornecer informações sobre a qualidade do produto e reduzir os principais riscos associados ao seu uso.

Os testes devem buscar responder principalmente:

1. O sistema implementa corretamente as regras de negócio?
2. A API responde corretamente para entradas válidas e inválidas?
3. Os dados permanecem consistentes após operações de criação e atualização?
4. A comparação de preços produz resultados corretos?
5. Os contratos HTTP da API são respeitados?
6. Os principais riscos do produto estão cobertos por testes?
7. A suíte automatizada consegue detectar alterações incorretas no comportamento?

---

# 4. Escopo

## 4.1 Dentro do Escopo

Serão avaliados:

* Health Check;
* consulta de mercados;
* cadastro de produtos;
* consulta de produtos;
* alteração de disponibilidade;
* cadastro de preços;
* atualização de preços;
* consulta de preços;
* comparação de preços;
* validações de entrada;
* regras de negócio;
* tratamento de erros;
* estrutura das respostas;
* consistência dos dados;
* contrato da API.

## 4.2 Fora do Escopo

Nesta primeira versão não serão avaliados:

* autenticação;
* autorização;
* banco de dados externo;
* mensageria;
* cache;
* infraestrutura cloud;
* observabilidade distribuída.

Esses aspectos poderão ser avaliados em versões futuras da aplicação.

---

# 5. Abordagem de Testes

A estratégia será baseada em uma abordagem orientada a **risco e comportamento**.

Os testes não serão definidos apenas com base nos endpoints existentes.

A derivação dos testes seguirá o fluxo:

```text
Produto
   ↓
Requisitos
   ↓
Regras de Negócio
   ↓
Riscos
   ↓
Condições de Teste
   ↓
Técnicas de Teste
   ↓
Cenários
   ↓
Nível de Teste
   ↓
Automação
   ↓
Evidências
   ↓
Resultados
```

A automação será utilizada como mecanismo de execução e regressão, mas não será considerada sinônimo de cobertura de testes.

---

# 6. Priorização por Risco

A principal funcionalidade de negócio da aplicação é a comparação de preços.

Por esse motivo, a maior concentração de testes será direcionada para os comportamentos relacionados à comparação.

## Alta Prioridade

* comparação de preços;
* cálculo da economia;
* identificação do menor preço;
* tratamento de empate;
* produto indisponível;
* ausência de preço;
* mercado inexistente;
* produto inexistente;
* atualização de preços.

## Média Prioridade

* cadastro de produtos;
* consulta de produtos;
* consulta de preços;
* alteração de disponibilidade.

## Baixa Prioridade

* Health Check;
* comportamentos puramente estruturais sem regra de negócio relevante.

A priorização poderá ser revisada conforme novos riscos sejam identificados durante os testes.

---

# 7. Técnicas de Teste

As técnicas de teste serão selecionadas de acordo com o comportamento que precisa ser investigado.

## 7.1 Particionamento de Equivalência

Será utilizado quando diferentes entradas puderem ser agrupadas em classes com comportamento semelhante.

### Exemplo: preço

| Classe                      |  Exemplo | Resultado esperado |
| --------------------------- | -------: | ------------------ |
| Preço negativo              |  `-1.00` | Inválido           |
| Preço igual a zero          |   `0.00` | Inválido           |
| Preço válido                |   `8.90` | Válido             |
| Mais de duas casas decimais |  `8.999` | Inválido           |
| Tipo inválido               | `"8.90"` | Inválido           |

O objetivo é reduzir a quantidade de cenários mantendo uma representação adequada das diferentes classes de entrada.

---

## 7.2 Análise de Valor Limite

Será aplicada principalmente às regras que possuem limites explícitos.

Para a regra:

> O preço deve ser maior que zero.

Podem ser avaliados:

```text
0.00
0.01
0.02
```

Os valores próximos ao limite permitem avaliar se a implementação trata corretamente as condições imediatamente antes, no limite e depois dele.

---

## 7.3 Tabela de Decisão

Será utilizada principalmente na funcionalidade de comparação.

Exemplo:

| Produto existe | Disponível | Mercado A possui preço | Mercado B possui preço | Resultado          |
| -------------- | ---------- | ---------------------- | ---------------------- | ------------------ |
| Não            | -          | -                      | -                      | 400                |
| Sim            | Não        | Sim                    | Sim                    | 422                |
| Sim            | Sim        | Não                    | Sim                    | 422                |
| Sim            | Sim        | Sim                    | Não                    | 422                |
| Sim            | Sim        | Sim                    | Sim                    | Comparação         |
| Sim            | Sim        | Sim                    | Sim                    | Empate ou vencedor |

A tabela permite avaliar combinações de condições que influenciam o comportamento da regra de negócio.

---

## 7.4 Teste de Transição de Estados

Será utilizado para avaliar o comportamento relacionado à disponibilidade do produto.

Exemplo:

```text
AVAILABLE
    ↓
UNAVAILABLE
    ↓
AVAILABLE
```

Serão avaliadas as operações permitidas em cada estado.

Exemplo:

```text
Produto disponível
→ pode participar da comparação

Produto indisponível
→ não pode participar da comparação
```

---

# 8. Níveis de Teste

A estratégia utilizará diferentes níveis de teste, considerando o objetivo de cada camada.

## 8.1 Testes Unitários

Objetivo:

Validar regras de negócio de forma isolada.

Principal foco:

* cálculo da comparação;
* identificação do menor preço;
* tratamento de empate;
* cálculo da economia;
* validações de domínio.

Exemplo:

```text
8.90 × 9.50
→ menor preço = 8.90
→ economia = 0.60
```

---

## 8.2 Testes de Integração

Objetivo:

Avaliar a interação entre componentes internos da aplicação.

Exemplo:

```text
Service
   ↓
Repository
   ↓
Armazenamento em memória
```

Serão avaliados:

* criação;
* atualização;
* recuperação;
* consistência dos dados;
* comportamento após alterações.

---

## 8.3 Testes de API

Objetivo:

Avaliar o comportamento da aplicação através da interface HTTP.

Serão avaliados:

* requisições;
* respostas;
* status HTTP;
* payloads;
* validações;
* mensagens de erro;
* estrutura das respostas;
* comportamento dos endpoints.

---

## 8.4 Testes End-to-End

Serão utilizados de maneira seletiva.

O objetivo não é repetir todos os testes unitários e de API, mas validar fluxos relevantes do ponto de vista do usuário/consumidor da API.

Fluxo principal:

```text
Cadastrar Produto
       ↓
Cadastrar Preços
       ↓
Consultar Comparação
       ↓
Validar Resultado
```

---

# 9. Testes Exploratórios

Os testes exploratórios serão utilizados para investigar comportamentos que podem não estar completamente cobertos pelos cenários previamente definidos.

O teste exploratório será realizado de maneira estruturada, utilizando **charters** para definir objetivo e área de investigação.

## Charter 01 — Comparação

### Objetivo

Explorar a comparação de preços buscando inconsistências no resultado ou no tratamento das regras de negócio.

### Investigar

* empate;
* preços próximos;
* preços extremos;
* produto indisponível;
* mercado inexistente;
* produto inexistente;
* ausência de preço;
* mercados iguais;
* entradas inesperadas.

---

## Charter 02 — Cadastro e Atualização de Preços

### Objetivo

Explorar a consistência do cadastro e atualização dos preços.

### Investigar

* preço negativo;
* preço zero;
* quantidade de casas decimais;
* produto inexistente;
* mercado inexistente;
* atualização do preço;
* duplicidade;
* atualização de `updatedAt`.

---

# 10. Testes de Contrato

A especificação OpenAPI será utilizada como referência para validar o contrato da API.

Serão avaliados:

* estrutura das requisições;
* campos obrigatórios;
* tipos de dados;
* estrutura das respostas;
* status HTTP;
* mensagens;
* schemas;
* exemplos documentados.

Objetivo:

> Identificar divergências entre o contrato publicado e o comportamento real da API.

---

# 11. Testes Não Funcionais

Nesta primeira versão, os testes não funcionais terão escopo reduzido.

## 11.1 Performance

Será realizado inicialmente um teste de baseline sobre o endpoint de comparação.

Objetivos:

* estabelecer o comportamento inicial da aplicação;
* observar latência;
* observar throughput;
* identificar degradação sob uma carga básica.

Endpoint prioritário:

```text
GET /api/v1/comparison
```

Testes mais aprofundados de:

* stress;
* spike;
* endurance;
* concorrência;

poderão fazer parte de uma evolução posterior do projeto.

---

# 12. Automação

A automação será distribuída de acordo com o nível de teste.

```text
                 E2E
                  ▲
                  │
              API Tests
                  ▲
                  │
          Integration Tests
                  ▲
                  │
             Unit Tests
```

A maior quantidade de testes deverá estar nos níveis inferiores, buscando:

* execução rápida;
* feedback rápido;
* menor custo de manutenção;
* isolamento das regras de negócio.

Os testes de API serão utilizados para validar o comportamento externo da aplicação.

A decisão de automatizar um cenário deverá considerar:

* frequência de execução;
* criticidade;
* repetibilidade;
* estabilidade;
* custo de manutenção;
* valor do feedback.

Nem todo teste precisa ser automatizado.

---

# 13. Estratégia de Regressão

A suíte automatizada deverá funcionar como mecanismo de regressão.

Alterações realizadas em:

* produtos;
* preços;
* disponibilidade;
* comparação;
* validações;

devem executar os testes relacionados antes da conclusão da alteração.

O objetivo é reduzir o risco de uma alteração em uma regra existente introduzir uma regressão.

---

# 14. Rastreabilidade

Os testes serão relacionados às regras de negócio e aos riscos identificados.

Exemplo:

```text
RN-CMP-001
Menor preço deve ser identificado
        ↓
Risco: comparação incorreta
        ↓
Técnica: Tabela de Decisão
        ↓
Cenário: preço A < preço B
        ↓
Teste Unitário
        ↓
Teste de API
```

A rastreabilidade será mantida em uma matriz específica.

---

# 15. Artefatos de Teste

Os principais artefatos serão:

```text
quality/
├── strategy/
│   └── test-strategy.md
│
├── planning/
│   └── test-scenarios.md
│
├── risk/
│   └── risk-analysis.md
│
├── techniques/
│   ├── equivalence-partitioning.md
│   ├── boundary-value-analysis.md
│   ├── decision-table.md
│   └── state-transition.md
│
├── exploratory/
│   ├── charters.md
│   └── session-reports/
│
├── traceability/
│   └── requirements-test-matrix.md
│
└── reports/
    └── test-summary.md
```

Os artefatos deverão evoluir conforme o projeto avance.

Não é necessário criar todos os documentos antecipadamente.

---

# 16. Critérios de Entrada

Antes da execução dos testes principais:

* aplicação deve estar executável;
* endpoints definidos devem estar disponíveis;
* Swagger deve estar publicado;
* dados iniciais devem estar disponíveis;
* ambiente de teste deve estar configurado;
* cenários prioritários devem estar definidos.

---

# 17. Critérios de Saída

A execução da estratégia será considerada concluída quando:

* cenários de alta prioridade forem executados;
* defeitos críticos conhecidos forem tratados ou formalmente aceitos;
* suíte automatizada estiver executando;
* testes de regressão estiverem passando;
* principais riscos tiverem evidência de cobertura;
* resultados forem registrados.

O critério de saída não será baseado exclusivamente em percentual de cobertura de código.

---

# 18. Evidências

As evidências poderão incluir:

* resultados dos testes automatizados;
* relatórios de execução;
* cobertura de código;
* resultados exploratórios;
* evidências de defeitos;
* resultados de performance;
* resultados de contrato;
* resultados de CI/CD.

O objetivo das evidências é permitir avaliar o comportamento observado e apoiar decisões de qualidade.

---

# 19. Indicadores

Os indicadores serão utilizados como apoio à análise da qualidade, não como objetivo isolado.

Exemplos:

* quantidade de testes executados;
* taxa de aprovação;
* cobertura de código;
* cobertura de regras de negócio;
* quantidade de defeitos encontrados;
* defeitos por severidade;
* tempo de execução da suíte;
* resultado dos testes de performance.

A cobertura de código não será utilizada isoladamente como indicador de qualidade.

Uma cobertura elevada não garante que os principais riscos estejam adequadamente testados.

---

# 20. Critérios de Priorização

A prioridade dos testes será determinada principalmente pela combinação entre:

```text
Impacto do problema
        ×
Probabilidade de ocorrência
        ×
Importância da funcionalidade
```

Funcionalidades críticas para o objetivo principal do produto terão maior profundidade de testes.

A comparação de preços, por representar o principal valor de negócio da aplicação, receberá a maior prioridade.

---

# 21. Resultado Esperado

Ao final do projeto, espera-se demonstrar que a qualidade da Discovery Market API foi avaliada utilizando diferentes perspectivas:

```text
              QUALIDADE
                  │
       ┌──────────┼──────────┐
       ↓          ↓          ↓
     Risco      Regra      Comportamento
       │          │          │
       └──────────┼──────────┘
                  ↓
          Técnicas de Teste
                  ↓
           Níveis de Teste
                  ↓
             Automação
                  ↓
              Exploração
                  ↓
              Evidências
                  ↓
               Decisão
```

A estratégia busca demonstrar que **testar não significa apenas automatizar casos de teste**, mas investigar o produto de diferentes formas para produzir informações relevantes sobre seus riscos e qualidade.

---

# 22. Evolução da Estratégia

A estratégia poderá evoluir conforme novas funcionalidades e riscos forem introduzidos.

Possíveis evoluções:

* autenticação e autorização;
* persistência em banco de dados;
* testes de segurança;
* testes de contrato automatizados;
* testes de performance mais aprofundados;
* testes de concorrência;
* observabilidade;
* testes de resiliência;
* execução em pipeline CI/CD.

Cada nova evolução deverá ser precedida por uma nova análise de riscos e revisão da estratégia de testes.
