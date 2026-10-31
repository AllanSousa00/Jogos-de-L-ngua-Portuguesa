# Changelog

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).

## [1.1.0] - 2026-10-29

### Visual e áudio

- Biblioteca ilustrada no portal e nova composição para os dois jogos, preservando sua identidade.
- Quatro ilustrações SVG locais e escola redesenhada no próprio tabuleiro.
- Novo relevo, lago, vegetação e paleta da Trilha; casas dimensionadas pela largura do mapa.
- Marcadores compactos em telas menores e nenhuma dependência de imagens remotas para as novas artes.
- Configurações, modo professor, perguntas e resultados com tipografia e contrastes revisados.
- Melodias com acompanhamento e pausas, silêncio imediato e liberação dos nós de áudio.
- Fontes locais com licenças próprias, volume ajustável e preferências acessíveis durante a partida.
- Caravana segue as curvas da estrada e retorna pelo mesmo percurso quando a resposta está errada.

### Correções

- As casas puladas pelo dado deixaram de ser contadas como erros no percentual final da Trilha.
- Reiniciar durante o dado cancela a jogada e a pergunta pendentes; cliques repetidos não duplicam jogadas.
- Foco impedido nos controles atrás das perguntas e da tela inicial da Trilha.
- Revisão do Quiz com rolagem e ações de reinício acima das respostas, preservando o tamanho do texto.
- Ajuste de viewport do Quiz deixou de recalcular continuamente suas próprias alterações de estilo.
- Decorações antigas que cobriam a nova ilustração foram removidas do HTML e do CSS.
- Dependência transitiva de desenvolvimento atualizada; auditoria retornou zero vulnerabilidades conhecidas.
- Porta local 4180, independente do Língua Quest, com inicializador para Windows.

### Preservação

- Bancos originais de 14 e 50 questões e posições do tabuleiro comparados com o ZIP de origem.
- Modos de jogo, armazenamento, créditos, licença e rotas públicas preservados.

## [Unreleased]

### Added

- Portal único de entrada na raiz do site, com botões para abrir o Quiz ou a Trilha.
- Créditos visíveis e licença de uso restrito para pessoas autorizadas pelo responsável.
- Pacotes independentes de desenvolvimento e publicação para o Quiz e para a Trilha.
- Builds `dist/`, servidores locais, validadores de perguntas e configuração Netlify por projeto.
- Auditoria responsiva Playwright para desktop e celular, com verificação de cortes e acesso ao tabuleiro.
- Remoção segura de perguntas personalizadas no modo professor.
- Preferência de movimento reduzido local à Trilha das Habilidades.
- Contrato de independência validado, templates de colaboração e smoke tests Playwright.
- Scripts locais de servidor, build estático, lint, formatação e validação de rotas/storage.
- Workflows separados para integração contínua e publicação no GitHub Pages.

### Changed

- Publicação do GitHub Pages voltou a sincronizar o build `dist/` pelo branch `gh-pages`, evitando
  o ambiente protegido `github-pages`.
- Corrigida a adaptação do modo professor para manter texto legível e conteúdo rolável.
- Corrigido o tabuleiro móvel da Trilha para permitir acesso por rolagem a todas as casas.
- Corrigidos o ícone de tela cheia, uma questão corrompida e alternativas duplicadas do Quiz.
- Conteúdo importado no Quiz agora é renderizado como texto, evitando injeção de HTML.
- Documentação raiz descreve a publicação única com portal e os dois jogos preservados em subpastas.
- Fontes organizadas em `apps/`, material de origem isolado em `referencias/` e publicação mantida
  nas rotas históricas.
- Modal do modo professor mantém o botão de fechamento acessível em telas de menor altura.

### Removed

- Pacotes, builds, servidores e configurações Netlify individuais que pertenciam à ideia antiga de
  publicar os jogos em sites separados.
- Validador duplicado da Trilha e script visual sem testes reais.
- Dependências visuais compartilhadas entre as duas pastas de jogos.
- Documentação extensa e mídias de apresentação redundantes com os aplicativos.

## [1.1.0] - 2026-05-12

### Changed

- Melhorado o contraste do tema escuro da Trilha das Habilidades.
- Criada paleta oficial do projeto com variáveis CSS.
- Padronizadas sombras, foco e estados de hover dos botões.
- Adicionados modos de alto contraste, texto maior, narração, silenciar tudo e tela cheia.
- Criados atalhos de teclado para uso em sala.
- Separado o banco da Trilha em `data.js`.
- Adicionadas perguntas de verdadeiro/falso, completar lacuna e associação.
- Criado resumo final por habilidade.
- Adicionados scripts de validação e checklist de QA.
- Criada página inicial para GitHub Pages.
- Atualizada documentação com manual de uso, edição de perguntas e publicação.

## [1.0.0] - 2026-05-12

### Added

- Organização inicial dos projetos em `Quiz-Portugues` e `Trilha-das-Habilidades`.
- Publicação inicial no repositório `jogo-eduardo`.
