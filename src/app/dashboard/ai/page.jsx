"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Loader, Copy, Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { cn } from "@/lib/utils";

function AskToAi() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [activeThread, setActiveThread] = useState("t1");

  const chatContainerRef = useRef(null);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, loading]);

  const handleNewChat = () => {
    setHistory([]);
    setQuery("");
    setError(null);
  };

  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setError(null);
    setLoading(true);
    setHistory((prev) => [...prev, { type: "user", text: query }]);

    try {
      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`,
        {
          contents: [
            {
              role: "user",
              parts: [{ text: query }],
            },
          ],
          generationConfig: {
            temperature: 0.9,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const answer =
        res.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response received.";
      setHistory((prev) => [...prev, { type: "ai", text: answer }]);
    } catch (err) {
      console.error("API Error:", err.response?.data || err);
      setError(
        err.response?.data?.error?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
      setQuery("");
    }
  };

  const formatMessage = (text) => {
    const parts = text.split(/(```[\s\S]*?```)/g);
    return parts.map((part, idx) => {
      if (part.startsWith("```")) {
        const code = part.slice(3, -3);
        return (
          <div key={idx} className="relative mt-3 mb-4">
            <div className="rounded-2xl bg-surface-container-low border border-outline-variant/25 overflow-hidden">
              <div className="flex justify-between items-center px-4 py-2 border-b border-outline-variant/20">
                <div className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider">
                  Code
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(code, idx)}
                  className="text-on-surface-variant hover:text-on-surface"
                >
                  {copiedIndex === idx ? (
                    <Check size={16} className="text-green-500" />
                  ) : (
                    <Copy size={16} />
                  )}
                </Button>
              </div>
              <pre className="p-4 overflow-x-auto font-mono text-sm text-on-surface-variant">
                {code}
              </pre>
            </div>
          </div>
        );
      }
      return (
        <p
          key={idx}
          className="whitespace-pre-wrap text-on-surface leading-relaxed"
        >
          {part}
        </p>
      );
    });
  };

  return (
    <div className="h-[calc(100vh-1rem)] md:h-screen bg-surface text-on-surface flex flex-col md:flex-row">
      {/* <section className="hidden md:flex w-[19rem] bg-surface-container-low flex-col border-r border-outline-variant/15">
        <div className="p-5 pb-2 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-on-surface-variant">
            Recent Threads
          </h2>
          <button
            onClick={handleNewChat}
            className="w-8 h-8 rounded-full gradient-primary text-white flex items-center justify-center"
            aria-label="Start new thread"
          >
            <Plus size={16} />
          </button>
        </div>
      </section> */}

      <section className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(53,37,205,0.08),transparent_52%)]" />

        <header className="glass-surface sticky top-0 z-20 h-16 px-4 md:px-8 flex items-center justify-between border-b border-outline-variant/10">
          <div>
            <h1 className="font-bold tracking-tight">AI Assistant</h1>
            <p className="text-[11px] uppercase tracking-widest text-on-surface-variant">
              Active Now
            </p>
          </div>
          <Button
            onClick={handleNewChat}
            variant="ghost"
            className="text-on-surface-variant hover:text-on-surface"
            disabled={history.length === 0}
          >
            New Chat
          </Button>
        </header>

        <main
          ref={chatContainerRef}
          className="relative z-10 h-[calc(100%-9.5rem)] overflow-y-auto px-4 md:px-10 py-6 space-y-6"
        >
          {history.length === 0 ? (
            <div className="max-w-3xl mx-auto pt-8 md:pt-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                Ask anything to AI
              </h2>
              <p className="text-on-surface-variant max-w-xl mx-auto">
                Bring code, UX, architecture, or writing prompts. The response
                panel follows your editorial design language.
              </p>
            </div>
          ) : (
            <>
              {history.map((item, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-start gap-3",
                    item.type === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  {item.type === "ai" && (
                    <div className="w-8 h-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center text-xs font-bold">
                      AI
                    </div>
                  )}

                  <div
                    className={cn(
                      "max-w-[88%] md:max-w-[70%] rounded-3xl p-5",
                      item.type === "user"
                        ? "gradient-primary text-primary-foreground rounded-tr-md"
                        : "bg-surface-container-lowest border border-outline-variant/20 rounded-tl-md",
                    )}
                  >
                    {formatMessage(item.text)}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center text-xs font-bold">
                    AI
                  </div>
                  <div className="rounded-3xl rounded-tl-md p-5 bg-surface-container-lowest border border-outline-variant/20">
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <Loader size={16} className="animate-spin" />
                      <span>Thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="mx-auto max-w-2xl text-red-500 text-center p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                  {error}
                </div>
              )}
              <div ref={chatEndRef} />
            </>
          )}
        </main>

        <div className="absolute bottom-0 left-0 right-0 z-20 px-4 md:px-10 pb-4 pt-3 bg-gradient-to-t from-surface via-surface/90 to-transparent">
          <form onSubmit={handleQuerySubmit} className="max-w-4xl mx-auto">
            <div className="rounded-2xl bg-surface-container-low border border-outline-variant/20 px-3 py-2 flex items-center gap-3">
              <input
                type="text"
                placeholder="Message AI Assistant..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-on-surface placeholder:text-on-surface-variant outline-none px-2"
              />
              <Button
                type="submit"
                disabled={loading}
                className="gradient-primary text-primary-foreground rounded-xl"
              >
                {loading ? (
                  <Loader size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

export default AskToAi;
