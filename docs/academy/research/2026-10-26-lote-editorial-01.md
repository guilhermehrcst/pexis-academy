# Paulex Edu — primeiro lote editorial de candidatos (26/10/2026)

> **Somente pesquisa e revisão. NÃO É APROVAÇÃO EDITORIAL E NÃO AUTORIZA PUBLICAÇÃO.** Nenhuma linha deve ser convertida automaticamente em `release.json` nem em lotes de produção.

## Proveniência e estado

- Base: `paulex-edu-catalogo-mestre.xlsx`, pesquisa do Claude concluída em 24/10/2026, fornecida pelo responsável.
- Levantamento original: **297 candidatos de 136 instituições** (175 marcados verificados pelo Claude, 93 parciais, 23 não verificados, 6 rejeitados), incluindo diferentes **tipos de recurso**. Verificação da pesquisa não equivale a aprovação da Paulex Edu.
- Lista prioritária original: 45 candidatos. **Esta seleção inicial contém 15 desses 45**, com diversidade entre Fundamental, Médio, Vestibulares, Superior, Tecnologia, Carreira e Pré-Militar.
- Estados desta seleção: **10 em revisão editorial, 3 em checagem funcional, 2 com pendências comerciais e zero aprovados**.
- Os 44 recursos já publicados no manifesto não devem ser duplicados, renomeados nem removidos. Manter PR #78 e PR #81 separados; ambos estavam em rascunho na inspeção.
- A planilha original e a verificação externa podem divergir: registrar datas e evidências, nunca suprimir divergências.

## Lote 01: candidatos para revisão, não publicação

| # | ID da pesquisa | Recurso e URL original | Natureza correta | Caminho proposto | Estado | Aprovado? |
|---:|---|---|---|---|---|---|
| 1 | `BR1-001` | [Portal da OBMEP, 8º ano](https://portaldaobmep.impa.br/index.php/modulo/lista?serie=3) | trilha | Fundamental | Revisão editorial | NÃO |
| 2 | `BR1-002` | [Portal da OBMEP, 9º ano](https://portaldaobmep.impa.br/index.php/modulo/lista?serie=4) | trilha | Fundamental | Revisão editorial | NÃO |
| 3 | `BR1-003` | [Code.org CS Fundamentals: Express](https://studio.code.org/s/express?viewAs=Instructor) | curso | Fundamental | Checagem funcional | NÃO |
| 4 | `BR1-004` | [Code.org Pre-reader Express](https://studio.code.org/s/pre-express?viewAs=Instructor) | curso | Fundamental | Checagem funcional | NÃO |
| 5 | `BR1-010` | [Portal da OBMEP, Português Ensino Médio](https://portaldaobmep.impa.br/index.php/site/index?a=3) | trilha | Médio | Revisão editorial | NÃO |
| 6 | `BR1-014` | [Educação Financeira, Fundação Bradesco](https://www.ev.org.br/cursos/educacao-financeira) | curso | Médio | Revisão editorial | NÃO |
| 7 | `BR1-016` | [Comvest: provas comentadas da Unicamp](https://www.comvest.unicamp.br/vestibulares-anteriores/1a-fase-2a-fase-comentadas/) | acervo de provas | Vestibulares | Revisão editorial | NÃO |
| 8 | `INT-002` | [MIT 5.111SC Principles of Chemical Science](https://ocw.mit.edu/courses/5-111sc-principles-of-chemical-science-fall-2014/) | curso | Superior | Revisão editorial | NÃO |
| 9 | `TEC-038` | [The Odin Project: Full Stack JavaScript](https://www.theodinproject.com/paths/full-stack-javascript) | trilha | Tecnologia | Revisão editorial | NÃO |
| 10 | `TEC-040` | [Hugging Face LLM Course](https://huggingface.co/learn/llm-course/chapter1/1) | curso | Tecnologia | Revisão editorial | NÃO |
| 11 | `TEC-041` | [Hugging Face AI Agents Course](https://huggingface.co/learn/agents-course/unit0/introduction) | curso | Tecnologia | Revisão editorial | NÃO |
| 12 | `BR2-003` | [Fundação Bradesco: Atendimento ao Público](https://www.ev.org.br/cursos/atendimento-ao-publico) | curso livre | Carreira (nova categoria proposta) | Revisão editorial | NÃO |
| 13 | `CAR-001` | [HubSpot Academy: Inbound](https://academy.hubspot.com/pt/courses/inbound) | curso de certificação | Negócios (nova categoria proposta) | Checagem funcional | NÃO |
| 14 | `BR1-036` | [Estratégia Militares: pacote ITA 12 meses](https://militares.estrategia.com/concurso/ita/) | curso pago / pacote | Pré-Militar | Pendente comercial | NÃO |
| 15 | `CAR-004` | [Google Project Management Professional Certificate](https://www.coursera.org/professional-certificates/google-project-management) | programa / assinatura | Carreira (nova categoria proposta) | Pendente comercial | NÃO |

## Achados e correções a revisar

1. **Comvest (`BR1-016`):** o acervo oficial de provas comentadas lista 2026 e outras edições recentes. A nota antiga de limite até 2022 precisa ser atualizada. É **material/provas**, não curso. Fonte: https://www.comvest.unicamp.br/vestibulares-anteriores/1a-fase-2a-fase-comentadas/
2. **Hugging Face LLM (`TEC-040`):** a navegação consultada mostra `Certification exam`. O registro antigo afirma ausência de certificado; confirmar natureza e condições antes de corrigir a ficha. Fonte: https://huggingface.co/learn/llm-course/chapter1/1
3. **Code.org (`BR1-003`, `BR1-004`):** URLs da pesquisa contêm `viewAs=Instructor`. Testar caminho de aluno, conteúdo carregado por JavaScript e tradução real; não supor todas as atividades em português. Catálogo oficial: https://code.org/en-US/curriculum/computer-science-fundamentals
4. **Odin (`TEC-038`):** é uma trilha de continuidade da Foundations já publicada (`odin-foundations`); recurso distinto, mas exige indicação contextual sem duplicação.
5. **HubSpot (`CAR-001`):** a página em PT-BR não assegura que todas as aulas tenham áudio/legendas em português. Confirmar experiência real e critérios de certificação.
6. **Estratégia ITA (`BR1-036`):** a oferta informa preço **parcelado** (“a partir de 12 × R$ 324,75”), não preço único nem mensalidade de assinatura. Reabrir a condição comercial e não publicar valor sem contexto. Fonte: https://militares.estrategia.com/concurso/ita/
7. **Google/Coursera (`CAR-004`):** URL canônica atual do programa: https://www.coursera.org/professional-certificates/google-project-management. Preço do mercado EUA mencionado na pesquisa não comprova preço ao estudante brasileiro. Confirmar checkout, disponibilidade, idioma, assinatura e teste grátis.
8. **OBMEP:** recursos por série devem ser classificados como **trilhas**, não como aulas com duração e certificado uniformes.
9. **Cursos livres e materiais:** jamais apresentar coleção de exercícios, provas, módulos e formação técnica regulamentada como equivalentes.

## Gate editorial antes de qualquer publicação

1. Validar URL direta, título e instituição em página oficial acessível; quando o site depender de login/JS, registrar teste funcional feito por humano.
2. Separar `course`, `track`, `past-exam`, `lessons` e demais formatos por evidência concreta.
3. Registrar gratuidade, modalidade paga, assinatura ou acesso condicionado com evidência e data. Preço só com moeda, unidade (parcela/assinatura/compra), região e fonte.
4. Verificar cadastro, idioma, certificado, licenças e condições de estudo, sem inferir campos ausentes.
5. Deduplicar por URL canônica, instituição e conteúdo contra publicados, PR #78, outros stagers e candidatos da planilha.
6. Preparar lote assinado e inventário somente **depois** de autorização editorial explícita. Não usar dados de pesquisa como aprovação fictícia.
7. Depois de uma futura autorização, testar build, navegação e rastreabilidade. Não realizar push/merge/deploy neste trabalho de pesquisa.

## Continuidade

A rodada complementar sobre Libras, ofícios, plataformas técnicas e Fundamental inicial está documentada em `docs/academy/research/2026-10-26-rodada-lacunas.md`. O arquivo XLSX de trabalho com 5 abas, os 15 registros normalizados em JSON e o CSV da rodada 2 foram gerados fora do repositório para análise e aprovação do responsável.
