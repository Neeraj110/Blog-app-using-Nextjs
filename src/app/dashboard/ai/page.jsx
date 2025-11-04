"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Loader, Copy, Check, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { cn } from "@/lib/utils";
import Link from "next/link";

function AskToAi() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);
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
    setResponse("");
    setError(null);
    setLoading(false);
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
    setHistory([...history, { type: "user", text: query }]);

    try {
      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`,
        {
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: query,
                },
              ],
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
        }
      );

      const answer =
        res.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response received.";
      setResponse(answer);
      setHistory((prev) => [...prev, { type: "ai", text: answer }]);
    } catch (err) {
      console.error("API Error:", err.response?.data || err);
      setError(
        err.response?.data?.error?.message ||
          "Something went wrong. Please try again."
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
          <div key={idx} className="relative mt-2 mb-4">
            <div className="bg-black/50 backdrop-blur-sm rounded-lg border border-gray-700/50">
              <div className="flex justify-between items-center px-4 py-2 border-b border-gray-700/50">
                <div className="text-gray-400 text-xs font-medium">Code</div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(code, idx)}
                  className="text-gray-400 hover:text-white"
                >
                  {copiedIndex === idx ? (
                    <Check size={16} className="text-green-500" />
                  ) : (
                    <Copy size={16} />
                  )}
                </Button>
              </div>
              <pre className="p-4 overflow-x-auto font-mono text-sm text-gray-300">
                {code}
              </pre>
            </div>
          </div>
        );
      }
      return (
        <p key={idx} className="whitespace-pre-wrap text-gray-100">
          {part}
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col bg-gradient-to-b from-gray-900 to-black text-white h-dvh">
      {/* Header - fixed height */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-black/70 border-b border-gray-800 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Ask AI
          </h1>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <Button
            onClick={handleNewChat}
            variant="ghost"
            className="text-gray-400 hover:text-white"
            disabled={history.length === 0}
          >
            New Chat
          </Button>
          <Link href="/dashboard" passHref>
            <Button
              variant="ghost"
              className="text-gray-400 md:hidden block hover:text-white"
            >
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex justify-center overflow-hidden">
        <div className="w-full max-w-4xl flex flex-col">
          {/* Chat Section */}
          <main
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-2 space-y-6 pb-24 md:pb-6"
          >
            {history.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-4 md:p-8 md:mt-0 mt-[5rem] mb-8">
                <div className="max-w-3xl w-full space-y-6 md:space-y-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                    Ask Anything to AI
                  </h2>

                  <p className="text-base md:text-lg text-gray-400 text-center max-w-md mx-auto">
                    Get instant answers to your questions. Start by typing your
                    message below.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 w-full mt-4 md:mt-8">
                    <div className="bg-gray-800/30 backdrop-blur-sm p-4 md:p-5 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-colors">
                      <p className="text-sm md:text-base text-gray-300 flex items-center gap-2">
                        <span className="text-xl">💡</span>
                        <span>Try asking about:</span>
                      </p>
                      <p className="text-xs md:text-sm text-gray-400 mt-2">
                        Code explanations & debugging
                      </p>
                    </div>

                    <div className="bg-gray-800/30 backdrop-blur-sm p-4 md:p-5 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-colors">
                      <p className="text-sm md:text-base text-gray-300 flex items-center gap-2">
                        <span className="text-xl">✍️</span>
                        <span>Try asking about:</span>
                      </p>
                      <p className="text-xs md:text-sm text-gray-400 mt-2">
                        Writing & content creation
                      </p>
                    </div>

                    <div className="bg-gray-800/30 backdrop-blur-sm p-4 md:p-5 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-colors">
                      <p className="text-sm md:text-base text-gray-300 flex items-center gap-2">
                        <span className="text-xl">🔍</span>
                        <span>Try asking about:</span>
                      </p>
                      <p className="text-xs md:text-sm text-gray-400 mt-2">
                        Research & general knowledge
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {history.map((item, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex gap-4",
                      item.type === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    {item.type === "ai" && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                        <span className="text-xs font-medium">AI</span>
                      </div>
                    )}
                    <div
                      className={cn(
                        "flex-1 rounded-2xl p-4 max-w-[85%] md:max-w-[75%]",
                        item.type === "user"
                          ? "bg-blue-600 ml-12 bg-opacity-90"
                          : "bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 mr-12"
                      )}
                    >
                      {formatMessage(item.text)}
                    </div>
                    {item.type === "user" && (
                      <div className="w-8 h-8 rounded-full bg-gray-700/70 backdrop-blur-sm flex items-center justify-center shrink-0">
                        <span className="text-xs font-medium">You</span>
                      </div>
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                      <span className="text-xs font-medium">AI</span>
                    </div>
                    <div className="flex-1 rounded-2xl p-4 max-w-[85%] md:max-w-[75%] bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 mr-12">
                      <div className="flex items-center gap-2">
                        <Loader size={16} className="animate-spin" />
                        <span className="text-gray-300">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mx-auto max-w-[85%] md:max-w-[75%]">
                    <div className="text-red-400 text-center p-4 bg-red-500/10 border border-red-500/20 rounded-lg backdrop-blur-sm">
                      {error}
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} className="h-0" />
              </>
            )}
          </main>

          {/* Input Section - Fixed to bottom with better mobile experience */}
          <div className="fixed bottom-0 left-0 right-0 border-t border-gray-800 bg-black/70 backdrop-blur-lg p-3 z-50">
            <form
              onSubmit={handleQuerySubmit}
              className="flex items-center gap-3 max-w-3xl mx-auto w-full px-2"
            >
              <input
                type="text"
                placeholder="Message AI..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-gray-800/50 text-white p-2 rounded-2xl outline-none border border-gray-700/50 focus:border-gray-600/50 transition-colors placeholder-gray-400"
              />
              <Button
                type="submit"
                disabled={loading}
                className={cn(
                  "rounded-full w-10 h-10 flex items-center justify-center",
                  loading
                    ? "bg-gray-700/70"
                    : "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:opacity-90"
                )}
              >
                {loading ? (
                  <Loader size={20} className="animate-spin" />
                ) : (
                  <Send size={20} />
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AskToAi;
