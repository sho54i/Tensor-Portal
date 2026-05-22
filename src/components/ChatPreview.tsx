'use client';

import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: number;
}

export default function ChatPreview() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Accord Server is on port 4400
    const socket = io('http://localhost:4400', {
      transports: ['websocket'],
      autoConnect: true,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      console.log('[Portal] Connected to Accord Server');
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.on('message', (msg: Message) => {
      setMessages((prev) => [...prev.slice(-19), msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !socketRef.current) return;

    const msg = {
      id: Date.now().toString(),
      text: input,
      sender: 'Operator',
      timestamp: Date.now(),
    };

    socketRef.current.emit('message', msg);
    setMessages((prev) => [...prev.slice(-19), msg]);
    setInput('');
  };

  return (
    <div className="operator-card w-full max-w-2xl overflow-hidden flex flex-col h-[400px]">
      <div className="px-4 py-2 border-b border-[#1f1f1f] flex items-center justify-between bg-black/50">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-[#50e3c2]' : 'bg-red-500'}`}></div>
          <span className="operator-text text-[10px] text-[#666]">Accord Bridge / Live</span>
        </div>
        <span className="text-[10px] font-mono text-[#333]">ID: 0xACCORD</span>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs custom-scrollbar"
      >
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-[#333] italic">
            Waiting for uplink...
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className={msg.sender === 'Operator' ? 'text-[#50e3c2]' : 'text-blue-400'}>
                  [{msg.sender}]
                </span>
                <span className="text-[10px] text-[#333]">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour12: false })}
                </span>
              </div>
              <p className="text-[#888] pl-4 border-l border-[#1f1f1f] ml-1">
                {msg.text}
              </p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t border-[#1f1f1f] bg-black/30">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={connected ? "Type message..." : "Connecting to Accord..."}
            disabled={!connected}
            className="flex-1 bg-transparent border border-[#333] px-3 py-2 text-xs focus:outline-none focus:border-[#50e3c2] transition-colors"
          />
          <button 
            type="submit"
            disabled={!connected}
            className="px-4 py-2 bg-[#111] border border-[#333] text-[10px] operator-text text-[#666] hover:text-white hover:border-white disabled:opacity-50 transition-all"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
