# Paulex Edu: reconstrução de 36 candidatos após limite do Work

**Data:** 26/10/2026. **Estado:** somente pesquisa e staging, sem aprovação editorial ou publicação.

A seleção anterior com 36 registros preparada pelo Work não foi salva no GitHub, e não foi possível recuperar seus registros exatos. Este lote é uma **seleção substituta, identificada explicitamente como tal**, derivada da planilha `paulex-edu-catalogo-mestre.xlsx` da pesquisa do Claude (24/10/2026). A fonte marcou os 36 registros como "Verificado", mas tal marca não equivale a uma nova inspeção independente, aprovação ou publicação.

- **36 candidatos**: 31 gratuitos, 3 pagos e 2 por assinatura; todos com a origem e campos da pesquisa preservados em `2026-10-26-reconstructed-36.json`.
- **25 registros tipados** em `src/lib/staging-recovery-36.ts`: apenas os cursos com caminho já existente na taxonomia. Mantidos sem `verified` deliberadamente até a confirmação editorial da URL oficial, gratuidade/preço, idioma e formato.
- **11 candidatos** de novos caminhos (Negócios, Carreira, Artes, Idiomas, Saúde, Engenharia) ficam apenas na pesquisa, em vez de serem falsamente etiquetados como Tecnologia ou Ensino Superior.
- **0 aprovados** e **0 novos publicados**. `release.json`, `lots.ts`, lotes antigos, destaques e navegação não foram alterados.

## Próximo gate

1. Revalidar diretamente URL, instituição, título e conteúdo de cada candidato. O Work pode ter usado outro conjunto de 36; não atribuir suas verificações à reconstrução.
2. Para cada item a promover, acrescentar `verified` verdadeiro (data, método, evidências verificadas) e reavaliar cadastro, certificado, condições pagas e categorias.
3. Criar pacote de decisão por ID, URL, digest e evidência **exatamente iguais aos registros tipados finais**. O responsável precisa aprovar os itens e a autorização de publicação do lote.
4. Só então executar o mecanismo `tools/academy-release.ts`, CI, merge, deploy e QA de links. Fundamental requer decisão própria para ativar o caminho hoje em preparação.

## Riscos conhecidos

- Cursos pagos do Estratégia Militares informam parcelamento; não tratar 12 parcelas como mensalidade.
- O Coursera varia preço e opções por país; não repetir preço americano como brasileiro.
- Links de Code.org na fonte têm `viewAs=Instructor`; exigir teste de navegação para aluno antes de publicar.
- Coleções e acervos não se transformam automaticamente em cursos individuais.

Esta PR registra dados e prepara staging; **não contém autorização humana**.
