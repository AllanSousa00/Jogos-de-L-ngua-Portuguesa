"use strict";

window.TRILHA_DATA = {
  questionsPerSkill: 2,
  questionTypes: {
    "multiple-choice": "Múltipla escolha",
    "true-false": "Verdadeiro ou falso",
    "fill-blank": "Completar lacuna",
    association: "Associação"
  },
  skills: [
    { name: "Leitura e interpretação", icon: "LI" },
    { name: "Ortografia", icon: "OR" },
    { name: "Pontuação", icon: "PT" },
    { name: "Classes de palavras", icon: "CP" },
    { name: "Concordância", icon: "CO" },
    { name: "Sinônimos e antônimos", icon: "SA" },
    { name: "Acentuação", icon: "AC" },
    { name: "Uso dos porquês", icon: "PQ" },
    { name: "Produção textual", icon: "PX" },
    { name: "Coesão e coerência", icon: "CC" }
  ],
  tilePositions: [
    { x: 13.1, y: 85.4, rotate: 7 },
    { x: 24.6, y: 86.6, rotate: -6 },
    { x: 33, y: 73.2, rotate: -18 },
    { x: 29.2, y: 56.3, rotate: -18 },
    { x: 20.8, y: 42.2, rotate: -18 },
    { x: 22.9, y: 23.8, rotate: -15 },
    { x: 34, y: 17.2, rotate: -1 },
    { x: 45.3, y: 21.6, rotate: 10 },
    { x: 50.7, y: 37.8, rotate: 18 },
    { x: 53.1, y: 57.4, rotate: 15 },
    { x: 63.7, y: 57.9, rotate: -18 },
    { x: 66.5, y: 38.7, rotate: -18 },
    { x: 73, y: 22.6, rotate: -11 },
    { x: 84.3, y: 18.9, rotate: 5 },
    { x: 91.8, y: 32.7, rotate: 18 },
    { x: 87.4, y: 50.7, rotate: 18 },
    { x: 76.5, y: 57.9, rotate: 18 },
    { x: 69.7, y: 72.8, rotate: 18 },
    { x: 76.1, y: 87.1, rotate: 4 },
    { x: 87.4, y: 84.5, rotate: -8 }
  ],
  startPosition: { x: 7.9, y: 80.7 },
  tileColors: ["#d78b78", "#e6c477", "#8eb69b", "#8dbdc5", "#baa1c0", "#dca079"],
  questions: [
    {
      skill: "Leitura e interpretação",
      type: "multiple-choice",
      difficulty: "fácil",
      prompt: "Em um texto narrativo, quem conta os acontecimentos é chamado de:",
      options: ["Personagem", "Narrador", "Leitor", "Autor da capa"],
      answer: 1,
      explanation: "O narrador é a voz que apresenta os acontecimentos da narrativa."
    },
    {
      skill: "Leitura e interpretação",
      type: "multiple-choice",
      difficulty: "fácil",
      prompt: "Quando uma informação está escrita claramente no texto, ela é:",
      options: ["Implícita", "Contrária", "Explícita", "Inventada"],
      answer: 2,
      explanation: "Informação explícita aparece diretamente no texto."
    },
    {
      skill: "Leitura e interpretação",
      type: "true-false",
      difficulty: "média",
      prompt: "Verdadeiro ou falso: uma ideia implícita precisa ser deduzida pelo leitor.",
      options: ["Verdadeiro", "Falso"],
      answer: 0,
      explanation: "A informação implícita não aparece diretamente; o leitor precisa inferir pelo contexto."
    },
    {
      skill: "Leitura e interpretação",
      type: "association",
      difficulty: "média",
      prompt: "Associe corretamente: personagem é quem...",
      options: ["Organiza os parágrafos", "Participa dos fatos narrados", "Corrige a ortografia", "Marca o fim da pergunta"],
      answer: 1,
      explanation: "Personagem é quem participa das ações ou acontecimentos de uma narrativa."
    },
    {
      skill: "Leitura e interpretação",
      type: "fill-blank",
      difficulty: "média",
      prompt: "Complete: para entender melhor um texto, é importante observar o ___.",
      options: ["contexto", "teclado", "tamanho da folha", "nome da fonte"],
      answer: 0,
      explanation: "O contexto ajuda a compreender sentidos, intenções e informações do texto."
    },
    {
      skill: "Ortografia",
      type: "multiple-choice",
      difficulty: "fácil",
      prompt: "Qual palavra está escrita corretamente?",
      options: ["Excessão", "Exceção", "Esceção", "Esseção"],
      answer: 1,
      explanation: "A escrita correta é exceção."
    },
    {
      skill: "Ortografia",
      type: "fill-blank",
      difficulty: "fácil",
      prompt: "Complete: O aluno fez uma boa ___.",
      options: ["pesquiza", "pesquisa", "pezquisa", "pesquissa"],
      answer: 1,
      explanation: "A forma correta é pesquisa."
    },
    {
      skill: "Ortografia",
      type: "multiple-choice",
      difficulty: "média",
      prompt: "Qual alternativa apresenta a grafia correta?",
      options: ["Enchergar", "Enxergar", "Inxergar", "Encherguar"],
      answer: 1,
      explanation: "A grafia correta é enxergar, com x."
    },
    {
      skill: "Ortografia",
      type: "true-false",
      difficulty: "média",
      prompt: "Verdadeiro ou falso: a palavra 'certeza' é escrita com z.",
      options: ["Verdadeiro", "Falso"],
      answer: 0,
      explanation: "Certeza é escrita com z."
    },
    {
      skill: "Ortografia",
      type: "fill-blank",
      difficulty: "média",
      prompt: "Complete: A professora pediu uma boa ___.",
      options: ["redação", "redassão", "redacão", "redasão"],
      answer: 0,
      explanation: "A forma correta é redação."
    },
    {
      skill: "Pontuação",
      type: "multiple-choice",
      difficulty: "fácil",
      prompt: "Qual sinal usamos ao final de uma pergunta direta?",
      options: ["Ponto final", "Vírgula", "Ponto de interrogação", "Dois-pontos"],
      answer: 2,
      explanation: "Perguntas diretas terminam com ponto de interrogação."
    },
    {
      skill: "Pontuação",
      type: "multiple-choice",
      difficulty: "média",
      prompt: "Na frase 'Maria, venha aqui', a vírgula separa:",
      options: ["Uma pergunta", "Um vocativo", "Uma data", "Uma resposta"],
      answer: 1,
      explanation: "Maria é o vocativo, termo usado para chamar alguém."
    },
    {
      skill: "Pontuação",
      type: "true-false",
      difficulty: "fácil",
      prompt: "Verdadeiro ou falso: o ponto final pode indicar o término de uma frase declarativa.",
      options: ["Verdadeiro", "Falso"],
      answer: 0,
      explanation: "O ponto final marca o encerramento de uma frase declarativa."
    },
    {
      skill: "Pontuação",
      type: "fill-blank",
      difficulty: "média",
      prompt: "Complete: antes de uma enumeração, podemos usar ___.",
      options: ["dois-pontos", "travessão sempre", "reticências obrigatórias", "aspas finais"],
      answer: 0,
      explanation: "Os dois-pontos podem introduzir uma enumeração."
    },
    {
      skill: "Pontuação",
      type: "association",
      difficulty: "média",
      prompt: "Associe: reticências geralmente indicam...",
      options: ["Continuação ou interrupção de ideia", "Pergunta direta", "Separação de sílabas", "Nome próprio"],
      answer: 0,
      explanation: "As reticências indicam suspensão, continuação ou interrupção do pensamento."
    },
    {
      skill: "Classes de palavras",
      type: "multiple-choice",
      difficulty: "fácil",
      prompt: "Na frase 'A casa azul é bonita', a palavra 'azul' é:",
      options: ["Substantivo", "Verbo", "Adjetivo", "Artigo"],
      answer: 2,
      explanation: "Azul caracteriza o substantivo casa, por isso é adjetivo."
    },
    {
      skill: "Classes de palavras",
      type: "multiple-choice",
      difficulty: "fácil",
      prompt: "Qual alternativa apresenta um verbo?",
      options: ["Feliz", "Correr", "Mesa", "Muito"],
      answer: 1,
      explanation: "Correr indica uma ação, portanto é verbo."
    },
    {
      skill: "Classes de palavras",
      type: "association",
      difficulty: "média",
      prompt: "Associe: substantivo é a classe que costuma nomear...",
      options: ["Seres, objetos e ideias", "Ações e estados", "Características", "Relações de tempo"],
      answer: 0,
      explanation: "Substantivos nomeiam seres, objetos, lugares, sentimentos e ideias."
    },
    {
      skill: "Classes de palavras",
      type: "true-false",
      difficulty: "média",
      prompt: "Verdadeiro ou falso: 'rapidamente' é um advérbio.",
      options: ["Verdadeiro", "Falso"],
      answer: 0,
      explanation: "Rapidamente indica modo, por isso funciona como advérbio."
    },
    {
      skill: "Classes de palavras",
      type: "fill-blank",
      difficulty: "média",
      prompt: "Complete: em 'o aluno estudou', a palavra 'estudou' é um ___.",
      options: ["verbo", "artigo", "adjetivo", "pronome"],
      answer: 0,
      explanation: "Estudou indica ação no passado, portanto é verbo."
    },
    {
      skill: "Concordância",
      type: "multiple-choice",
      difficulty: "fácil",
      prompt: "Qual frase apresenta concordância correta?",
      options: ["Os menino brinca.", "As meninas cantam.", "A casas caiu.", "Nós estudou."],
      answer: 1,
      explanation: "Sujeito plural pede verbo no plural: as meninas cantam."
    },
    {
      skill: "Concordância",
      type: "fill-blank",
      difficulty: "fácil",
      prompt: "Complete corretamente: Eles ___ cedo para a escola.",
      options: ["chega", "chegamos", "chegam", "cheguei"],
      answer: 2,
      explanation: "Com 'eles', usamos o verbo no plural: chegam."
    },
    {
      skill: "Concordância",
      type: "true-false",
      difficulty: "média",
      prompt: "Verdadeiro ou falso: em 'as criança brincam', a concordância está correta.",
      options: ["Verdadeiro", "Falso"],
      answer: 1,
      explanation: "O correto é 'as crianças brincam', com substantivo no plural."
    },
    {
      skill: "Concordância",
      type: "multiple-choice",
      difficulty: "média",
      prompt: "Qual opção completa corretamente: A turma ___ animada.",
      options: ["estão", "estava", "estavam", "estaremos"],
      answer: 1,
      explanation: "Turma é sujeito no singular, então usamos 'estava'."
    },
    {
      skill: "Concordância",
      type: "association",
      difficulty: "média",
      prompt: "Associe: sujeito plural combina melhor com verbo...",
      options: ["no plural", "sempre no singular", "sem flexão", "apenas no infinitivo"],
      answer: 0,
      explanation: "Em geral, sujeito plural pede verbo no plural."
    },
    {
      skill: "Sinônimos e antônimos",
      type: "multiple-choice",
      difficulty: "fácil",
      prompt: "Um sinônimo de 'alegre' é:",
      options: ["Triste", "Contente", "Lento", "Frio"],
      answer: 1,
      explanation: "Contente tem sentido parecido com alegre."
    },
    {
      skill: "Sinônimos e antônimos",
      type: "multiple-choice",
      difficulty: "fácil",
      prompt: "Um antônimo de 'claro' é:",
      options: ["Escuro", "Brilhante", "Limpo", "Leve"],
      answer: 0,
      explanation: "Escuro tem sentido contrário a claro."
    },
    {
      skill: "Sinônimos e antônimos",
      type: "association",
      difficulty: "média",
      prompt: "Associe: antônimo é uma palavra com sentido...",
      options: ["contrário", "igual", "diminutivo", "sempre informal"],
      answer: 0,
      explanation: "Antônimos apresentam sentidos opostos."
    },
    {
      skill: "Sinônimos e antônimos",
      type: "true-false",
      difficulty: "média",
      prompt: "Verdadeiro ou falso: 'rápido' e 'veloz' são sinônimos.",
      options: ["Verdadeiro", "Falso"],
      answer: 0,
      explanation: "As duas palavras têm sentido semelhante."
    },
    {
      skill: "Sinônimos e antônimos",
      type: "fill-blank",
      difficulty: "média",
      prompt: "Complete: o antônimo de 'entrada' é ___.",
      options: ["saída", "porta", "início", "corredor"],
      answer: 0,
      explanation: "Saída é o sentido oposto de entrada."
    },
    {
      skill: "Acentuação",
      type: "multiple-choice",
      difficulty: "fácil",
      prompt: "Qual palavra precisa de acento?",
      options: ["Cafe", "Casa", "Mesa", "Livro"],
      answer: 0,
      explanation: "A forma correta é café."
    },
    {
      skill: "Acentuação",
      type: "multiple-choice",
      difficulty: "fácil",
      prompt: "Qual palavra está acentuada corretamente?",
      options: ["Arvore", "Árvore", "Aviao", "Ideia"],
      answer: 1,
      explanation: "Árvore é uma proparoxítona e recebe acento."
    },
    {
      skill: "Acentuação",
      type: "true-false",
      difficulty: "média",
      prompt: "Verdadeiro ou falso: toda proparoxítona é acentuada.",
      options: ["Verdadeiro", "Falso"],
      answer: 0,
      explanation: "As proparoxítonas recebem acento gráfico."
    },
    {
      skill: "Acentuação",
      type: "fill-blank",
      difficulty: "média",
      prompt: "Complete com a forma correta: O ___ estava quente.",
      options: ["café", "cafe", "cafê", "cafè"],
      answer: 0,
      explanation: "Café é oxítona terminada em e e recebe acento agudo."
    },
    {
      skill: "Acentuação",
      type: "association",
      difficulty: "média",
      prompt: "Associe: acento agudo geralmente indica som...",
      options: ["aberto em muitas palavras", "sempre nasal", "sempre fechado", "sem tonicidade"],
      answer: 0,
      explanation: "O acento agudo costuma marcar vogal tônica aberta em várias palavras."
    },
    {
      skill: "Uso dos porquês",
      type: "fill-blank",
      difficulty: "fácil",
      prompt: "Complete: Não fui à aula ___ estava doente.",
      options: ["por que", "por quê", "porque", "porquê"],
      answer: 2,
      explanation: "Porque é usado em respostas e explicações."
    },
    {
      skill: "Uso dos porquês",
      type: "fill-blank",
      difficulty: "fácil",
      prompt: "Complete: ___ você chegou atrasado?",
      options: ["Por que", "Porque", "Porquê", "Por quê"],
      answer: 0,
      explanation: "Por que é usado no início de perguntas."
    },
    {
      skill: "Uso dos porquês",
      type: "true-false",
      difficulty: "média",
      prompt: "Verdadeiro ou falso: 'porquê' pode ser usado como substantivo.",
      options: ["Verdadeiro", "Falso"],
      answer: 0,
      explanation: "O porquê, com artigo, funciona como substantivo: 'o porquê da decisão'."
    },
    {
      skill: "Uso dos porquês",
      type: "multiple-choice",
      difficulty: "média",
      prompt: "Qual forma completa: Você saiu cedo ___?",
      options: ["porque", "porquê", "por quê", "por que"],
      answer: 2,
      explanation: "No fim de pergunta, usa-se 'por quê'."
    },
    {
      skill: "Uso dos porquês",
      type: "association",
      difficulty: "média",
      prompt: "Associe: 'porque' é mais usado para...",
      options: ["explicar uma causa", "perguntar diretamente", "nomear um motivo", "terminar pergunta"],
      answer: 0,
      explanation: "Porque introduz explicação ou causa."
    },
    {
      skill: "Produção textual",
      type: "multiple-choice",
      difficulty: "fácil",
      prompt: "Antes de escrever um texto, é importante:",
      options: ["Apagar tudo", "Planejar as ideias", "Copiar sem ler", "Ignorar o tema"],
      answer: 1,
      explanation: "Planejar ajuda a organizar as ideias antes da escrita."
    },
    {
      skill: "Produção textual",
      type: "multiple-choice",
      difficulty: "fácil",
      prompt: "A revisão de um texto serve para:",
      options: ["Encontrar e corrigir problemas", "Tirar o título", "Mudar o autor", "Excluir todas as frases"],
      answer: 0,
      explanation: "Revisar permite melhorar clareza, escrita e organização."
    },
    {
      skill: "Produção textual",
      type: "association",
      difficulty: "média",
      prompt: "Associe: introdução é a parte que geralmente...",
      options: ["apresenta o assunto", "encerra o texto", "corrige acentos", "lista apenas verbos"],
      answer: 0,
      explanation: "A introdução apresenta o tema e prepara o leitor."
    },
    {
      skill: "Produção textual",
      type: "true-false",
      difficulty: "média",
      prompt: "Verdadeiro ou falso: revisar um texto pode melhorar a clareza das ideias.",
      options: ["Verdadeiro", "Falso"],
      answer: 0,
      explanation: "A revisão ajuda a corrigir problemas e deixar o texto mais claro."
    },
    {
      skill: "Produção textual",
      type: "fill-blank",
      difficulty: "média",
      prompt: "Complete: um bom título deve ter relação com o ___ do texto.",
      options: ["tema", "tamanho da letra", "nome do arquivo", "número da página"],
      answer: 0,
      explanation: "O título precisa dialogar com o tema tratado no texto."
    },
    {
      skill: "Coesão e coerência",
      type: "multiple-choice",
      difficulty: "fácil",
      prompt: "A palavra 'portanto' geralmente indica:",
      options: ["Conclusão", "Dúvida", "Lugar", "Personagem"],
      answer: 0,
      explanation: "Portanto introduz uma conclusão."
    },
    {
      skill: "Coesão e coerência",
      type: "multiple-choice",
      difficulty: "fácil",
      prompt: "Um texto coerente apresenta ideias:",
      options: ["Sem relação", "Organizadas e com sentido", "Sempre repetidas", "Todas contraditórias"],
      answer: 1,
      explanation: "Coerência é a relação lógica entre as ideias do texto."
    },
    {
      skill: "Coesão e coerência",
      type: "association",
      difficulty: "média",
      prompt: "Associe: coesão depende do uso adequado de...",
      options: ["conectivos e retomadas", "letras aleatórias", "frases sem relação", "apenas desenhos"],
      answer: 0,
      explanation: "Conectivos e retomadas ajudam a ligar as partes do texto."
    },
    {
      skill: "Coesão e coerência",
      type: "true-false",
      difficulty: "média",
      prompt: "Verdadeiro ou falso: um texto coerente pode ter ideias contraditórias sem explicação.",
      options: ["Verdadeiro", "Falso"],
      answer: 1,
      explanation: "Contradições sem explicação prejudicam a coerência."
    },
    {
      skill: "Coesão e coerência",
      type: "fill-blank",
      difficulty: "média",
      prompt: "Complete: conectivos como 'mas' e 'porém' indicam ideia de ___.",
      options: ["oposição", "lugar", "personagem", "tempo exato"],
      answer: 0,
      explanation: "Mas e porém são conectivos de oposição."
    }
  ]
};
