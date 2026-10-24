# Paulex Edu — Seleção inicial de cursos das big techs (24/10/2026)

**Estado:** candidatos de curadoria, sem autorização de publicação. Esta proposta não altera o acervo público nem a faixa institucional.

Objetivo: incorporar conteúdo gratuito produzido pelas próprias Anthropic (Claude), Google, OpenAI, NVIDIA, Apple e Meta, sem induzir vínculo institucional com a Paulex Edu. Conteúdo da empresa não é parceria. A fonte final deve ser sempre o recurso original.

## Inventário inicial

| Empresa | ID | Fonte oficial | Situação |
|---|---|---|---|
| Anthropic | anthropic-claude-101 | https://anthropic.skilljar.com/claude-101 | Revisão: matrícula e aulas em Skilljar não acessíveis diretamente na checagem |
| Anthropic | anthropic-claude-code-101 | https://anthropic.skilljar.com/claude-code-101 | Revisão: matrícula e curso completos não acessíveis diretamente |
| Google | google-intro-ml | https://developers.google.com/machine-learning/intro-to-ml?hl=pt-BR | Fonte e conteúdo público verificados |
| Google | google-mlcc | https://developers.google.com/machine-learning/crash-course/ | **Já está em src/lib/staging.ts**, não duplicar |
| OpenAI | openai-ai-for-college-students | https://academy.openai.com/public/courses/ai-for-college-students-fv95a | Revisão: gratuito pela política oficial, curso requer login e página dinâmica |
| OpenAI | openai-ai-for-educators | https://academy.openai.com/public/courses/ai-for-educators-63qvo | Revisão: gratuito pela política oficial, curso requer login; conteúdos em PT e EN |
| NVIDIA | nvidia-generative-ai-explained | https://learn.nvidia.com/courses/course-detail?course_id=course-v1%3ADLI%2BS-FX-15%2BV1 | Revisão: PDF oficial do catálogo confirma Free; confirmar página e matrícula atuais |
| Apple | apple-develop-in-swift | https://developer.apple.com/tutorials/develop-in-swift | Tutoriais públicos verificados, **não curso**; Mac/Xcode para prática |
| Meta | meta-blueprint-intro-ads | https://www.facebookblueprint.com/student/path/211839-meta-advertising-course | Revisão: 3 aulas/15 min, verificar acesso gratuito integral após começar |

Fontes complementares:
- OpenAI (regras oficiais da Academy): https://help.openai.com/en/articles/20001270-openai-academy-courses
- NVIDIA (catálogo de preços e durações): https://cdn.dli.learn.nvidia.com/web-asset/nvidia-learning-training%20course-catalog.pdf
- Meta Blueprint (catálogo): https://www.facebookblueprint.com/student/catalog/list?course_type=all&locale=pt-BR

## Gatilhos para publicação

1. Abrir cada curso diretamente no provedor e verificar **todo o conteúdo de estudo gratuito**. Registrar método, data, URL e evidências reais. Registros que dependem apenas de trechos de busca ficam em revisão.
2. Confirmar idioma, cadastro, certificado/credencial e requisitos especiais. Não confundir badge com certificação; não confundir série de tutoriais da Apple com curso.
3. Decidir enquadramento do Meta Blueprint: marketing digital pode demandar categoria/trilha própria; não inserir arbitrariamente em programação.
4. Definir como cada novo provedor entrará na faixa institucional: logotipos legítimos e direitos de uso, filtros de busca, links reais. Atualizar `providerMarks` e navegação somente no lote efetivamente publicado; nunca exibir uma empresa como parceira.
5. Avaliar a necessidade de novas trilhas tecnológicas e a regra de `homeSources` de cursos vinculados a trilhas reais.
6. Submeter os registros escolhidos ao lote editorial com aprovação individual, digest, evidence e autorização do responsável. Só então aplicar um lote em `release.json`. Não editar manifestos já aplicados.
7. Verificar testes, checagem de tipos, build, dist e UI (mobile e desktop). Nenhuma mudança automática de deploy ou merge.

Este arquivo não concede nem representa aprovação editorial do responsável. Não atribuir ao usuário decisões que ele não tomou sobre os registros específicos.
