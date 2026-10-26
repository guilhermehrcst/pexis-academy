# L003: pré-validação das páginas de destino, sem publicação

**Status:** arquitetura preparada, sem autorização editorial. A produção permanece com 44 recursos.

A checagem de `placementOf` exige que cada recurso novo tenha uma **página real** que o liste antes da publicação. Os nove recursos revalidados no pacote de aprovação tinham lacunas na navegação antiga:

- Um curso interdisciplinar de Educação Financeira (`research-br1-014`) serve Ensino Médio, mas não corresponde a uma disciplina existente. A página ganhou uma seção condicional “Cursos complementares”, só exibida quando houver recurso publicado nela.
- O arquivo Comvest/Unicamp (`research-br1-016`) já tem destino natural em `/vestibulares/`.
- Química universitária do MIT (`research-int-002`) ganhou um **grupo futuro Química** em Ensino Superior, sem bloco vazio no site atual.
- Os seis candidatos de Tecnologia foram atribuídos a trilhas preexistentes (Python, desenvolvimento web, IA e primeiros passos), mas só entram nessas trilhas após aprovação e publicação.

Os testes em `tests/l003-placement-preflight.test.ts` simulam um contexto com os nove para verificar que **todos têm destinos e âncoras válidas**; a projeção de produção continua intocada. O pacote exato de digests fica em `docs/academy/research/2026-10-26-l003-exact-nine-review.json`.

**Não** alterar `release.json`, registros revalidados, aprovação, autorização, thumbnails, imagens ou CSS visual nesta etapa. Após aprovação, executar simulação de lote e validação pós-build completa, incluindo lista de hosts externos.
