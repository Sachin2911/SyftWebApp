import React, { useState } from 'react';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);

  const handleUserInput = (input) => {
    setMessages([...messages, { type: 'user', text: input }, { type: 'bot', text: 'Hello, how can I assist you?' }]);
  };

  return (
    <div style={{ position: 'fixed', bottom: '0', left: '0', width: '300px', height: '400px', border: '1px solid black', backgroundColor: 'white' }}>
      <div>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.type === 'user' ? 'right' : 'left' }}>
            {msg.text}
          </div>
        ))}
      </div>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const input = e.target.userInput.value;
            handleUserInput(input);
            e.target.userInput.value = '';
          }}
        >
          <input type="text" name="userInput" />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default ChatBot;
