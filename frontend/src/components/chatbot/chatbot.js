import React, { useState, useEffect, useRef } from 'react';
import './styles.css';
import botIcon from '../assets/bot.png';
import '../assets/docs.md-iconic-font.min.css';
import orcaIcon from '../assets/orca.png';
import popSound from '../assets/pop-sound.mp3';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';

const ChatComponent = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatFullscreen, setChatFullscreen] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [messages, setMessages] = useState([
    { text: 'Hi there! How can I help you?', isBot: true },
  ]);
  const chatConverseRef = useRef(null);
  const chatFieldRef = useRef(null);

  useEffect(() => {
    chatConverseRef.current.scrollTop = chatConverseRef.current.scrollHeight;
  }, [messages]);

  const toggleChat = () => {
    setChatOpen(!chatOpen);
  };

  const toggleFullscreen = () => {
    setChatFullscreen(!chatFullscreen);
  };

  const handleUserMessage = (e) => {
    setUserMessage(e.target.value);
  };

 

  const sendMessage = async () => {
    if (userMessage.trim() !== '') {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: userMessage, isBot: false },
      ]);
      setUserMessage('');
  
      try {
        const payload = {
          prompt: `${userMessage}------------------>`
        };
  
        const response = await fetch(`http://localhost:1000/api/generateOutput`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          const parsedOutput = parseOutput(data.output);
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: parsedOutput, isBot: true },
          ]);
          const popAudio = new Audio(popSound);
          popAudio.play();
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: data.message, isBot: true },
          ]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: 'An error occurred while fetching the data.', isBot: true },
        ]);
      }
    }
  };
  
  const parseOutput = (output) => {
    // Remove the leading and trailing new lines
    const trimmedOutput = output.trim();
  
    // Extract the text between the double quotes
    const regex = /\\"(.*?)\\"/;
    const match = trimmedOutput.match(regex);
  
    if (match && match[1]) {
      // Replace escaped newline characters with actual line breaks
      let parsedText = match[1].replace(/\\n/g, '\n');
  
      // Replace dashes with line break tags
      parsedText = parsedText.replace(/-/g, '<br/>');
  
      return parsedText;
    } else {
      return trimmedOutput;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="fabs">
      <div
        className={`chat ${chatOpen ? 'is-visible' : ''}`}
        style={{ display: chatOpen ? 'block' : 'none' }}
      >
        <div className="chat_header">
          <div className="chat_option">
            <div className="header_img">
              <img src={orcaIcon} alt="ORCA Icon" />
            </div>
            <span id="chat_head">Book Bot</span>
            <br />
            <span className="agent">Agent</span>
            <span className="online">(Online)</span>
            <span
              id="chat_fullscreen_loader"
              className="chat_fullscreen_loader"
              onClick={toggleFullscreen}
            >
              <i
                className={`fullscreen ${
                  chatFullscreen ? 'zmdi-window-restore' : 'zmdi-window-maximize'
                }`}
              />
            </span>
          </div>
        </div>
        <div
          id="chat_converse"
          className={`chat_conversion chat_converse ${
            chatFullscreen ? 'chat_converse2' : ''
          }`}
          ref={chatConverseRef}
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`chat_msg_item ${
                message.isBot ? 'chat_msg_item_admin' : 'chat_msg_item_user'
              } ${message.isBot ? 'back' : ''}`}
            >
              {message.isBot && (
                <div className="chat_avatar">
                  <img src={botIcon} alt="Bot Icon" />
                </div>
              )}
              {message.text}
            </div>
          ))}
        </div>
        <div className={`fab_field ${chatFullscreen ? 'fab_field2' : ''}`}>
        {/* <a id="fab_camera" className="fab"> */}
          {/* <AttachFileIcon /> */}
        {/* </a> */}
        <a id="fab_send" className="fab" onClick={sendMessage}>
          <SendIcon />
        </a>
          <input
            type="text"
            id="chatSend"
            name="msg-txt"
            placeholder="Send a message"
            className="chat_field chat_message"
            value={userMessage}
            onChange={handleUserMessage}
            onKeyDown={handleKeyDown}
            ref={chatFieldRef}
          />
        </div>
      </div>
      <a id="prime" className="fab" onClick={toggleChat}>
        {chatOpen ? <CloseIcon /> : <ChatBubbleOutlineIcon />}
      </a>
    </div>
  );
};

export default ChatComponent;