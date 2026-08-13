# EXP-004 — Erros e Contrato API (Test Charter)

Missão
-------
Validar que a API respeita o contrato OpenAPI/Swagger e que erros retornam mensagens e códigos consistentes, incluindo casos de fronteira e headers inesperados.

Foco
-----
- Conformidade com a especificação em `resources/swagger/swagger.yaml`.
- Envelopamento de erros e códigos HTTP (400, 404, 409, 422, 500).
- Comportamento com headers e content-types diferentes.

Preparação
----------
- Utilizar `createApp()` com `DATA_DIR` temporário.
- Preparar casos que forcem 404/409/422 e 500 (via injeção/erro simulado se necessário).

Ações (exemplos)
-----------------
- Validar respostas contra o schema do Swagger para endpoints principais.
- Forçar `405` enviando métodos não permitidos.
- Enviar `Accept: text/plain` e verificar fallback de conteúdo.
- Simular erro interno controlado e verificar envelope de erro sem leak de stack.

Heurísticas
-----------
- CONTRACT TESTING: validar schema e tipos de resposta.
- ERROR GUESSING: verificar mensagens vagas ou ambíguas.

Critério de saída
------------------
- Todas as respostas principais conformes ao contrato definido.
- Mensagens de erro padronizadas e sem dados sensíveis.

Observações
-----------
Automatizar com testes que usem `swagger.yaml` para validação (ex.: `openapi-schema-validator`), migrando para testes de integração.
