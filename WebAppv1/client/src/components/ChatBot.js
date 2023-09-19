import React, { useState } from 'react';
import myImage from '../assets/cupcakebot.jpg';
import Modal from 'react-bootstrap/Modal';

const ChatBot = () => {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [botstate, setBotstate] = useState("")
  const [showPopup, setShowPopup] = useState(false);
  const [tableData, setTableData] = useState(null);

  const closePopup = () => {
    setShowPopup(false);
  };

  const botHandler = async (input) =>{
    try {
      // Send a POST request to the API
      const url = 'http://localhost:5000/api/cupcakebot' + botstate
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_input: input }),
      });
  
      // Parse the JSON response
      const data = await response.json();
  
      // Add the bot's response to the messages array
      if(botstate != "/query"){
        setMessages([...messages, { type: 'user', text: input }, { type: 'bot', text: data.response }]);
      }else{
        // display table pop-up
        setShowPopup(true);
        setTableData(data.response);
        console.log(data.response)
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handleUserInput = async (input) => {
    // Add the user's input to the messages array
    setMessages([...messages, { type: 'user', text: input }]);

    // Check to do bot state activation
    switch (input) {
      case "activate query-bot":
        setBotstate("/query");
        setMessages([...messages, { type: 'user', text: input }, { type: 'bot', text: "Set to query-mode"}]);
        break;
      
      case "activate analytics-bot":
        setBotstate("/analytics")
        setMessages([...messages, { type: 'user', text: input }, { type: 'bot', text: "Set to analytics-mode. Use the following format=>Query:... Prompt:..."}]);
        break;
      
      case "activate regular-bot":
        setBotstate("")
        setMessages([...messages, { type: 'user', text: input }, { type: 'bot', text: "Set to regular-mode"}]);
        break;
      default:
        await botHandler(input)
    }
  };

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  return (
    <div>
      <div style={{
        position: 'fixed',
        right: '0px',
        zIndex: 20,
        backgroundColor: '#00A36C',
        bottom: '0px',
        height: '80px',
        width: '80px',
        margin: '10px',
        borderRadius: '50px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      >
        <button
          onClick={toggleChat}
          style={{
            border: 'none',
            background: 'none',
            padding: 0,
            margin: 0,
            outline: 'none',
          }}
        >
          <img
            src={myImage}
            alt="My Image"
            style={{
              width: '85%',
              height: '82%',
              borderRadius: '50px',
            }}
          />
        </button>
      </div>
      {showChat && (
        <div
          style={{
            position: 'fixed',
            right: '0px',
            bottom: '0px',
            height: '500px',
            width: '400px',
            margin: '10px',
            backgroundColor: '#f1f1f1',
            borderRadius: '8px',
            boxShadow: '0.15rem 0.2rem 0.15rem 0.1rem rgba(0, 0, 0, 0.2)',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ 
            flex: 1, 
            overflowY: 'auto', // Enables vertical scrolling
            padding: '10px' // Adds some space around your messages
          }}>
            {messages.map((msg, index) => (
              <div 
              key={index} 
              style={{ 
                textAlign: msg.type === 'user' ? 'right' : 'left',
                display: 'flex',
                justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                margin: '5px'
              }}
            >
              <div
                style={{
                  backgroundColor: msg.type === 'user' ? '#00A36C' : 'white',
                  color: msg.type === 'user' ? 'white' : 'black',
                  padding: '10px',
                  borderRadius: '8px',
                  display: 'inline-block'
                }}
              >
                {msg.text}
              </div>
            </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid #ccc', width:"80%"}}>
            <form
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
              onSubmit={(e) => {
                e.preventDefault();
                const input = e.target.userInput.value;
                handleUserInput(input);
                e.target.userInput.value = '';
              }}
            >
              <input
                type="text"
                name="userInput"
                placeholder="Type your message"
                style={{ flex: 1, margin: '10px 2px' }}
              />
              <button type="submit" style={{ height: '40px', margin: '10px' }}>
                Send
              </button>
            </form>
          </div>
        </div>
      )}
      {showPopup && (
    <Modal show={showPopup} onHide={closePopup} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Data Table</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ overflowY: 'auto', maxHeight: '400px' }}>
          <table className="table table-striped">
            <thead>
              <tr>
                {/* Replace with actual column names from your data */}
                <th>ID Invoice</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Paid Date</th>
                <th>Name</th>
                <th>Total</th>
                <th>Description</th>
                <th>Amount Due</th>
                
              </tr>
            </thead>
            <tbody>
              {/* Loop through your data to generate table rows.
                  Replace this logic to match your actual data structure. */}
              {tableData && JSON.parse(tableData).id_invoice && Object.keys(JSON.parse(tableData).id_invoice).map((key) => (
                <tr key={key}>
                  <td>{JSON.parse(tableData).id_invoice[key]}</td>
                  <td>{JSON.parse(tableData).issue_date[key]}</td>
                  <td>{JSON.parse(tableData).due_date[key]}</td>
                  <td>{JSON.parse(tableData).paid_date[key]}</td>
                  <td>{JSON.parse(tableData).name[key]}</td>
                  <td>{JSON.parse(tableData).total[key]}</td>
                  <td>{JSON.parse(tableData).description[key]}</td>
                  <td>{JSON.parse(tableData).description[key]}</td>
                  <td>{JSON.parse(tableData).amount_due[key]}</td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal.Body>
    </Modal>
  )}
    </div>
  );
};

export default ChatBot;
