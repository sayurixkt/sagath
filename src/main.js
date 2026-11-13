import './styles.css';
import { copy, easyCardImages, GAME_LIMIT_MS, hardCardPairs, mediumCardPairs } from './content';
const app = document.querySelector('#app');
const language = 'pt';
const dark = false;
let soundOn = true;
let page = 'home';
let level = 'easy';
let startTime = 0;
let tickId;
let elapsed = 0;
let moves = 0;
let matched = new Set();
let flipped = [];
let locked = false;
let cards = [];
let resultText = '';
let audio;
const t = () => copy[language];
const levelLabel = (value) => t()[value];
const formatTime = (ms) => `${String(Math.floor(ms / 60000)).padStart(2, '0')}:${String(Math.floor(ms / 1000) % 60).padStart(2, '0')}`;
const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);
function stopAudio() { audio?.pause(); if (audio)
    audio.currentTime = 0; }
function startAudio() {
    if (!soundOn)
        return;
    audio ?? (audio = new Audio('/assets/audio/ambiente.mp3'));
    audio.loop = true;
    audio.play().catch(() => undefined);
}
function clearTimers() { window.clearInterval(tickId); }
function navigate(next) { clearTimers(); if (next !== 'game')
    stopAudio(); page = next; render(); }
function header() {
    return `<header class="site-header">
      <h1 class="brand">Sagath</h1>
      <nav class="main-navigation" aria-label="Navegação principal">
        <button class="nav-button" data-nav="home">Início</button>
        <button class="nav-button" data-nav="about">Sobre</button>
      </nav>
      <div class="header-actions" aria-label="Som do jogo">
        <button class="icon-button" data-action="sound" aria-label="${soundOn ? t().soundOn : t().soundOff}">${soundOn ? '♩' : '♩̸'}</button>
      </div>
    </header>`;
}
function levelCards() {
    return ['easy', 'medium', 'hard'].map((key) => `<button class="level-card" data-level="${key}">${levelLabel(key)}</button>`).join('');
}
function home() { return `<main class="hero welcome"><h2>Bem vindo(a) ao jogo <span class="welcome-brand">Sagath</span></h2><p>Esse jogo é composto por 3 fases, estimule o seu raciocínio enquanto se diverte!</p><button class="round-action" data-nav="levels">Jogar</button></main>`; }
function levels() { return `<main class="page narrow level-choice"><h2>Escolha o nível</h2><div class="level-grid">${levelCards()}</div><button class="text-button back-button" data-nav="home">Voltar</button></main>`; }
function about() {
    return `<main class="page prose about-page">
      <h2>Sobre o projeto</h2>
      <div class="about-copy">
        <p>Sagath é um jogo da memória foi criado como parte do trabalho de conclusão do curso de Ciência da Computação. Nosso objetivo era criar um jogo aconchegante que não possui características hiperestimulação sensorial, ou seja, nosso jogo não possui sons repetitivos, recompensas viciantes e interface com cores chamativas.</p>
        <p>Você pode explorar as diversas característica desse site, não apenas o jogo. Aqui é possível alterar para o modo escuro e também mudar o idioma do site.</p>
        <p>Ele foi feito com muito carinho, esperamos que se divirta!</p>
      </div>
    </main>`;
}
function instructions() {
    const text = level === 'easy'
        ? 'Esse é um jogo de memória tradicional com tema de bandeira de países. Ele não possui contador de tempo, divirta-se em seu próprio tempo.'
        : level === 'medium'
            ? 'A fase média é um jogo de memória mais complexo que a fase anterior. Cada par é formado por uma operação matemática e o seu resultado.'
            : 'A fase difícil também é um jogo da memória. Encontre os pares formados por uma carta de pergunta e sua respectiva resposta.';
    const images = level === 'medium'
        ? `<div class="phase-examples"><div class="image-placeholder">mex1</div><div class="image-placeholder">mex2</div></div>`
        : '';
    return `<main class="page narrow instruction"><h2>${levelLabel(level)}</h2><p>${text}</p>${images}<button class="round-action" data-action="start">${t().start}</button><button class="text-button" data-nav="levels">${t().back}</button></main>`;
}
function buildCards() {
    if (level === 'easy') {
        const chosenImages = shuffle(easyCardImages).slice(0, 8);
        return shuffle(chosenImages.flatMap((image, index) => [
            { id: `a${index}`, image, pair: String(index), label: 'Bandeira' },
            { id: `b${index}`, image, pair: String(index), label: 'Bandeira' }
        ]));
    }
    const pairs = level === 'medium'
        ? mediumCardPairs
        : shuffle(hardCardPairs).slice(0, 8);
    return shuffle(pairs.flatMap(({ id, question, answer }) => [
        { id: `${id}-question`, image: question, pair: id, label: 'Carta de pergunta' },
        { id: `${id}-answer`, image: answer, pair: id, label: 'Carta de resposta' }
    ]));
}
function gameHeader() {
    if (level === 'easy')
        return `<div class="game-meta"><span>${t().moves} <strong id="moves">0</strong></span></div>`;
    return `<div class="game-meta"><span>${t().time} <strong id="timer">00:00</strong></span><span>${t().moves} <strong id="moves">0</strong></span></div>`;
}
function memoryCard(card) {
    const shown = flipped.includes(card.id) || matched.has(card.id);
    const front = `<img src="${card.image}" alt="${card.label}">`;
    const back = '<img src="/assets/cards/pt/clarotras.png" alt="Verso da carta">';
    return `<button class="memory-card ${shown ? 'is-open' : ''} ${matched.has(card.id) ? 'is-match' : ''}" data-card="${card.id}" aria-label="${shown ? card.label || card.value : 'Carta virada'}"><span class="card-front">${front}</span><span class="card-back">${back}</span></button>`;
}
function memoryGame() {
    const cardList = cards.map(memoryCard).join('');
    return `<main class="page game"><div class="game-top"><button class="text-button" data-nav="levels">← ${t().menu}</button>${gameHeader()}</div><h1 class="sr-only">${levelLabel(level)}</h1><section class="memory-grid ${level}" aria-label="Cartas da memória">${cardList}</section></main>`;
}
function result() {
    const alternatives = Object.keys({ easy: 1, medium: 1, hard: 1 }).filter((item) => item !== level);
    const message = level === 'easy' && language === 'pt'
        ? 'Parabéns!<br>Você encontrou todos os pares.'
        : resultText;
    return `<main class="page narrow result"><h1 class="result-message">${message}</h1><div class="actions vertical"><button class="primary" data-action="restart">${t().retry}</button><button class="secondary" data-nav="levels">${t().menu}</button></div><p class="result-level-prompt">${t().levels}</p><div class="shortcut-row">${alternatives.map((item) => `<button class="small-button" data-level="${item}">${levelLabel(item)}</button>`).join('')}</div></main>`;
}
function render() { document.documentElement.lang = language === 'pt' ? 'pt-BR' : 'en'; document.body.dataset.theme = dark ? 'dark' : 'light'; const view = { home, levels, about, instructions, game: memoryGame, result }[page](); app.innerHTML = `${header()}${view}`; attachEvents(); }
function attachEvents() {
    document.querySelectorAll('[data-nav]').forEach((element) => element.addEventListener('click', () => navigate(element.dataset.nav)));
    document.querySelectorAll('[data-level]').forEach((element) => element.addEventListener('click', () => { level = element.dataset.level; navigate('instructions'); }));
    document.querySelector('[data-action="sound"]')?.addEventListener('click', () => { soundOn = !soundOn; if (!soundOn)
        stopAudio();
    else if (page === 'game')
        startAudio(); render(); });
    document.querySelector('[data-action="start"]')?.addEventListener('click', startGame);
    document.querySelector('[data-action="restart"]')?.addEventListener('click', startGame);
    document.querySelectorAll('[data-card]').forEach((button) => button.addEventListener('click', () => flipCard(button.dataset.card)));
}
function startGame() {
    clearTimers();
    startTime = Date.now();
    elapsed = 0;
    moves = 0;
    matched = new Set();
    flipped = [];
    locked = false;
    cards = buildCards();
    page = 'game';
    startAudio();
    render();
    if (level !== 'easy') {
        tickId = window.setInterval(() => { elapsed = Date.now() - startTime; const timer = document.querySelector('#timer'); if (timer)
            timer.textContent = formatTime(elapsed); if (elapsed >= GAME_LIMIT_MS)
            finish(t().timeUp); }, 250);
    }
}
function flipCard(id) {
    if (locked || flipped.includes(id) || matched.has(id))
        return;
    flipped.push(id);
    render();
    if (flipped.length !== 2)
        return;
    moves++;
    locked = true;
    const [first, second] = flipped.map((cardId) => cards.find((card) => card.id === cardId));
    if (first.pair === second.pair) {
        matched.add(first.id);
        matched.add(second.id);
        flipped = [];
        locked = false;
        window.setTimeout(() => { if (matched.size === cards.length)
            finish(level === 'easy' ? t().easyDone() : t().mediumDone(formatTime(elapsed)));
        else
            render(); }, 400);
    }
    else
        window.setTimeout(() => { flipped = []; locked = false; render(); }, 2000);
}
function finish(text) { clearTimers(); resultText = text; stopAudio(); page = 'result'; render(); }
render();
