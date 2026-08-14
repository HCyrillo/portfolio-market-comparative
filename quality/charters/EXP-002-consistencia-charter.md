# EXP-003 — Consistência (Test Charter)

Missão
-------
Verificar a consistência dos dados após operações concorrentes ou sequenciais de atualização (preço e disponibilidade) e garantir que a persistência mantém integridade.

Foco
-----
- Efeitos de múltiplas atualizações consecutivas em `prices`.
- Relação entre `available` do produto e preços existentes.
- Rollforward/rollback observável em caso de falha parcial.

Preparação
----------
- Usar diretório de dados temporário e reproduzir sequências de gravação.
- Simular atualizações rápidas (em loop) e leituras imediatas.

Ações (exemplos)
-----------------
- Fazer N atualizações de preço em sequência e validar histórico final.
- Tornar produto indisponível após cadastrar preços e verificar se preços são preservados.
- Simular escrita falha (por exemplo forçando permissão) e observar comportamento.

Heurísticas
-----------
- RACE CONDITION: tentar atualizações concorrentes e observar perda de dados.
- STRESS: repetir atualizações por volume.

Critério de saída
------------------
- Dados finais são consistentes e válidos segundo regras de negócio.
- Não há corrupção de arquivos JSON nem perda silenciosa de atualizações.

Observações
-----------
Se problemas forem detectados, priorizar refatoração de `JsonDataStore` e inclusão de mocks em testes unitários para isolar falhas.
