"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ArrowLeft, Send, Sparkles, MessageSquare, Bot } from "lucide-react";

export default function AgentChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [person, setPerson] = useState<any>(null);
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/people/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPerson(data.person);
        setMessages([
          {
            role: "assistant",
            content: `Hey! I'm ${data.person?.name || "Candidate"}'s agent, speaking directly in their authentic voice. Feel free to ask me anything about my passions, lifestyle, or what I look for in meaningful connections.`,
          },
        ]);
      })
      .catch(() => {});
  }, [id]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    const newHistory = [...messages, { role: "user", content: userMsg }];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      const res = await fetch(`/api/people/${id}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, history: newHistory }),
      });
      const data = await res.json();
      if (res.ok && data.reply) {
        setMessages([...newHistory, { role: "assistant", content: data.reply }]);
      }
    } catch {
      setMessages([
        ...newHistory,
        { role: "assistant", content: "Sorry, I had trouble processing that response." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/people/${id}`} className="text-zinc-400 hover:text-white p-1">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              <Bot className="w-4 h-4 text-purple-400" />
              Chatting with {person?.name || "Agent"}
            </h1>
            <p className="text-[11px] text-zinc-400">Authentic voice demonstration</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                m.role === "user"
                  ? "bg-rose-600 text-white rounded-br-none"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-bl-none"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl rounded-bl-none px-4 py-3 text-xs text-zinc-400 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin" />
              Thinking in character...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="pt-4 border-t border-zinc-800 flex gap-2">
        <input
          type="text"
          placeholder="Ask a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-rose-500"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold disabled:opacity-50 transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
