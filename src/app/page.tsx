"use client";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Message = {
  role: "user" | "ai";
  text: string;
};

type Provider = "groq" | "ollama";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [provider, setProvider] = useState<Provider>("groq");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const createStars = () => {
      const container = document.querySelector(".stars-container");
      if (!container) return;
      container.innerHTML = "";

      for (let i = 0; i < 100; i++) {
        const star = document.createElement("div");
        star.className = "star";
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const size = Math.random() * 2 + 1;
        const opacity = Math.random() * 0.7 + 0.3;
        const duration = Math.random() * 5 + 5;

        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.opacity = `${opacity}`;
        star.style.animationDuration = `${duration}s`;

        container.appendChild(star);
      }
    };

    createStars();
    window.addEventListener("resize", createStars);
    return () => window.removeEventListener("resize", createStars);
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input, provider }),
      });
      const data = await res.json();
      const aiMessage: Message = { role: "ai", text: data.text };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        role: "ai",
        text: "Lo siento, hubo un error al procesar tu mensaje.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-900 overflow-hidden">
      <div className="stars-container absolute inset-0 overflow-hidden"></div>

      <div className="relative z-10 flex flex-col items-center p-4 md:p-6 max-w-4xl mx-auto min-h-screen">
        {/* Header con selector de provider */}
        <div className="w-full bg-slate-800 bg-opacity-90 rounded-xl shadow-2xl p-4 md:p-6 mt-8 mb-4 backdrop-blur-sm">
          <h1 className="text-2xl font-bold mb-4 text-white">
            Chat con {provider === "groq" ? "Groq" : "Ollama"}
          </h1>

          <div className="flex gap-2 mb-2">
            <button
              className={`px-4 py-2 rounded transition-all ${
                provider === "groq"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-slate-700 text-gray-300 hover:bg-slate-600"
              }`}
              onClick={() => setProvider("groq")}
            >
              Groq
            </button>
            <button
              className={`px-4 py-2 rounded transition-all ${
                provider === "ollama"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-slate-700 text-gray-300 hover:bg-slate-600"
              }`}
              onClick={() => setProvider("ollama")}
            >
              Ollama
            </button>
          </div>
        </div>

        {/* Área de mensajes principal */}
        <div className="flex-1 w-full overflow-y-auto mb-24">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-400">
              <p>Envía un mensaje para comenzar la conversación...</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-4 w-full ${
                  msg.role === "user" ? "flex justify-end" : "flex justify-start"
                }`}
              >
                <div
                  className={`max-w-3xl p-4 rounded-lg ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-slate-800 bg-opacity-70 text-gray-200 rounded-bl-none backdrop-blur-sm"
                  }`}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.text}
                  </ReactMarkdown>
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start mb-4">
              <div className="bg-slate-800 bg-opacity-70 text-gray-200 p-4 rounded-lg rounded-bl-none backdrop-blur-sm">
                <div className="flex items-center">
                  <div className="animate-pulse flex space-x-2">
                    <div className="h-2 w-2 bg-gray-500 rounded-full"></div>
                    <div className="h-2 w-2 bg-gray-500 rounded-full"></div>
                    <div className="h-2 w-2 bg-gray-500 rounded-full"></div>
                  </div>
                  <span className="ml-2">Pensando...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input fijo en la parte inferior */}
        <div className="fixed bottom-0 left-0 right-0 bg-slate-800 bg-opacity-90 backdrop-blur-sm py-4 px-4 md:px-0">
          <div className="max-w-4xl mx-auto">
            <div className="flex w-full">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                className="flex-grow border border-slate-600 bg-slate-700 text-white p-3 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Escribe tu mensaje..."
                style={{ minHeight: "60px", maxHeight: "120px", resize: "none" }}
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-r transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes twinkle {
          0% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.3;
          }
        }

        .star {
          position: absolute;
          background-color: white;
          border-radius: 50%;
          animation: twinkle infinite ease-in-out;
          will-change: opacity;
        }
      `}</style>
    </div>
  );
}