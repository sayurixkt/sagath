export type Level = 'easy' | 'medium' | 'hard';
export type Language = 'pt' | 'en';

export const GAME_LIMIT_MS = 3 * 60 * 1000;
export const HISTORY_VIEW_MS = 5 * 1000;
export const HISTORY_ANSWER_MS = 10 * 1000;

export const easyCardImages = Array.from(
    { length: 20 },
    (_, index) => `/assets/cards/pt/easy/FPT${index + 1}.png`
);
export const copy = {
    pt: {
        play: 'Jogar', about: 'Sobre o projeto', levels: 'Escolha o nível', instructions: 'Como jogar', start: 'Continuar', menu: 'Menu', retry: 'Tente novamente',
        easy: 'Fácil', medium: 'Médio', hard: 'Difícil', time: 'Tempo', moves: 'Tentativas', back: 'Voltar', soundOn: 'Desligar som', soundOff: 'Ligar som',
        easyIntro: 'Encontre os pares de bandeiras. Não há limite de tempo: jogue com calma.',
        mediumIntro: 'Encontre cada operação e seu resultado antes que o tempo termine.',
        hardIntro: 'Observe a imagem histórica. Depois, escolha qual elemento foi removido.',
        easyDone: () => 'Parabéns! Você encontrou todos os pares.',
        mediumDone: (time) => `Parabéns! Você terminou o jogo em ${time}.`,
        hardDone: (score, time) => `Você acertou ${score}% em ${time}.`,
        timeUp: 'O tempo acabou! Continue praticando.', next: 'Próximo desafio', question: 'Qual destes elementos foi removido da imagem?',
        observing: 'Observe com atenção', correct: 'Resposta registrada.', projectTitle: 'Aprender com calma e curiosidade.',
        projectText: 'Sagath é uma experiência pedagógica de baixa estimulação sensorial para crianças de 9 a 12 anos. Os desafios curtos exercitam memória, atenção e raciocínio lógico com conteúdos de geografia, matemática e história.',
        principles: 'A experiência usa uma interface clara, poucos elementos por tela, cores suaves e nenhuma coleta de dados pessoais.'
    },
    en: {
        play: 'Play', about: 'About the project', levels: 'Choose a level', instructions: 'How to play', start: 'Continue', menu: 'Menu', retry: 'Try again',
        easy: 'Easy', medium: 'Medium', hard: 'Hard', time: 'Time', moves: 'Attempts', back: 'Back', soundOn: 'Turn sound off', soundOff: 'Turn sound on',
        easyIntro: 'Find the matching flag pairs. There is no time limit: take your time.',
        mediumIntro: 'Match every operation to its result before time runs out.',
        hardIntro: 'Study the historical image. Then choose which item was removed.',
        easyDone: () => 'Great job! You found every pair.',
        mediumDone: (time) => `Great job! You finished in ${time}.`,
        hardDone: (score, time) => `You scored ${score}% in ${time}.`,
        timeUp: 'Time is up! Keep practising.', next: 'Next challenge', question: 'Which item was removed from the image?',
        observing: 'Look closely', correct: 'Answer saved.', projectTitle: 'Learning with calm and curiosity.',
        projectText: 'Sagath is a low-sensory educational experience for children aged 9 to 12. Short challenges exercise memory, attention, and logical reasoning through geography, mathematics, and history.',
        principles: 'The experience uses a clear interface, few elements per screen, soft colours, and no personal-data collection.'
    }
};
export const countries = [
    ['Brasil', 'Brazil', '🇧🇷'], ['Argentina', 'Argentina', '🇦🇷'], ['Canadá', 'Canada', '🇨🇦'], ['Estados Unidos', 'United States', '🇺🇸'], ['França', 'France', '🇫🇷'],
    ['Alemanha', 'Germany', '🇩🇪'], ['Egito', 'Egypt', '🇪🇬'], ['Índia', 'India', '🇮🇳'], ['Japão', 'Japan', '🇯🇵'], ['Austrália', 'Australia', '🇦🇺']
];
export const mathPairs = [
    ['24 ÷ 6', '4'], ['45 ÷ 9', '5'], ['56 ÷ 7', '8'], ['72 ÷ 8', '9'], ['6 × 7', '42'], ['8 × 9', '72'], ['12 × 4', '48'], ['15 − 23', '−8'], ['9 − 17', '−8'], ['18 + 14', '32']
];
export const historyChallenges = [
    { title: 'Antigo Egito', scene: '🏛️  ☀️  🐪  🌴', missing: '🐪', options: ['🐪', '⚱️', '🌴', '👑'] },
    { title: 'Navegação', scene: '⛵  🧭  🌊  🗺️', missing: '🧭', options: ['⚓', '🧭', '🗺️', '🪙'] },
    { title: 'Pintura rupestre', scene: '🦬  🔥  🏹  🪨', missing: '🏹', options: ['🦬', '🏹', '🐚', '🪨'] },
    { title: 'Roma antiga', scene: '🏛️  🛡️  🏺  🐎', missing: '🏺', options: ['🏺', '🗡️', '🛡️', '🪙'] },
    { title: 'A cidade medieval', scene: '🏰  🐎  🛡️  🔔', missing: '🔔', options: ['🔔', '🗝️', '🐎', '👑'] },
    { title: 'O Brasil colonial', scene: '⛵  🌿  🪙  🏠', missing: '⛵', options: ['⛵', '🦜', '🌿', '🪙'] },
    { title: 'A invenção da escrita', scene: '📜  ✒️  🧱  🪶', missing: '✒️', options: ['🔍', '✒️', '📜', '🪶'] },
    { title: 'Revolução Industrial', scene: '⚙️  🚂  🏭  ⏱️', missing: '⚙️', options: ['⚙️', '🔧', '🚂', '🏭'] },
    { title: 'Astronomia antiga', scene: '🔭  🌙  ⭐  📜', missing: '🔭', options: ['🔭', '☀️', '🌙', '⭐'] },
    { title: 'A escola de antigamente', scene: '📚  ✏️  🪑  🔔', missing: '🪑', options: ['📚', '🪑', '🧮', '✏️'] }
];
