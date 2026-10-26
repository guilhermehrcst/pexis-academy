# Paulex Edu | Catálogo geral de cursos: gratuitos e pagos

Data da decisão: 24/10/2026. Fonte inicial de candidatos: planilha `cursos_big_techs.xlsx` enviada pelo responsável.

## Posicionamento aprovado

A Paulex Edu é **gratuita para navegar e descobrir oportunidades de aprendizado**. Ela cataloga cursos de terceiros, gratuitos, pagos ou oferecidos por assinatura, além de materiais, tutoriais e trilhas. Uma indicação não é uma parceria, endosso ou venda pela Paulex Edu.

O catálogo não se limita a cursos de big techs nem a tecnologia. O acervo pode crescer por áreas (ensino básico, pré-vestibular, idiomas, programação, trabalho, criação, negócio etc.), **somente depois de existir curadoria real para a área**. Não criar páginas vazias ou alegar cobertura inexistente.

## Taxonomia de acesso (v1)

- `free`: o conteúdo de estudo é acessível sem cobrança. Um certificado opcional pode ser pago, sem tornar o curso pago.
- `paid`: estudar depende de compra avulsa.
- `subscription`: acesso depende de assinatura. Teste grátis não é curso gratuito.
- `conditional`: existe algum acesso contínuo gratuito com restrições identificáveis (p. ex., módulos abertos + pagos). O texto deve explicar exatamente a fronteira gratuita e a cobrança.
- `unconfirmed`: condições não conferidas. Nunca publicar como curso aprovado.

Para ofertas pagas, condicionais ou por assinatura, registrar: URL original, data, método de conferência, modalidade, condições de acesso em linguagem clara, cadastro, certificado e, se o valor estiver disponível/confirmado, `price` com moeda e periodicidade. Não inventar valor, desconto, duração de teste, certificado ou acesso gratuito. Preços mudam: a informação da data de verificação não garante o valor atual. A compra e a matrícula ocorrem exclusivamente no provedor.

A etapa de publicação mantém aprovação por lote, digest imutável e validação de origem. Acrescentar campo opcional aos registros **não** altera os 44 recursos publicados nem seus hashes antigos. Um candidato não entra na página por constar em staging.

## Itens pagos identificados na planilha do Claude

**Estes são itens para revisão, não aprovações ou preços conferidos novamente.**

| Provedor/Plataforma | Curso ou programa | Custo descrito na planilha (não reconfirmado) | URL declarada |
|---|---|---|---|
| NVIDIA DLI | Getting Started with Deep Learning | Pago (US$ 90) | https://courses.nvidia.com/courses/course-v1:DLI+S-FX-01+V1/about |
| Meta / Coursera | Meta Back-End Developer | Assinatura Coursera com teste inicial | https://www.coursera.org/professional-certificates/meta-back-end-developer |
| Meta / Coursera | Meta Android Developer | Assinatura Coursera com teste inicial | https://www.coursera.org/professional-certificates/meta-android-developer |
| Meta / Coursera | Meta Android UI Development | Assinatura Coursera com teste inicial | https://www.coursera.org/specializations/meta-android-ui-development |
| Meta / Coursera | Building Generative AI Apps with Llama | Assinatura, conferir | https://www.coursera.org/professional-certificates/building-generative-ai-apps-llama |
| Meta / Coursera | Foundations of LLMs and Llama Development | Assinatura, conferir | https://www.coursera.org/learn/foundations-of-llms-and-llama-development |

Outros casos que precisam de investigação antes de classificação: Google AI Essentials e Google AI Certificate (Coursera), recursos Apple com custo não informado, e links genéricos da OpenAI Academy e Google Skills que não identificam um curso individual. Parte das 52 linhas descreve trilhas ou coleções e não deve ser desdobrada em supostos cursos sem evidência.

## Regras de interface

1. O acesso à **Paulex Edu** nunca gera cobrança própria; cursos podem exigir pagamento externo.
2. O modo de acesso deve aparecer no card/lista antes de abrir o provedor, e na página de detalhes quando existir.
3. Diferenciar `Gratuito`, `Pago`, `Assinatura`, `Acesso gratuito com condições`. Para assinaturas não anunciar período de teste como gratuidade.
4. Se o preço foi confirmado, exibir valor e moeda com data de verificação; se não, exibir o modo e orientar a consultar condições atualizadas no provedor. Não prometer valores fixos.
5. Preservar a experiência sem cadastro, a navegação dos seis caminhos e o filtro por fonte.
6. À medida que houver cursos publicados em mais áreas, acrescentar taxonomia e filtros de forma incremental, sem esconder cursos de disciplinas não tecnológicas.
7. Não presumir parceria com Google, Apple, Meta, NVIDIA, OpenAI ou Anthropic só porque seus logos identificam fontes pesquisadas.

## Gate para colocar os 52 itens no ar

Validar individualmente nome, modalidade real, conteúdo, idioma, custos, condições de matrícula, certificado, formato, URL oficial e duplicidades com o catálogo existente e o PR #78. Registrar evidência de cada decisão; aprovar lote explícito; atualizar o inventário publicado, projeções e busca; validar build e navegação. **Nenhum dos 52 itens está autorizado para publicação apenas por constar na planilha.**

## Limites desta PR

Esta PR entrega o suporte técnico e a comunicação de acesso pago, com testes. **Não publica cursos pagos novos nem altera inventário, manifestos antigos, páginas de fornecedor ou meios de pagamento.**
