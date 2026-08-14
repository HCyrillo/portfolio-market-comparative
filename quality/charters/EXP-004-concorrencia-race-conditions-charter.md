# EXP-005 — Concorrência e Race Conditions (Test Charter)

Missão
-------
Investigar condições de corrida e perda de dados ao executar operações concorrentes de escrita e leitura na camada de persistência JSON.

Foco
-----
- `JsonDataStore` e sequenciamento de writes.
- Atualizações simultâneas a um mesmo recurso (prices, products).
- Resiliência a falhas de I/O durante writes.

Preparação
----------
- Utilizar diretório temporário para dados.
- Criar scripts de carga que disparem múltiplas requisições paralelas (Promise.all) ou forks leves.

Ações (exemplos)
-----------------
- Executar N requisições de update para o mesmo preço quase simultâneas.
- Interromper processo no meio da escrita para verificar corrupção.
- Medir perda/overwrites e validar `id` sequencialidade.

Heurísticas
-----------
- RACE: repetir testes com timings variados.
- OBSERVE: logs e timestamps para identificar ordem de execução.

Critério de saída
------------------
- Sem perda silenciosa de updates; arquivo final consistente.
- Identificação clara de qualquer comportamento não determinístico.

Observações
-----------
Se problemas forem encontrados, priorizar travas simples, filas ou usar DB real para casos de alta concorrência.
