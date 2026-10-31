# Jogos de Língua Portuguesa

Site educacional com um portal único e dois jogos de revisão:

- **Quiz Português**: perguntas rápidas, feedback imediato e modo professor.
- **Trilha das Habilidades**: tabuleiro com dado, casas, habilidades e perguntas por etapa.

## Edição visual 1.1

A reformulação mantém os dois jogos, as 14 perguntas originais do Quiz, as 50 perguntas da Trilha e as
posições do tabuleiro. O ZIP de origem está preservado na pasta irmã `06 - 📦 Arquivos de Origem`.

- Portal com biblioteca ilustrada, temas claro e escuro e capas próprias: oficina tipográfica e expedição.
- Identidade de caderno de descobertas, com fichas de resposta, margem de papel e carimbos de feedback.
- Capas com interação por foco e ponteiro; movimento reduzido preservado.
- Tabuleiro com contorno da parada atual, marcas de passagem e indicação acessível de etapa.
- Quiz com prensa tipográfica ilustrada, alternativas com maior contraste, selo de leitura e revisão final com rolagem.
- Trilha com bilhete de expedição, paisagem ilustrada e dez símbolos próprios para as habilidades.
  Os símbolos acompanham as casas, as perguntas e o relatório final; os nomes por extenso permanecem.
- Música instrumental sintetizada localmente, com frases e pausas; não exige download de áudio.
- Fontes Baloo 2 e Outfit incluídas localmente, com suas licenças; as telas não dependem do Google Fonts.
- Vale com ipês, lago e recanto de leitura conectado à estrada; lanternas junto às construções no tema escuro.
- Linha de tinta acompanhando o percurso real, incluindo retorno e reinício.
- Ônibus vira conforme a direção da estrada, inclina nas curvas e estaciona nivelado, preservando o letreiro.
- Caravana animada pela geometria da estrada, com retorno pela rota ao errar e movimento imediato quando
  as animações estão reduzidas.
- Volume e silêncio nos dois jogos; opções da Trilha disponíveis também durante a partida.
- Ajustes organizados por finalidade, indicadores de estado e retorno com Esc no Quiz.
- Cabeçalho do modo professor permanece acessível durante a rolagem do formulário.
- Preferências da Trilha conferidas em 320 pixels com texto maior e alto contraste simultâneos.
- Som interrompido ao silenciar ou ocultar a aba; nós de áudio liberados ao finalizar cada nota.
- Resultado da Trilha calculado pelas respostas dadas: casas puladas pelo dado não contam como erros.
- Foco restrito às perguntas da Trilha e suporte preservado a texto maior, alto contraste e menos animações.

As quatro ilustrações principais são SVG editáveis. A Trilha também usa uma composição horizontal
própria em telas estreitas, para manter a paisagem inteira visível; o favicon completa o conjunto.
Os créditos e os termos de uso continuam válidos. A edição não publica automaticamente o site em
nenhum serviço.

## Rotas publicadas

| Rota                       | Conteúdo               | Fonte                          |
| -------------------------- | ---------------------- | ------------------------------ |
| `/`                        | Portal de seleção      | `apps/portal/`                 |
| `/Quiz-Portugues/`         | Quiz Português         | `apps/quiz-portugues/`         |
| `/Trilha-das-Habilidades/` | Trilha das Habilidades | `apps/trilha-das-habilidades/` |

O formulário de autorização é um projeto separado. Ele não faz parte do build deste repositório:

- [Solicitar autorização de uso](https://site-de-pedidos-pt.pages.dev/)
- [Código do portal de solicitações](https://github.com/AllanSousa00/site-de-pedidos-pt)

O DOCX em `referencias/questoes-para-o-jogo.docx` é material pedagógico de origem para consulta e
fica fora do build publicado.

## Termos de uso

Copyright © 2026 Allan Sousa. Todos os direitos reservados.

Este é um projeto de **uso restrito**. O acesso ao site, ao repositório ou aos arquivos não concede
licença de uso nem transfere qualquer direito sobre o código, os textos, as perguntas, a identidade
visual, a documentação ou os demais materiais do projeto.

Sem autorização prévia, expressa e por escrito do responsável, não é permitido:

- usar o projeto em atividades pessoais, acadêmicas, educacionais, institucionais ou comerciais;
- copiar, modificar, adaptar, traduzir ou criar versões derivadas;
- distribuir, publicar, vender, sublicenciar ou disponibilizar cópias;
- hospedar o projeto, total ou parcialmente, em sites, plataformas ou repositórios;
- remover créditos, avisos de autoria ou referências à licença.

O envio do formulário representa apenas um **pedido de análise**. O uso continua proibido até que o
solicitante receba uma autorização expressa por escrito. Qualquer autorização vale somente para a
finalidade, o período, os jogos e as condições informadas na resposta do responsável.

Consulte também o arquivo [LICENSE](LICENSE). Em caso de dúvida, escreva para
**allancruzsousa519@gmail.com**.

## Requisitos

- Node.js 20 ou superior;
- Node.js 22 LTS recomendado;
- Chromium do Playwright para os testes de navegador.

## Desenvolvimento

```bash
npm install
npx playwright install chromium
npm run serve
```

O portal local fica disponível em `http://127.0.0.1:4180/`, em uma porta separada do Língua Quest.
No Windows, `Iniciar.cmd` abre o navegador e inicia o servidor usando o Node.js instalado.

## Validação e build

```bash
npm run check
npm run build:static
npm run preview
```

O build estático é gerado em `dist/`. O workflow `.github/workflows/pages.yml` publica essa pasta no
GitHub Pages quando há alterações na branch `main`.

## Qualidade

`npm run check` valida:

- sintaxe e estrutura do portal e dos jogos;
- bancos de perguntas;
- lint e formatação;
- navegação e fluxos principais;
- layout em celular estreito `320x568`, celular `390x844`, paisagem `844x390`, tablet `768x1024`,
  desktop `1280x720` e tela ampla `1920x1080`;
- cortes horizontais, elementos fora da tela e acesso ao tabuleiro móvel.

`npm run test:unit` verifica os ciclos de áudio, o cancelamento de música durante retomada do contexto,
o silêncio, a liberação dos osciladores e o cálculo do resultado da Trilha, sem abrir navegador.
Os testes E2E exigem o Chromium do Playwright instalado e são separados dos testes unitários.

Na revisão visual atual, portal e jogos foram conferidos em desktop e celular, em temas claro e escuro.
A suíte Playwright verifica 10 resoluções, de 320×568 a 2560×1440, incluindo orientação horizontal;
os 118 testes E2E cobrem também o percurso completo da Trilha, seu resumo e o reinício. Os 110 testes
de layout exercitam os controles, feedback, configurações, legibilidade e conteúdo sem cortes em cada
tamanho. Os 20 testes unitários cobrem áudio, resultados, foco das opções, cancelamento de jogadas
durante o reinício e deslocamento da caravana pela estrada, incluindo retorno, tinta do percurso,
direção, inclinação e movimento reduzido. Essa checagem de navegador não substitui uma revisão manual
em aparelhos físicos.

## Estrutura

```text
.
|-- apps/
|   |-- portal/                  # entrada do site
|   |-- quiz-portugues/          # jogo 1
|   `-- trilha-das-habilidades/  # jogo 2
|-- referencias/                 # DOCX pedagógico de origem, não publicado
|-- tests/e2e/                   # testes funcionais e responsivos
|-- tools/                       # automação do workspace
`-- .github/                     # integração contínua e publicação
```
