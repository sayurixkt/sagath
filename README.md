# Sagath

Jogo pedagógico de baixa estimulação sensorial para crianças de 9 a 12 anos. A primeira versão inclui três desafios: memória com bandeiras, operações matemáticas e observação de imagens históricas.

## Executar localmente

```bash
npm install
npm run dev
```

Para criar a versão de produção, execute `npm run build`.

## Conteúdo final

Os materiais autorizados devem ser inseridos nos diretórios abaixo antes da publicação:

- `public/assets/cards/pt` e `public/assets/cards/en`: 20 cartas de bandeiras por idioma;
- `public/assets/audio/ambiente.mp3`: música ambiente opcional;
- `public/assets/history`: originais, imagens alteradas e alternativas da fase difícil.

Enquanto esses arquivos não são fornecidos, o projeto apresenta conteúdo demonstrativo em texto e emojis para que todas as mecânicas possam ser testadas.

## Tecnologias

HTML semântico, CSS puro, TypeScript e Vite. Preferências de idioma e tema são armazenadas somente em `localStorage` do navegador.
