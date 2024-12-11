import React, { useState } from "react";
import axios from "axios";
import "./chatbot.css";

const CHAAT = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!query.trim()) return;

    const newMessages = [...messages, { type: "user", text: query }];
    setMessages(newMessages);
    setQuery("");
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/kural/chat", { query }, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const botMessage = { type: "bot", text: response.data.response };
      setMessages([...newMessages, botMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
      const errorMessage = { type: "bot", text: "An error occurred. Please try again later." };
      setMessages([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1>Thirukural Chatbot</h1>
      </header>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.type === "user" ? "user-message" : "bot-message"}`}
          >
            {message.text}
          </div>
        ))}
        {isLoading && <div className="message bot-message">Thirukural Bot is thinking...</div>}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Ask your question about Thirukural..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
        />
        <button onClick={handleSendMessage} disabled={isLoading}>
          Send
        </button>
      </div>
    </div>
  );
};

export default CHAAT;
