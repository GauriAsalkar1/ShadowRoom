import { useState, useRef, useEffect } from "react";
import "../styles/chatbot.css";

const personaLabels = {
  echo: "🌑 Echo",
  drift: "⚡ Drift",
  nova: "🌌 Nova",
};

const welcomeMessages = {
  echo:
    "Hey. I'm Echo. You can talk here without pretending.",

  drift:
    "Welcome to Drift. Chaos, random thoughts, distractions, and questionable conversations start here.",

  nova:
    "I'm Nova. No pressure. Let's slow things down and reset a little.",
};

export default function ChatbotPage() {
  const [allMessages, setAllMessages] = useState({
  echo: [
    {
      sender: "bot",
      text: "Hey. I'm Echo. You can talk here without pretending.",
    },
  ],

  drift: [
    {
      sender: "bot",
      text: "Welcome to Drift. Chaos, random thoughts, distractions, and questionable conversations start here.",
    },
  ],

  nova: [
    {
      sender: "bot",
      text: "I'm Nova. No pressure. Let's slow things down and reset a little.",
    },
  ],
});


  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [persona, setPersona] = useState("echo");
  const messages = allMessages[persona] || [];

  const messagesEndRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // Send Message
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      text: input,
    };

   setAllMessages((prev) => ({
  ...prev,
  [persona]: [
    ...(prev[persona] || []),
    {
      sender: "user",
      text: input,
    },
  ],
}));
    try {
      const response = await fetch(
        "http://localhost:5000/api/chatbot/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
              message: input,
              sessionId: persona,
            }),
        }
      );

      const data = await response.json();

                setAllMessages((prev) => ({
            ...prev,
            [persona]: [
              ...(prev[persona] || []),
              {
                sender: "bot",
                text: data.reply || "No response received.",
              },
            ],
          }));
    } catch (error) {
                  setAllMessages((prev) => ({
              ...prev,
              [persona]: [
                ...(prev[persona] || []),
                {
                  sender: "bot",
                  text: "Could not connect to AI server.",
                },
              ],
            }));
    }
    setInput("");

    setLoading(false);
  };

  // Persona Switch
  const switchPersona = async (selectedPersona) => {
    try {
      await fetch(
        "http://localhost:5000/api/chatbot/persona",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
          persona: selectedPersona,
          sessionId: selectedPersona,
        }),
        }
      );

      setPersona(selectedPersona);

    } catch (error) {
      console.error("Persona switch failed", error);
    }
  };

  // Reset Chat
  const resetChat = async () => {
    try {
      await fetch(
        "http://localhost:5000/api/chatbot/reset",
        {
          method: "POST",
        }
      );

            setAllMessages((prev) => ({
          ...prev,
          [persona]: [
            {
              sender: "bot",
              text: welcomeMessages[persona],
            },
          ],
        }));
    } catch (error) {
      console.error("Reset failed", error);
    }
  };

  // Enter key send
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Shadow Room AI</h2>
          <p>An anonymous safe space to talk freely</p>
        </div>

        <div className="persona-section">
          <h3>Choose Persona</h3>

          {Object.keys(personaLabels).map((key) => (
            <button
              key={key}
              className={`persona-btn ${
                persona === key ? "active" : ""
              }`}
              onClick={() => switchPersona(key)}
            >
              <span className="persona-icon">
                {key === "echo"
                  ? "🌑"
                  : key === "drift"
                  ? "⚡"
                  : "🌌"}
              </span>

              <span className="persona-info">
                <strong>
                  {personaLabels[key]}
                </strong>

                <small>
                  {key === "echo"
                    ? "Talk freely without judgment"
                    : key === "drift"
                    ? "Chaos, fun & distractions"
                    : "Reset and breathe"}
                </small>
              </span>
            </button>
          ))}
        </div>

        <button
          className="reset-btn"
          onClick={resetChat}
        >
          🗑️ Clear Chat
        </button>
      </aside>

      {/* Main Chat */}
      <main className="chat-area">
        <div className="chat-header">
          <h1>{personaLabels[persona]}</h1>

          <span className="status-badge">
            Online
          </span>
        </div>

        <div className="messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${
                msg.sender === "user"
                  ? "user-message"
                  : "bot-message"
              }`}
            >
              <div className="message-avatar">
                {msg.sender === "user"
                  ? "🧑"
                  : "🤖"}
              </div>

              <div className="message-content">
                <p>{msg.text}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="message bot-message">
              <div className="message-avatar">
                🤖
              </div>

              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef}></div>
        </div>

        {/* Input */}
        <div className="chat-input-area">
          <div className="input-wrapper">
            <textarea
              placeholder="Type what you can't say out loud..."
              rows="1"
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={handleKeyDown}
            />

            <button
              className="send-btn"
              onClick={sendMessage}
              disabled={loading}
            >
              ➤
            </button>
          </div>

          <p className="disclaimer">
            Shadow Room AI may sometimes respond
            imperfectly. If you're struggling
            seriously, please reach out to
            someone you trust.
          </p>
        </div>
      </main>
    </div>
  );
}