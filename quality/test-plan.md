# Plano e Estratégia de Testes — Discovery Market API

## 1. Objetivo

Este documento define o planejamento e a estratégia de testes da primeira versão da **Discovery Market API**.

O objetivo é estabelecer:

- o que será testado;
- como os testes serão conduzidos;
- quais riscos terão maior prioridade;
- quais técnicas serão aplicadas;
- em quais níveis os comportamentos serão avaliados;
- quais critérios orientarão a automação;
- como a execução será priorizada;
- quais critérios serão utilizados para conclusão do ciclo.

Este documento utiliza como referência conceitual a série **ISO/IEC/IEEE 29119**, adaptando os conceitos ao contexto, tamanho e duração do projeto.

A intenção não é buscar conformidade formal com a norma, mas utilizar seus conceitos como apoio à organização das atividades de teste.

---

# 2. Contexto do Produto

O **Discovery Market** é uma API REST desenvolvida em Node.js + Express que simula um sistema de comparação de preços entre supermercados.

A aplicação permite:

- consultar mercados;
- cadastrar produtos;
- consultar produtos;
- alterar a disponibilidade de produtos;
- cadastrar preços;
- atualizar preços;
- consultar preços;
- comparar o preço de um produto entre dois mercados.

O fluxo principal de negócio é:

```text
Produto
   ↓
Preço por mercado
   ↓
Comparação
   ↓
Menor preço
   ↓
Economia
```

A funcionalidade de **comparação de preços** representa o principal valor de negócio da aplicação.

Por esse motivo, comportamentos relacionados a preços e comparação receberão maior prioridade e profundidade durante os testes.

---

# 3. Base de Teste

Os testes serão derivados principalmente das seguintes fontes:

- regras de negócio da aplicação;
- requisitos descritos no projeto;
- README;
- contrato OpenAPI/Swagger;
- comportamento esperado dos endpoints;
- análise de riscos do produto.

Documentos de referência:

```text
README.md

resources/swagger/swagger.yaml

quality/risk-analysis.md

quality/test-scenarios.md
```

Caso sejam encontradas divergências entre implementação, regra de negócio e Swagger, elas deverão ser analisadas e registradas antes de utilizar o comportamento como referência para novos testes.

---

# 4. Escopo

## 4.1 Em escopo

Serão avaliados:

### Health

- disponibilidade da API.

### Markets

- consulta dos mercados cadastrados.

### Products

- cadastro;
- consulta;
- validações;
- disponibilidade.

### Prices

- cadastro;
- atualização;
- consulta;
- validações;
- consistência entre produto e mercado.

### Comparison

- identificação do menor preço;
- cálculo da economia;
- empate;
- produto indisponível;
- ausência de preço;
- produto inexistente;
- mercado inexistente.

### Comportamentos transversais

- contratos HTTP;
- status codes;
- estrutura das respostas;
- tratamento de erros;
- consistência dos dados.

---

## 4.2 Fora do escopo

Nesta versão não serão avaliados profundamente:

- autenticação;
- autorização;
- banco de dados externo;
- mensageria;
- cache;
- infraestrutura cloud;
- arquitetura distribuída;
- segurança aprofundada;
- stress;
- spike;
- endurance.

Esses aspectos poderão ser incluídos em versões futuras caso novas características arquiteturais ou riscos justifiquem sua inclusão.

---

# 5. Abordagem de Testes

A estratégia será orientada principalmente por:

- risco;
- comportamento;
- regras de negócio;
- criticidade;
- custo de execução;
- velocidade de feedback.

Os testes não serão derivados simplesmente da quantidade de endpoints existentes.

O processo utilizado será:

```text
Entendimento do Produto
        ↓
Regras de Negócio
        ↓
Análise de Riscos
        ↓
Condições de Teste
        ↓
Técnicas de Teste
        ↓
Cenários
        ↓
Nível adequado
        ↓
Automação / Exploração
        ↓
Execução
        ↓
Evidências
        ↓
Resultados
```

A automação será considerada uma forma de execução e regressão dos testes, e não o ponto inicial da estratégia.

---

# 6. Priorização Baseada em Risco

Os testes serão priorizados utilizando três classificações:

| Prioridade | Significado |
|---|---|
| P0 | Alto risco |
| P1 | Médio risco |
| P2 | Baixo risco |

A classificação detalhada encontra-se em:

```text
quality/risk-analysis.md
```

As principais áreas de risco identificadas inicialmente são:

- comparação incorreta;
- cálculo incorreto da economia;
- aceitação de preços inválidos;
- comparação de produto indisponível;
- comparação sem preço nos mercados;
- inconsistência durante atualização de preço.

A ordem preferencial de execução será:

```text
P0
 ↓
P1
 ↓
P2
```

Caso exista limitação de tempo, cenários P0 terão prioridade sobre cenários de menor risco.

---

# 7. Decisões da Estratégia

Esta seção registra as principais decisões tomadas especificamente para o contexto do Discovery Market.

## DEC-001 — Comparação como principal área de risco

A comparação representa o principal valor de negócio da aplicação.

Falhas nessa funcionalidade podem apresentar ao consumidor informações incorretas sobre:

- menor preço;
- mercado mais barato;
- economia;
- empate.

Por esse motivo, os comportamentos relacionados à comparação terão maior profundidade de testes.

---

## DEC-002 — Preços como dado crítico para comparação

O resultado da comparação depende diretamente da qualidade dos preços cadastrados.

Dados inválidos podem contaminar posteriormente o resultado da comparação.

Por esse motivo, validações relacionadas a:

```text
price > 0
```

formato, atualização e relacionamento entre produto e mercado receberão prioridade elevada.

---

## DEC-003 — Não duplicar todos os cenários entre camadas

Não será objetivo executar todos os cenários em todos os níveis de teste.

Regras de negócio determinísticas serão preferencialmente validadas em testes unitários.

Testes através da API serão utilizados principalmente para validar:

- contrato HTTP;
- validações de entrada;
- integração das camadas;
- tratamento de erros;
- comportamentos observáveis pelo consumidor.

O mesmo comportamento somente será testado em múltiplas camadas quando existir um risco que justifique a redundância.

---

## DEC-004 — E2E limitado ao fluxo crítico

Não será criada uma suíte extensa de testes E2E.

O principal fluxo candidato será:

```text
Cadastrar Produto
        ↓
Cadastrar preço no Mercado A
        ↓
Cadastrar preço no Mercado B
        ↓
Comparar
        ↓
Validar resultado
```

O objetivo é validar a integração do principal fluxo de negócio sem aumentar desnecessariamente o custo, fragilidade e tempo de execução da suíte.

---

## DEC-005 — Automação orientada a risco

Os cenários relacionados aos riscos P0 terão prioridade para regressão automatizada.

Principalmente:

- comparação;
- cálculo da economia;
- validação de preço;
- ausência de preço;
- disponibilidade;
- atualização de preço.

Nem todo cenário identificado precisa ser automatizado.

A decisão deverá considerar:

- risco;
- repetibilidade;
- determinismo;
- frequência de execução;
- valor do feedback;
- custo de manutenção.

---

## DEC-006 — Performance limitada a baseline

Nesta versão será realizado apenas um baseline básico de performance sobre o fluxo de comparação.

Testes aprofundados de:

- stress;
- spike;
- endurance;
- escalabilidade;

não fazem parte do ciclo atual.

A aplicação utiliza armazenamento local e não representa uma arquitetura de produção distribuída.

Executar testes avançados nesse contexto poderia gerar resultados com pouco valor para decisões reais de capacidade.

---

## DEC-007 — Exploração complementar à automação

A automação não será utilizada como única fonte de informação sobre qualidade.

Testes exploratórios serão utilizados principalmente em:

- comparação;
- atualização de preços;
- disponibilidade;
- consistência de dados;
- entradas inesperadas.

O objetivo será investigar comportamentos que não tenham sido antecipados durante o design inicial dos testes.

---

# 8. Técnicas de Teste

As técnicas serão escolhidas de acordo com o comportamento que precisa ser investigado.

Não é objetivo utilizar todas as técnicas em todas as funcionalidades.

---

## 8.1 Particionamento de Equivalência

Será utilizado quando diferentes entradas puderem ser agrupadas em classes de comportamento equivalente.

Exemplo para preço:

| Classe | Exemplo | Resultado |
|---|---:|---|
| Negativo | `-1.00` | Inválido |
| Zero | `0.00` | Inválido |
| Positivo | `8.90` | Válido |
| Mais de duas casas | `8.999` | Inválido |
| Tipo incorreto | `"8.90"` | Inválido |

---

## 8.2 Análise de Valor Limite

Aplicada principalmente às regras que possuem limites explícitos.

Para:

```text
Preço > 0
```

serão considerados valores próximos ao limite:

```text
-0.01 → inválido
 0.00 → inválido
 0.01 → válido
```

---

## 8.3 Tabela de Decisão

Será utilizada principalmente na comparação, onde diferentes combinações de condições determinam o resultado.

Exemplos de condições:

- produto existe?
- produto está disponível?
- mercado A existe?
- mercado B existe?
- mercado A possui preço?
- mercado B possui preço?
- os preços são iguais?

---

## 8.4 Transição de Estados

Será aplicada principalmente à disponibilidade do produto.

```text
AVAILABLE
    │
    │ available=false
    ↓
UNAVAILABLE
    │
    │ available=true
    ↓
AVAILABLE
```

Será avaliado se o comportamento da comparação respeita o estado atual do produto.

---

## 8.5 Error Guessing

Será utilizado como técnica complementar para investigar situações como:

- valores `null`;
- strings vazias;
- IDs inválidos;
- tipos inesperados;
- propriedades adicionais;
- combinações não previstas;
- operações repetidas.

---

# 9. Níveis e Abordagens de Teste

## 9.1 Testes Unitários

Objetivo:

Validar regras de negócio de maneira rápida e isolada.

Foco:

- comparação;
- menor preço;
- economia;
- empate;
- validações de domínio.

Exemplo:

```text
8.90 × 9.50

Menor preço = 8.90
Economia = 0.60
```

---

## 9.2 Testes de Integração

Objetivo:

Avaliar a interação entre componentes internos.

Principal fluxo:

```text
Service
   ↓
Repository
   ↓
Persistência utilizada no teste
```

Foco:

- criação;
- atualização;
- recuperação;
- consistência dos dados;
- ausência de duplicidade.

---

## 9.3 Testes através da API

Objetivo:

Avaliar os comportamentos observáveis pelo consumidor da API.

Foco:

- request;
- response;
- status HTTP;
- schemas;
- validações;
- erros;
- principais regras de negócio;
- contrato.

---

## 9.4 Teste E2E

Será utilizado seletivamente para o principal fluxo da aplicação.

```text
Produto
   ↓
Preço Mercado A
   ↓
Preço Mercado B
   ↓
Comparação
   ↓
Resultado
```

A quantidade de testes E2E será intencionalmente reduzida.

---

# 10. Testes de Contrato

A especificação OpenAPI será utilizada como uma das bases para validar o contrato público da API.

Serão avaliados:

- campos obrigatórios;
- tipos;
- request bodies;
- estrutura das respostas;
- status codes;
- schemas;
- erros documentados.

O objetivo é identificar divergências entre:

```text
Swagger
   ↕
Implementação
```

---

# 11. Testes Exploratórios

Os testes exploratórios serão utilizados para complementar os cenários previamente definidos.

As sessões serão orientadas por **charters**.

Exemplo:

### Charter — Comparação

**Missão**

Explorar a comparação buscando comportamentos inconsistentes ou situações não previstas inicialmente.

**Áreas de investigação**

- empate;
- mercados iguais;
- ausência de preço;
- preços extremos;
- produto indisponível;
- múltiplas atualizações;
- entradas inesperadas.

Os resultados relevantes serão registrados para posterior análise.

---

# 12. Estratégia de Automação

A automação será distribuída de acordo com o tipo de feedback necessário.

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

A maior quantidade de verificações deverá permanecer nos níveis inferiores quando isso produzir feedback adequado.

Estrutura prevista:

```text
tests/

├── unit/
├── integration/
├── api/
└── e2e/
```

A automação deverá ser:

- determinística;
- independente;
- repetível;
- legível;
- adequada para regressão.

---

# 13. Estratégia de Regressão

A regressão automatizada deverá proteger principalmente os comportamentos associados aos riscos P0.

Alterações realizadas em:

- comparação;
- preços;
- disponibilidade;
- validações;

deverão executar os testes relacionados.

A regressão completa deverá ser executada antes da conclusão do ciclo.

---

# 14. Ambiente e Dados de Teste

## 14.1 Ambiente

Os testes serão executados inicialmente em ambiente local.

Configuração prevista:

- Node.js;
- aplicação executada localmente;
- ambiente de teste isolado;
- `NODE_ENV=test`.

Os testes automatizados não devem modificar os dados utilizados no ambiente de desenvolvimento.

---

## 14.2 Dados de Teste

Os dados deverão ser controlados e determinísticos.

Principais condições:

### Produto

- existente;
- inexistente;
- disponível;
- indisponível.

### Mercado

- existente;
- inexistente.

### Preço

- válido;
- negativo;
- zero;
- mais de duas casas;
- preços diferentes;
- preços iguais;
- ausência de preço.

Os testes não deverão depender da ordem de execução de outros testes.

---

# 15. Plano de Execução

O ciclo inicial terá duração curta e será orientado pelas prioridades definidas na análise de riscos.

## Etapa 1 — Análise e Design

- revisar regras de negócio;
- revisar contrato;
- concluir análise de riscos;
- derivar condições de teste;
- aplicar técnicas;
- definir cenários prioritários.

## Etapa 2 — Implementação

- implementar testes unitários prioritários;
- implementar testes de integração;
- implementar testes através da API;
- implementar fluxo E2E crítico.

## Etapa 3 — Exploração

- executar charters prioritários;
- investigar comportamentos inesperados;
- registrar descobertas;
- criar novos cenários quando necessário.

## Etapa 4 — Regressão e Encerramento

- executar regressão;
- revisar cobertura dos riscos P0;
- analisar defeitos;
- registrar riscos residuais;
- consolidar evidências;
- produzir relatório final.

Caso exista limitação de tempo:

```text
P0 → executar

P1 → executar conforme capacidade

P2 → poderá ser postergado
```

---

# 16. Critérios de Entrada

A execução principal poderá iniciar quando:

- aplicação estiver executável;
- endpoints necessários estiverem disponíveis;
- Swagger estiver acessível;
- ambiente de teste estiver configurado;
- regras de negócio estiverem identificadas;
- riscos P0 estiverem identificados;
- cenários prioritários estiverem definidos.

---

# 17. Critérios de Suspensão e Retomada

A execução poderá ser suspensa quando:

- aplicação não inicializar;
- endpoint crítico estiver indisponível;
- defeito bloqueante impedir múltiplos cenários;
- ambiente não permitir execução confiável;
- dados necessários estiverem inconsistentes.

A execução será retomada quando a condição bloqueante tiver sido corrigida ou exista uma mitigação adequada.

---

# 18. Critérios de Saída

O ciclo poderá ser considerado concluído quando:

- cenários P0 planejados tiverem sido executados;
- principais riscos P0 possuírem evidências de cobertura;
- regressão automatizada estiver passando;
- não existirem defeitos críticos conhecidos sem decisão registrada;
- exploração prioritária tiver sido realizada;
- riscos residuais estiverem registrados;
- resultados estiverem consolidados.

A cobertura de código poderá ser utilizada como informação complementar, mas **não será utilizada isoladamente como critério de qualidade ou conclusão**.

---

# 19. Riscos da Atividade de Teste

Os riscos abaixo são relacionados à execução das atividades de teste e são diferentes dos riscos do produto documentados em `risk-analysis.md`.

| Risco | Possível impacto | Mitigação |
|---|---|---|
| Tempo limitado | P1/P2 podem não ser executados | Priorizar P0 |
| Projeto individual | Capacidade limitada | Manter escopo reduzido |
| Alteração de requisitos | Retrabalho | Revisar riscos e cenários |
| Alteração do contrato | Automação desatualizada | Manter Swagger e testes sincronizados |
| Dados não isolados | Testes instáveis | Utilizar dados controlados |
| Tempo limitado para performance | Cobertura superficial | Executar apenas baseline |

---

# 20. Monitoramento

Durante a execução serão acompanhados:

- cenários planejados;
- cenários executados;
- aprovados;
- reprovados;
- bloqueados;
- defeitos encontrados;
- severidade dos defeitos;
- cobertura dos riscos P0;
- resultado da regressão;
- tempo de execução da suíte.

As métricas serão utilizadas como apoio à tomada de decisão e não como objetivo isolado.

---

# 21. Rastreabilidade

Os testes deverão permitir identificar a relação entre:

```text
Regra de Negócio
       ↓
Risco
       ↓
Técnica
       ↓
Cenário
       ↓
Teste
       ↓
Resultado
```

Exemplo:

```text
Preço deve ser > 0
        ↓
RSK-003
Preço inválido aceito
        ↓
Boundary Value Analysis
        ↓
TS-PRC-002
price = 0
        ↓
Teste Unitário / API
```

A rastreabilidade não precisa necessariamente ser mantida em uma ferramenta específica nesta versão.

IDs de risco e cenário poderão ser utilizados para estabelecer essa relação.

---

# 22. Evidências

As evidências poderão incluir:

- resultado da suíte automatizada;
- relatórios de execução;
- defeitos registrados;
- resultados exploratórios;
- cobertura de código;
- resultado do baseline de performance;
- divergências de contrato;
- execução da regressão.

As evidências deverão apoiar a análise da qualidade do produto e dos riscos residuais.

---

# 23. Entregáveis

Os principais artefatos serão:

```text
quality/

├── test-plan.md
├── risk-analysis.md
├── test-scenarios.md
├── exploratory-testing.md
└── test-summary.md
```

Além de:

```text
tests/

├── unit/
├── integration/
├── api/
└── e2e/
```

Não serão criados documentos adicionais apenas para reproduzir informações já presentes nesses artefatos.

---

# 24. Responsabilidades

O projeto é individual.

As seguintes atividades serão executadas pelo responsável pelo projeto:

- planejamento;
- análise de riscos;
- design dos testes;
- automação;
- execução;
- exploração;
- análise dos resultados;
- registro das evidências;
- elaboração do relatório final.

A concentração das responsabilidades em uma única pessoa é uma característica do contexto deste projeto e não representa necessariamente a organização recomendada para projetos com equipes maiores.

---

# 25. Resultado Esperado

Ao final do ciclo, espera-se conseguir responder:

1. Os principais comportamentos da aplicação funcionam corretamente?
2. Os riscos P0 foram adequadamente avaliados?
3. A comparação apresenta resultados confiáveis?
4. As validações impedem dados inválidos?
5. A regressão protege os principais comportamentos?
6. Os testes exploratórios identificaram riscos não previstos?
7. Quais riscos permanecem após os testes?
8. Existe confiança suficiente para considerar a V1 testada dentro do escopo definido?

O objetivo não é demonstrar ausência de defeitos, mas produzir informações suficientes para avaliar o nível de confiança sobre os principais comportamentos da aplicação.

---

# 26. Referências

Este documento utiliza como referência conceitual:

- ISO/IEC/IEEE 29119-2 — Test Processes;
- ISO/IEC/IEEE 29119-3 — Test Documentation.

Os conceitos foram adaptados ao contexto de uma API pequena, projeto individual e ciclo de curta duração.