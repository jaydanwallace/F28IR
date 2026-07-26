import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

export default function Chat() {
  const [topic, setTopic] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    socket.on('chat-topic', setTopic);
    socket.on('chat-message', (m: string) => setMessages((prev) => [...prev, m]));
    return () => {
      socket.off('chat-topic');
      socket.off('chat-message');
    };
  }, []);

  const send = () => {
    if (!input.trim()) return;
    socket.emit('chat-message', input);
    setInput('');
  };

  return (
    <div>
      <h3>Chat topic: {topic}</h3>
      <ul>
        {messages.map((m, i) => (
          <li key={i}>{m}</li>
        ))}
      </ul>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={send}>Send</button>
    </div>
  );
}