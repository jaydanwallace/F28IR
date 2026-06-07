const { createServer } = require('http');
const { readFileSync } = require('fs');

const questions = JSON.parse(readFileSync('questions.json', 'utf8'));
const state = { players: {}, currentQuestion: 0, unused: [], log: [], gameOver: false, winner: null };
const staticFiles = { '/': ['index.html', 'text/html'], '/style.css': ['style.css', 'text/css'], '/app.js': ['app.js', 'application/javascript'] };

const write = (res, status, body, type) => {
  res.writeHead(status, { 'Content-Type': type, 'Content-Length': Buffer.byteLength(body) });
  res.end(body);
};

const bad = (res) => {
  write(res, 404, 'Not found', 'text/plain');
};

const shuffle = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const resetDeck = () => {
  state.unused = shuffle([...Array(questions.length).keys()]);
};

const nextQuestion = () => {
  if (!state.unused.length) {
    resetDeck();
  }
  state.currentQuestion = state.unused.pop();
};

const init = () => {
  state.players = {};
  state.log = [];
  state.gameOver = false;
  state.winner = null;
  resetDeck();
  nextQuestion();
};

const clean = (value) => {
  return String(value || '').trim().toLowerCase();
};

const isCorrect = (answer, expected) => {
  const a = clean(answer);
  const e = clean(expected);
  return a === e || a.includes(e) || e.includes(a);
};

createServer((req, res) => {
  const { method, url } = req;

  if (method === 'GET') {
    if (url === '/state') {
      return write(
        res,
        200,
        JSON.stringify({
          players: state.players,
          question: questions[state.currentQuestion],
          log: state.log.slice(0, 20),
          gameOver: state.gameOver,
          winner: state.winner,
        }),
        'application/json'
      );
    }

    if (staticFiles[url]) {
      const [file, type] = staticFiles[url];
      return write(res, 200, readFileSync(file, 'utf8'), type);
    }
  }

  if (method === 'POST') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      const data = JSON.parse(body || '{}');

      if (url === '/join') {
        state.players[data.name] ??= 0;
        return write(res, 200, JSON.stringify({ ok: true }), 'application/json');
      }

      if (url === '/answer') {
        state.players[data.name] ??= 0;
        const correct = isCorrect(data.answer, questions[state.currentQuestion].answer);

        if (correct) {
          state.players[data.name] += 1;
          if (state.players[data.name] >= 5) {
            state.gameOver = true;
            state.winner = data.name;
          }
        }

        state.log.unshift({ who: data.name, answer: data.answer, correct });

        if (!state.gameOver) {
          nextQuestion();
        }

        return write(res, 200, JSON.stringify({ correct }), 'application/json');
      }

      if (url === '/reset') {
        init();
        return write(res, 200, JSON.stringify({ ok: true }), 'application/json');
      }

      bad(res);
    });

    return;
  }

  bad(res);
}).listen(3000, () => {
  console.log('Quiz Showdown running on http://localhost:3000');
});

