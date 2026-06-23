# Gemini Chatbot

A minimal full-stack chatbot built with:
- **JavaScript / Node.js + Express** — backend (main language per requirements)
- **React (Vite)** — frontend with a `useTimer` hook
- **Google Gemini API** — AI responses
- **Python** — complementary example (`gemini_example.py`)

## Structure

```
chatbot-app/
├── server/               Node.js backend
│   ├── index.js          Express server → calls Gemini REST API
│   ├── package.json
│   └── .env.example
├── client/               React frontend
│   ├── src/
│   │   ├── App.jsx       Chat UI
│   │   ├── useTimer.js   Custom hook — tracks cumulative response time
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
└── gemini_example.py     Complementary Python reference
```

## How the timer works

`useTimer.js` uses `useState` and `useCallback`. Each time the server responds it returns `elapsed` (seconds). `App.jsx` calls `addTime(data.elapsed)`, which adds to the running total in state — React re-renders the display automatically.

## Setup

Get a free API key: https://aistudio.google.com/app/apikey

### 1. Backend
```bash
cd server
cp .env.example .env        # add your GEMINI_API_KEY
npm install
npm start                   # runs on http://localhost:3001
```

### 2. Frontend (separate terminal)
```bash
cd client
npm install
npm run dev                 # runs on http://localhost:5173
```

Open http://localhost:5173, type a question, press Send.
