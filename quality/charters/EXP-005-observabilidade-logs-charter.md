# EXP-008 — Observabilidade e Logs (Test Charter)

Missão
-------
Verificar se o sistema registra informações suficientes para depuração sem expor dados sensíveis, e se logs facilitam diagnóstico de falhas e correlação com testes Allure.

Foco
-----
- Estrutura e nível de logs (`info`, `warn`, `error`).
- Contexto em logs (request id, timestamps, rota).
- Integração com geração de relatórios (Allure) e rastreabilidade de testes.

Preparação
----------
- Habilitar `morgan` e revisar formato de logs em `src/app.js`.
- Executar cenários que gerem erros e checar logs resultantes.

Ações (exemplos)
-----------------
- Gerar erro 500 e validar que log contém rota, status e timestamp.
- Validar que logs não contêm payloads ou segredos.
- Confirmar correlação entre execução de teste e artefatos Allure.

Heurísticas
-----------
- OBSERVE: adotar IDs de correlação para cada requisição.
- MINIMAL INFO: logs suficientes para triagem sem vazamento.

Critério de saída
------------------
- Logs consistentes e úteis; erros são acompanhados por contexto mínimo adequado.
- Processo de geração de relatórios mapeado para logs quando aplicável.

Observações
-----------
Considerar adição de `request-id` e formatação JSON para logs em ambientes controlados.
