import { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const chatEndRef = useRef(null);

  // Auto scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  // ================= SEND MESSAGE =================
  const handleSend = async () => {
    if (!message.trim() || loading) {
      return;
    }

    const userMessage = message.trim();

    try {
      setLoading(true);
      setError("");

      // Add user message to chat
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          text: userMessage,
        },
      ]);

      // Clear input
      setMessage("");

      // Send request to backend
      const response = await axios.post("/api/ask-ai", {
        prompt: userMessage,
        history: messages,
      });

      // Add AI response
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: response.data.answer,
        },
      ]);
    } catch (error) {
      console.log("ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= NEW CHAT =================
  const handleNewChat = () => {
    setMessages([]);
    setMessage("");
    setError("");
  };

  // ================= COPY =================
  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.log("Copy failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-0 sm:p-4">
      {/* Main Chat Container */}
      <div
        className="
          w-full 
          max-w-4xl 
          h-[100vh] 
          sm:h-[90vh]
          bg-slate-900 
          sm:rounded-3xl 
          shadow-2xl 
          border-0
          sm:border 
          border-slate-800 
          flex 
          flex-col 
          overflow-hidden
        "
      >
        {/* ================= HEADER ================= */}
        <div className="px-3 sm:px-6 py-3 sm:py-5 border-b border-slate-800 flex items-center justify-between gap-3">
          {/* Logo + Name */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 shrink-0 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-lg sm:text-xl">
              🤖
            </div>

            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-semibold truncate">
                AI Chatboard
              </h1>

              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Online
              </div>
            </div>
          </div>

          {/* AI Model + New Chat */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <span className="hidden sm:block text-sm text-slate-400">
              Gemini AI
            </span>

            <button
              onClick={handleNewChat}
              className="
                px-2.5 sm:px-3
                py-2
                text-xs sm:text-sm
                rounded-lg
                bg-slate-800
                hover:bg-slate-700
                transition
                whitespace-nowrap
              "
            >
              <span className="hidden sm:inline">+ New Chat</span>
              <span className="sm:hidden">+ New</span>
            </button>
          </div>
        </div>

        {/* ================= CHAT AREA ================= */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6">
          {/* Welcome Screen */}
          {messages.length === 0 && !loading && !error && (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <div
                className="
                  w-16 h-16 
                  sm:w-20 sm:h-20
                  rounded-2xl sm:rounded-3xl
                  bg-gradient-to-br from-violet-500 to-blue-500
                  flex items-center justify-center
                  text-3xl sm:text-4xl
                  mb-4 sm:mb-5
                  shadow-lg
                "
              >
                🤖
              </div>

              <h2 className="text-xl sm:text-2xl font-semibold mb-2">
                Hello! 👋
              </h2>

              <p className="text-sm sm:text-base text-slate-400 max-w-md leading-relaxed">
                I'm your AI assistant. Ask me anything and I'll try my best to
                help you.
              </p>
            </div>
          )}

          {/* ================= CHAT MESSAGES ================= */}
          {messages.map((msg, index) => (
            <div key={index}>
              {/* USER MESSAGE */}
              {msg.role === "user" && (
                <div className="flex justify-end mb-4 sm:mb-5">
                  <div className="max-w-[88%] sm:max-w-[75%]">
                    <div className="text-[10px] sm:text-xs text-slate-500 mb-1 text-right">
                      You
                    </div>

                    <div
                      className="
                        bg-violet-600
                        px-3 sm:px-5
                        py-2.5 sm:py-3
                        rounded-2xl
                        rounded-br-md
                        shadow
                        text-sm sm:text-base
                        break-words
                      "
                    >
                      {msg.text}
                    </div>
                  </div>
                </div>
              )}

              {/* AI MESSAGE */}
              {msg.role === "ai" && (
                <div className="flex gap-2 sm:gap-3 items-start mb-4 sm:mb-5">
                  {/* AI Avatar */}
                  <div
                    className="
                      w-8 h-8
                      sm:w-9 sm:h-9
                      rounded-full
                      bg-gradient-to-br from-violet-500 to-blue-500
                      flex items-center justify-center
                      shrink-0
                      text-sm sm:text-base
                    "
                  >
                    🤖
                  </div>

                  <div className="max-w-[88%] sm:max-w-[75%] min-w-0">
                    <div className="text-[10px] sm:text-xs text-slate-500 mb-1">
                      AI Assistant
                    </div>

                    <div
                      className="
                        bg-slate-800
                        px-3 sm:px-5
                        py-3 sm:py-4
                        rounded-2xl
                        rounded-bl-md
                        text-slate-200
                        shadow
                        text-sm sm:text-base
                        overflow-hidden
                      "
                    >
                      <div className="prose prose-invert max-w-none break-words">
                        <ReactMarkdown
                          components={{
                            code({
                              inline,
                              className,
                              children,
                              ...props
                            }) {
                              const match =
                                /language-(\w+)/.exec(className || "");

                              const code = String(children).replace(/\n$/, "");

                              // Code block
                              if (!inline && match) {
                                return (
                                  <div className="mt-3 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 max-w-full">
                                    <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-slate-900 border-b border-slate-700 gap-3">
                                      <span className="text-[10px] sm:text-xs text-slate-400">
                                        {match[1]}
                                      </span>

                                      <button
                                        onClick={() => handleCopy(code)}
                                        className="text-[10px] sm:text-xs text-slate-400 hover:text-white transition whitespace-nowrap"
                                      >
                                        📋 Copy
                                      </button>
                                    </div>

                                    <pre className="p-3 sm:p-4 overflow-x-auto text-xs sm:text-sm text-slate-200">
                                      <code {...props}>{children}</code>
                                    </pre>
                                  </div>
                                );
                              }

                              // Inline code
                              return (
                                <code
                                  className="bg-slate-900 px-1.5 py-0.5 rounded text-violet-300 break-words"
                                  {...props}
                                >
                                  {children}
                                </code>
                              );
                            },
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      </div>

                      {/* Copy AI Response */}
                      <button
                        onClick={() => handleCopy(msg.text)}
                        className="block mt-3 text-[10px] sm:text-xs text-slate-400 hover:text-white transition"
                      >
                        📋 Copy
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* ================= LOADING ================= */}
          {loading && (
            <div className="flex gap-2 sm:gap-3 items-start mb-5">
              <div
                className="
                  w-8 h-8
                  sm:w-9 sm:h-9
                  rounded-full
                  bg-gradient-to-br from-violet-500 to-blue-500
                  flex items-center justify-center
                  shrink-0
                  text-sm
                "
              >
                🤖
              </div>

              <div className="bg-slate-800 px-4 sm:px-5 py-3 rounded-2xl rounded-bl-md">
                <div className="flex gap-1">
                  <span className="animate-bounce">•</span>

                  <span className="animate-bounce [animation-delay:150ms]">
                    •
                  </span>

                  <span className="animate-bounce [animation-delay:300ms]">
                    •
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ================= ERROR ================= */}
          {error && (
            <div
              className="
                mt-4
                bg-red-500/10
                border border-red-500/20
                text-red-400
                px-3 sm:px-4
                py-3
                rounded-xl
                text-xs sm:text-sm
                break-words
              "
            >
              ❌ {error}
            </div>
          )}

          <div ref={chatEndRef}></div>
        </div>

        {/* ================= INPUT AREA ================= */}
        <div className="p-2.5 sm:p-4 border-t border-slate-800">
          <div className="flex gap-2 sm:gap-3 bg-slate-800 rounded-xl sm:rounded-2xl p-1.5 sm:p-2">
            <input
              type="text"
              placeholder="Ask anything..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
              className="
                flex-1
                min-w-0
                bg-transparent
                px-3 sm:px-4
                py-2.5 sm:py-3
                outline-none
                text-sm sm:text-base
                placeholder:text-slate-500
              "
            />

            <button
              onClick={handleSend}
              disabled={loading}
              className="
                w-11 sm:w-auto
                px-3 sm:px-5
                py-2
                rounded-lg sm:rounded-xl
                bg-violet-600
                hover:bg-violet-500
                disabled:opacity-50
                disabled:cursor-not-allowed
                transition
                shrink-0
              "
            >
              {loading ? "..." : "➤"}
            </button>
          </div>

          <p className="text-center text-[9px] sm:text-xs text-slate-600 mt-2">
            AI can make mistakes. Check important information.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;