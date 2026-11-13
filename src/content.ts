export type CardPair = {
    id: string;
    question: string;
    answer: string;
};

export const GAME_LIMIT_MS = 3 * 60 * 1000;

export const easyCardImages = Array.from(
    { length: 20 },
    (_, index) => `/assets/cards/pt/easy/FPT${index + 1}.png`
);

export const mediumCardPairs: CardPair[] = Array.from(
    { length: 8 },
    (_, index) => {
        const id = String(index + 1);
        return {
            id,
            question: `/assets/cards/pt/medium/${id}P.png`,
            answer: `/assets/cards/pt/medium/${id}R.png`
        };
    }
);

export const hardCardPairs: CardPair[] = Array.from(
    { length: 18 },
    (_, index) => {
        const id = String(index + 9);
        return {
            id,
            question: `/assets/cards/pt/hard/${id}P.png`,
            answer: `/assets/cards/pt/hard/${id}R.png`
        };
    }
);

export const copy = {
    levels: 'Escolha o nível',
    start: 'Continuar',
    menu: 'Menu',
    retry: 'Tente novamente',
    easy: 'Fácil',
    medium: 'Médio',
    hard: 'Difícil',
    time: 'Tempo',
    moves: 'Tentativas',
    back: 'Voltar',
    easyDone: () => 'Parabéns! Você encontrou todos os pares.',
    mediumDone: (time: string) => `Parabéns! Você terminou o jogo em ${time}.`,
    timeUp: 'O tempo acabou! Continue praticando.'
};
