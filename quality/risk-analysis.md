# Análise de Riscos --- Discovery Market API

## 1. Objetivo

Este documento apresenta a análise de riscos de qualidade identificados
para a primeira versão da **Discovery Market API**.

O objetivo da análise é identificar comportamentos cuja falha possa
comprometer o funcionamento ou o valor de negócio da aplicação e
utilizar essas informações para orientar:

-   priorização dos testes;
-   profundidade dos testes;
-   seleção das técnicas de teste;
-   definição dos níveis de teste;
-   decisão sobre automação;
-   priorização dos testes de regressão.

A análise é baseada principalmente no **risco do produto**, considerando
a probabilidade de ocorrência de uma falha e seu impacto.

------------------------------------------------------------------------

# 2. Contexto

O principal objetivo da Discovery Market API é permitir a comparação de
preços de um mesmo produto entre diferentes mercados.

O fluxo principal da aplicação é:

``` text
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

Uma falha nas etapas de preço ou comparação pode produzir uma informação
incorreta para o consumidor da API.

Por esse motivo, essas funcionalidades recebem maior prioridade na
estratégia de testes.

------------------------------------------------------------------------

# 3. Abordagem de Análise

Para esta versão do projeto, os riscos serão classificados considerando
dois fatores:

### Probabilidade

Possibilidade de o problema ocorrer.

  --------------------------------------------------------------------------------
  Valor   Classificação   Descrição
  ------- --------------- --------------------------------------------------------
  1       Baixa           Pouco provável dentro do fluxo normal

  2       Média           Pode ocorrer em determinadas condições

  3       Alta            Possui alta possibilidade de ocorrer ou envolve lógica
                          propensa a erro
  --------------------------------------------------------------------------------

### Impacto

Consequência caso o problema ocorra.

  -----------------------------------------------------------------------------------
  Valor   Classificação   Descrição
  ------- --------------- -----------------------------------------------------------
  1       Baixo           Pouco impacto sobre o funcionamento da aplicação

  2       Médio           Compromete parcialmente uma funcionalidade

  3       Alto            Compromete uma funcionalidade crítica ou pode produzir
                          resultado incorreto para o consumidor
  -----------------------------------------------------------------------------------

------------------------------------------------------------------------

# 4. Cálculo do Risco

Para simplificar a análise:

``` text
Risco = Probabilidade × Impacto
```

A pontuação pode variar entre:

``` text
1 → 9
```

Classificação utilizada:

    Pontuação Classificação   Prioridade de Teste
  ----------- --------------- ---------------------
         1--2 Baixo           P2
         3--4 Médio           P1
         6--9 Alto            P0

A pontuação não deve ser utilizada de maneira isolada.

O contexto da regra de negócio também pode influenciar a prioridade
final.

------------------------------------------------------------------------

# 5. Matriz de Risco

``` text
                    IMPACTO
                 1      2      3
              ┌──────┬──────┬──────┐
Prob.      3  │  3   │  6   │  9   │
              ├──────┼──────┼──────┤
           2  │  2   │  4   │  6   │
              ├──────┼──────┼──────┤
           1  │  1   │  2   │  3   │
              └──────┴──────┴──────┘
```

Quanto maior a pontuação, maior deverá ser a atenção durante o
planejamento e execução dos testes.

------------------------------------------------------------------------

# 6. Riscos Identificados

## RSK-001 --- Comparação de preços incorreta

**Área:** Comparação

**Descrição**

A aplicação pode apresentar resultado de comparação incorreto mesmo
quando os preços são válidos. Inclui: \* mercado mais barato
identificado erradamente; \* cálculo de economia incorreto; \* empate
tratado como diferença de preço.

**Exemplo**

``` text
Assaí     R$ 8,90
Extra     R$ 9,50

Resultado incorreto:
Extra é apresentado como mercado mais barato
ou
Economia incorreta = R$ 0,50
```

**Consequência**

O consumidor recebe informação de preço incorreta, o que compromete a
confiança na API.

  Atributo        Avaliação
  --------------- -------------
  Probabilidade   2 --- Média
  Impacto         3 --- Alto
  Risco           6 --- Alto
  Prioridade      P0

**Estratégia de mitigação**

-   testes unitários da regra de comparação;
-   testes de API com preços iguais e diferentes;
-   tabela de decisão;
-   regressão automatizada.

------------------------------------------------------------------------

## RSK-002 --- Comparação realizada sem preço válido

**Área:** Comparação

**Descrição**

A aplicação pode tentar realizar uma comparação mesmo quando um dos
mercados não possui preço cadastrado para o produto.

**Exemplo**

``` text
Assaí     R$ 8,90
Extra     sem preço
```

**Comportamento esperado**

A comparação não deve ser finalizada e a API deve retornar uma resposta
clara sobre dados ausentes.

**Consequência**

A aplicação pode produzir uma comparação incompleta ou apresentar dados
enganadores.

  Atributo        Avaliação
  --------------- ------------
  Probabilidade   3 --- Alta
  Impacto         3 --- Alto
  Risco           9 --- Alto
  Prioridade      P0

**Estratégia de mitigação**

-   tabela de decisão;
-   testes de API;
-   testes de integração;
-   testes exploratórios.

------------------------------------------------------------------------

## RSK-003 --- Preço inválido aceito

**Área:** Preços

**Descrição**

A aplicação pode permitir o cadastro de preços que violam as regras de
negócio.

Exemplos:

``` text
-10.00
0.00
8.999
"8.90"
```

**Consequência**

Dados inválidos podem ser usados na comparação, comprometendo o
resultado final.

  Atributo        Avaliação
  --------------- ------------
  Probabilidade   3 --- Alta
  Impacto         3 --- Alto
  Risco           9 --- Alto
  Prioridade      P0

**Estratégia de mitigação**

-   particionamento de equivalência;
-   análise de valor limite;
-   testes unitários;
-   testes de API;
-   testes exploratórios.

------------------------------------------------------------------------

## RSK-004 --- Atualização de preço gera duplicidade

**Área:** Preços

**Descrição**

Ao cadastrar novamente um preço para a mesma combinação de mercado e
produto, a aplicação pode criar um novo registro em vez de atualizar o
existente.

**Regra esperada**

``` text
marketId + productId
        ↓
apenas um preço
```

Exemplo:

``` text
marketId: 1
productId: 5
price: 8.90

Atualização:

marketId: 1
productId: 5
price: 9.20
```

Resultado esperado:

``` text
1 registro
price = 9.20
```

**Consequência**

A aplicação passa a possuir dados inconsistentes e pode utilizar o preço
incorreto na comparação.

  Atributo        Avaliação
  --------------- -------------
  Probabilidade   2 --- Média
  Impacto         3 --- Alto
  Risco           6 --- Alto
  Prioridade      P0

**Estratégia de mitigação**

-   testes de integração;
-   testes de API;
-   validação da persistência;
-   regressão automatizada.

------------------------------------------------------------------------

## RSK-005 --- Produto indisponível ainda participa da comparação

**Área:** Produto / Comparação

**Descrição**

Um produto marcado como indisponível pode continuar participando de
comparações, ou sua alteração de disponibilidade pode não ser refletida
no momento da comparação.

**Consequência**

A comparação pode incluir produtos que não deveriam estar disponíveis,
comprometendo a consistência do resultado.

  Atributo        Avaliação
  --------------- -------------
  Probabilidade   2 --- Média
  Impacto         3 --- Alto
  Risco           6 --- Alto
  Prioridade      P0

**Estratégia de mitigação**

-   transição de estados;
-   testes unitários;
-   testes de integração;
-   testes de API.

------------------------------------------------------------------------

## RSK-006 --- Entidade inexistente utilizada em operação

**Área:** Preço / Comparação

**Descrição**

A aplicação pode aceitar um `marketId` ou `productId` que não existe no
cadastro.

**Consequência**

Podem ser criados relacionamentos inválidos ou comparações baseadas em
dados inexistentes.

  Atributo        Avaliação
  --------------- -------------
  Probabilidade   2 --- Média
  Impacto         2 --- Médio
  Risco           4 --- Médio
  Prioridade      P1

**Estratégia de mitigação**

-   particionamento de equivalência;
-   testes de integração;
-   testes de API.

------------------------------------------------------------------------

# 7. Resumo dos Riscos

  -------------------------------------------------------------------------------------------
  ID        Risco                                        Prob.   Impacto   Score Prioridade
  --------- ------------------------------------------ ------- --------- ------- ------------
  RSK-001   Comparação de preços incorreta                   2         3       6 P0

  RSK-002   Comparação realizada sem preço válido            3         3       9 P0

  RSK-003   Preço inválido aceito                            3         3       9 P0

  RSK-004   Atualização de preço gera duplicidade            2         3       6 P0

  RSK-005   Produto indisponível ainda participa da          2         3       6 P0
            comparação                                                           

  RSK-006   Entidade inexistente utilizada em operação       2         2       4 P1
  -------------------------------------------------------------------------------------------

------------------------------------------------------------------------

# 8. Distribuição dos Riscos

A análise inicial resultou em:

``` text
Riscos P0: 5
Riscos P1: 1
Riscos P2: 0
```

A concentração de riscos de maior prioridade está principalmente nas
áreas:

``` text
Comparação
    ↑
    │
  Preços
    ↑
    │
 Produtos
```

Isso está alinhado ao fluxo principal de negócio da aplicação.

------------------------------------------------------------------------

# 9. Relação entre Risco e Profundidade de Teste

A prioridade do risco influencia a profundidade da estratégia.

## P0 --- Alto risco

Deve possuir maior profundidade.

Quando aplicável:

-   teste unitário;
-   teste de integração;
-   teste através da API;
-   técnica formal de design de teste;
-   automação para regressão;
-   exploração complementar.

Isso não significa obrigatoriamente testar o mesmo comportamento em
todas as camadas.

Deve-se escolher o nível que produza o feedback mais adequado e
adicionar outras camadas apenas quando houver risco específico que
justifique a redundância.

## P1 --- Médio risco

Deve possuir cobertura adequada, mas pode não exigir múltiplas camadas.

Exemplo:

``` text
API Test
+
cenários negativos relevantes
```

## P2 --- Baixo risco

Pode possuir cobertura mínima ou ser validado como parte de outros
fluxos.

------------------------------------------------------------------------

# 10. Risco × Técnica × Nível

  Risco     Técnica principal          Nível principal      Regressão
  --------- -------------------------- -------------------- -----------
  RSK-001   Tabela de Decisão          Unit / API           Sim
  RSK-002   Tabela de Decisão          API                  Sim
  RSK-003   Equivalência / BVA         Unit / API           Sim
  RSK-004   Inserção / atualização     Integration          Sim
  RSK-005   Transição de Estados       Unit / Integration   Sim
  RSK-006   Equivalência / Validação   API / Integration    Sim

Esta matriz representa o planejamento inicial e poderá ser alterada
conforme o conhecimento sobre o produto evolua.

------------------------------------------------------------------------

# 11. Riscos Residuais

Mesmo após a execução dos testes, alguns riscos permanecerão.

Nesta versão, exemplos incluem:

-   comportamento sob grande volume de dados;
-   concorrência durante atualização de preços;
-   indisponibilidade de infraestrutura;
-   perda de dados em reinicializações;
-   segurança;
-   comportamento em ambiente distribuído.

Esses riscos são aceitos nesta versão por estarem fora do escopo
definido para o projeto.

Eles poderão ser reavaliados conforme a arquitetura evoluir.

------------------------------------------------------------------------

# 12. Revisão dos Riscos

A análise de riscos não é considerada um artefato estático.

Ela deverá ser revisada quando:

-   uma regra de negócio for alterada;
-   uma nova funcionalidade for adicionada;
-   um defeito relevante for encontrado;
-   testes exploratórios revelarem novos riscos;
-   a arquitetura da aplicação for modificada;
-   uma hipótese utilizada nesta análise se mostrar incorreta.

Novos riscos poderão ser adicionados e riscos existentes poderão ter sua
classificação alterada.

------------------------------------------------------------------------

# 13. Conclusão

A análise indica que os maiores riscos da primeira versão da Discovery
Market API estão concentrados nas funcionalidades de **preço e
comparação**.

Essas funcionalidades representam o núcleo do valor de negócio da
aplicação e, por isso, receberão maior profundidade durante os testes.

A análise de riscos será utilizada como entrada para:

``` text
Risk Analysis
      ↓
Test Scenarios
      ↓
Test Techniques
      ↓
Test Automation
      ↓
Execution
      ↓
Evidence
```

O objetivo não é eliminar todos os riscos, mas tornar explícito **quais
riscos existem, quais são prioritários e como os testes serão utilizados
para aumentar a confiança nos comportamentos mais importantes da
aplicação**.

------------------------------------------------------------------------

## Fonte

Esta análise de riscos foi inspirada na abordagem de risco por
probabilidade e impacto utilizada pelo ISTQB e em práticas de
priorização orientadas a risco.

A avaliação utiliza uma escala simplificada de **probabilidade ×
impacto** para apoiar a priorização dos testes. A pontuação é utilizada
como apoio à decisão e não como medida absoluta do risco.

------------------------------------------------------------------------

## Referências

-   ISO 31000 --- Risk management --- princípios e diretrizes para
    gestão de risco.
-   ISO/IEC/IEEE 29119 --- padrões de teste de software, utilizados como
    referência conceitual no projeto.
-   ISTQB --- conceitos e práticas de Risk-Based Testing.
-   Kaner, C.; Bach, J.; Pettichord, B. --- *Lessons Learned in Software
    Testing*.
