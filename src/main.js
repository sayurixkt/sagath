import './styles.css';
import { copy, countries, GAME_LIMIT_MS, HISTORY_ANSWER_MS, HISTORY_VIEW_MS, historyChallenges, mathPairs } from './content';
const app = document.querySelector('#app');
let language = localStorage.getItem('sagath-language') || 'pt';
let dark = localStorage.getItem('sagath-theme') === 'dark';
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
let historyIndex = 0;
let historyScore = 0;
let historyStage = 'view';
let historyTimer;
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
function clearTimers() { window.clearInterval(tickId); window.clearTimeout(historyTimer); }
function navigate(next) { clearTimers(); if (next !== 'game')
    stopAudio(); page = next; render(); }
function header() {
    return `<header class="site-header">
      <h1 class="brand">Sagath</h1>
      <nav class="main-navigation" aria-label="Navegação principal">
        <button class="nav-button" data-nav="home">Início</button>
        <button class="nav-button" data-nav="about">Sobre</button>
      </nav>
      <div class="header-actions" aria-label="Preferências">
        <button class="icon-button" data-action="language" aria-label="Alterar idioma">${language === 'pt' ? 'EN' : 'PT'}</button>
        <button class="icon-button" data-action="theme" aria-label="Alterar tema">${dark ? '☀' : '☾'}</button>
        <button class="icon-button" data-action="sound" aria-label="${soundOn ? t().soundOn : t().soundOff}">${soundOn ? '♩' : '♩̸'}</button>
      </div>
    </header>`;
}
function levelCards() {
    const descriptions = { easy: '🗺️', medium: '➗', hard: '🏛️' };
    return Object.keys(descriptions).map((key) => `<button class="level-card ${key}" data-level="${key}"><span>${descriptions[key]}</span><strong>${levelLabel(key)}</strong><small>${key === 'easy' ? 'Geografia' : key === 'medium' ? 'Matemática' : 'História'}</small></button>`).join('');
}
function home() { return `<main class="hero"><p class="eyebrow">9–12 anos</p><h1>${t().projectTitle}</h1><p>Memória, atenção e raciocínio lógico em desafios breves e tranquilos.</p><div class="actions"><button class="primary" data-nav="levels">${t().play}</button><button class="secondary" data-nav="about">${t().about}</button></div></main>`; }
function levels() { return `<main class="page narrow"><p class="eyebrow">Sagath</p><h1>${t().levels}</h1><div class="level-grid">${levelCards()}</div></main>`; }
function about() { return `<main class="page prose"><p class="eyebrow">Sagath</p><h1>${t().about}</h1><h2>${t().projectTitle}</h2><p>${t().projectText}</p><p>${t().principles}</p><button class="secondary" data-nav="home">${t().back}</button></main>`; }
function instructions() { const intro = level === 'easy' ? t().easyIntro : level === 'medium' ? t().mediumIntro : t().hardIntro; return `<main class="page narrow instruction"><p class="eyebrow">${levelLabel(level)}</p><h1>${t().instructions}</h1><div class="instruction-icon">${level === 'easy' ? '🗺️' : level === 'medium' ? '➗' : '🏛️'}</div><p>${intro}</p>${level !== 'easy' ? `<p class="quiet">${t().time}: 03:00</p>` : ''}<button class="primary" data-action="start">${t().start}</button><button class="text-button" data-nav="levels">${t().back}</button></main>`; }
function buildCards() {
    if (level === 'easy')
        return shuffle(countries.flatMap(([pt, en, flag], index) => [{ id: `a${index}`, value: flag, pair: String(index), label: language === 'pt' ? pt : en }, { id: `b${index}`, value: flag, pair: String(index), label: language === 'pt' ? pt : en }]));
    return shuffle(mathPairs.flatMap(([operation, answer], index) => [{ id: `a${index}`, value: operation, pair: String(index) }, { id: `b${index}`, value: answer, pair: String(index) }]));
}
function gameHeader() { return `<div class="game-meta"><span>${t().time} <strong id="timer">00:00</strong></span>${level !== 'hard' ? `<span>${t().moves} <strong id="moves">0</strong></span>` : `<span>${historyIndex + 1}/10</span>`}</div>`; }
function memoryGame() {
    return `<main class="page game"><div class="game-top"><button class="text-button" data-nav="levels">← ${t().menu}</button>${gameHeader()}</div><h1 class="sr-only">${levelLabel(level)}</h1><section class="memory-grid ${level}" aria-label="Memory cards">${cards.map((card) => { const shown = flipped.includes(card.id) || matched.has(card.id); return `<button class="memory-card ${shown ? 'is-open' : ''} ${matched.has(card.id) ? 'is-match' : ''}" data-card="${card.id}" aria-label="${shown ? card.label || card.value : 'Carta virada'}"><span class="card-front">${level === 'easy' ? `<b>${card.value}</b><small>${card.label}</small>` : card.value}</span><span class="card-back">✦</span></button>`; }).join('')}</section></main>`;
}
function historyGame() {
    const challenge = historyChallenges[historyIndex];
    const modified = challenge.scene.replace(challenge.missing, '❔');
    const display = historyStage === 'view' ? challenge.scene : modified;
    return `<main class="page game history-game"><div class="game-top"><button class="text-button" data-nav="levels">← ${t().menu}</button>${gameHeader()}</div><p class="eyebrow">${challenge.title}</p><h1>${historyStage === 'view' ? t().observing : t().question}</h1><div class="history-scene" aria-label="Historical illustration">${display}</div>${historyStage === 'answer' ? `<div class="history-options">${shuffle(challenge.options).map((option) => `<button data-option="${option}" class="history-option" aria-label="Option">${option}</button>`).join('')}</div>` : `<p class="quiet">${formatTime(HISTORY_VIEW_MS)}</p>`}</main>`;
}
function result() { const alternatives = Object.keys({ easy: 1, medium: 1, hard: 1 }).filter((item) => item !== level); return `<main class="page narrow result"><div class="result-symbol">✓</div><h1>${resultText}</h1><div class="actions vertical"><button class="primary" data-action="restart">${t().retry}</button><button class="secondary" data-nav="levels">${t().menu}</button></div><p class="quiet">${t().levels}</p><div class="shortcut-row">${alternatives.map((item) => `<button class="small-button" data-level="${item}">${levelLabel(item)}</button>`).join('')}</div></main>`; }
function render() { document.documentElement.lang = language === 'pt' ? 'pt-BR' : 'en'; document.body.dataset.theme = dark ? 'dark' : 'light'; const view = { home, levels, about, instructions, game: () => level === 'hard' ? historyGame() : memoryGame, result }[page](); app.innerHTML = `${header()}${view}`; attachEvents(); }
function attachEvents() {
    document.querySelectorAll('[data-nav]').forEach((element) => element.addEventListener('click', () => navigate(element.dataset.nav)));
    document.querySelectorAll('[data-level]').forEach((element) => element.addEventListener('click', () => { level = element.dataset.level; navigate('instructions'); }));
    document.querySelector('[data-action="language"]')?.addEventListener('click', () => { language = language === 'pt' ? 'en' : 'pt'; localStorage.setItem('sagath-language', language); render(); });
    document.querySelector('[data-action="theme"]')?.addEventListener('click', () => { dark = !dark; localStorage.setItem('sagath-theme', dark ? 'dark' : 'light'); render(); });
    document.querySelector('[data-action="sound"]')?.addEventListener('click', () => { soundOn = !soundOn; if (!soundOn)
        stopAudio();
    else if (page === 'game')
        startAudio(); render(); });
    document.querySelector('[data-action="start"]')?.addEventListener('click', startGame);
    document.querySelector('[data-action="restart"]')?.addEventListener('click', startGame);
    document.querySelectorAll('[data-card]').forEach((button) => button.addEventListener('click', () => flipCard(button.dataset.card)));
    document.querySelectorAll('[data-option]').forEach((button) => button.addEventListener('click', () => answerHistory(button.dataset.option)));
}
function startGame() {
    clearTimers();
    startTime = Date.now();
    elapsed = 0;
    historyIndex = 0;
    historyScore = 0;
    moves = 0;
    matched = new Set();
    flipped = [];
    locked = false;
    cards = level === 'hard' ? [] : buildCards();
    historyStage = 'view';
    page = 'game';
    startAudio();
    render();
    tickId = window.setInterval(() => { elapsed = Date.now() - startTime; const timer = document.querySelector('#timer'); if (timer)
        timer.textContent = formatTime(elapsed); if (level !== 'easy' && elapsed >= GAME_LIMIT_MS)
        finish(t().timeUp); }, 250);
    if (level === 'hard')
        scheduleHistoryAnswer();
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
            finish(level === 'easy' ? t().easyDone(formatTime(elapsed)) : t().mediumDone(formatTime(elapsed)));
        else
            render(); }, 400);
    }
    else
        window.setTimeout(() => { flipped = []; locked = false; render(); }, 2000);
}
function scheduleHistoryAnswer() { historyTimer = window.setTimeout(() => { historyStage = 'answer'; render(); historyTimer = window.setTimeout(() => nextHistory(), HISTORY_ANSWER_MS); }, HISTORY_VIEW_MS); }
function answerHistory(option) { window.clearTimeout(historyTimer); if (option === historyChallenges[historyIndex].missing)
    historyScore++; nextHistory(); }
function nextHistory() { historyIndex++; if (historyIndex >= historyChallenges.length) {
    const score = Math.round((historyScore / historyChallenges.length) * 100);
    finish(t().hardDone(score, formatTime(elapsed)));
    return;
} historyStage = 'view'; render(); scheduleHistoryAnswer(); }
function finish(text) { clearTimers(); resultText = text; stopAudio(); page = 'result'; render(); }
render();
