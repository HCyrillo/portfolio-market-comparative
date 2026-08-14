# EXP-001 — Entradas inesperadas (Test Charter)

Missão
-------
Investigar como a API reage a entradas inesperadas, malformadas ou fora do contrato, procurando falhas de validação, mensagens de erro claras e quaisquer efeitos indesejados na persistência.

Foco
-----
- Validações de payload (`products`, `prices`, `comparison`).
- Robustez contra JSON malformado e campos extras.
- Mensagens de erro e códigos HTTP consistentes.

Preparação
----------
- Usar ambiente de integração com `DATA_DIR` temporário (ver `test/helpers/fixtures.js`).
- Iniciar a aplicação via `createApp()` em modo de teste.

Ações (exemplos)
-----------------
- Enviar `null` e payloads com campos vazios.
- Enviar strings vazias e campos com apenas espaços.
- Campos numéricos enviados como strings (`"price": "8.90"`).
- Campos extras não permitidos no `POST /api/v1/products`.
- JSON malformado (partial body) e verificar código 400.
- Campos duplicados e mistura de tipos (array vs objeto).

Heurísticas
-----------
- VARY: variar tipo/ordem dos campos e limites.
- ERROR GUESSING: tentar entradas que tipicamente quebram parsers.

Critério de saída
------------------
- Erros retornam o envelope de erro padronizado.
- Nenhuma exceção não capturada ou crash do servidor.
- Persistência não corrompida após entradas inválidas.

Observações
-----------
Produtos
 - Não há validação e minimo de caracteres para o produto, possibilitando salvar produtos com apenas uma letra, e sem DELETE deixa não usual a aplicação
 -é possivel cadastrar produtos repetidos com os mesmos dados, isso é um bug
Consulta produto deveria ser paginado para melhor performance
Preço
- a consulta deveria ser paginada também
- consulta de preço deveria retornar um id unico para ter um registro mapeado de preço para cada mercado-produto, fica confuso a atualização de preço sem o id retornado dessa relação
- produto deveria vir acompanhado da moeda (Reais)
Comparação
- formatar valores para vir formatado em reais 
