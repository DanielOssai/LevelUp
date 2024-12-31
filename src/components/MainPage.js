import React, { useState, useEffect, useRef } from "react";
import "../styles/MainPage.css";
import "../styles/YellowGradient.css";

const MainPage = ({ user, stats, onLogout }) => {
  const [theme] = useState("dark"); // Default theme: dark
  const [messages, setMessages] = useState([]); // Chat messages state
  const [currentMessage, setCurrentMessage] = useState(""); // Current message input
  const messageDisplayRef = useRef(null); // Reference for auto-scroll

  const sendMessage = () => {
    if (currentMessage.trim()) {
      setMessages([...messages, { sender: "user", text: currentMessage }]);
      setCurrentMessage("");

      // Simulating AI response
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "ai", text: "Hello! How can I assist you today?" },
        ]);
      }, 1000);
    }
  };

  useEffect(() => {
    if (messageDisplayRef.current) {
      messageDisplayRef.current.scrollTop = messageDisplayRef.current.scrollHeight;
    }
  }, [messages]);

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={`main-container ${theme}`}>
      {/* Navbar */}
      <nav className="navbar">
        <a href="/">Home</a>
        <a href="/main-quest">Main Quest</a>
        <a href="/side-quest">Side Quest</a>
        <a href="/chat">Chat</a>
        <a href="/store">Store</a>
        <button onClick={onLogout} className="logout-button">Logout</button>
      </nav>

      {/* Main Content */}
      <div className="content">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="character-circle">
            <span className="plus-sign">+</span>
          </div>
          <h1 className={`username ${theme}`}>{user?.username || "Holder"}</h1>
        </div>

        {/* Stats Section */}
        <div className="stats-container">
          {stats.map((stat, index) => (
            <div className={`stat-box ${theme}`} key={index}>
              <p className="stat-title">{stat.title}</p>
              <p className="stat-value">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Chat Section */}
        <div className="chat-section">
          <div className="message-display" ref={messageDisplayRef}>
            {messages.map((msg, index) => (
              <div
                className={`message ${
                  msg.sender === "user" ? "user-message" : "ai-message"
                }`}
                key={index}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chat-input-container">
            <textarea
              className={`chat-input ${theme}`}
              placeholder="What have you done today?"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyDown={handleKeyPress}
            ></textarea>
            <button className="send-button" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>Made with <span className="emoji">💖</span> by Rudolf</p>
      </footer>
    </div>
  );
};

export default MainPage;
