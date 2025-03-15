import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { 
      type: 'bot', 
      content: 'Welcome to ShareMyRide support! Please select a category to get started.'
    }
  ]);
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Load categories when component mounts
  useEffect(() => {
    fetchCategories();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchCategories = async () => {
    try {
      setIsTyping(true);
      const response = await axios.post('/chatbot', {});
      setCategories(response.data.categories);
      setIsTyping(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setMessages([...messages, { 
        type: 'bot', 
        content: 'Sorry, I encountered an error. Please try again later.' 
      }]);
      setIsTyping(false);
    }
  };

  const handleCategorySelect = async (category) => {
    setSelectedCategory(category);
    setMessages([...messages, { type: 'user', content: `Category: ${category}` }]);
    
    try {
      setIsTyping(true);
      const response = await axios.post('http://192.168.230.205:2052/api/auth/chatbot', { category });
      setQuestions(response.data.questions);
      
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: `Here are some common questions about ${category}:`,
        isQuestionList: true,
        questions: response.data.questions
      }]);
      setIsTyping(false);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: 'Sorry, I encountered an error. Please try again later.' 
      }]);
      setIsTyping(false);
    }
  };

  const handleQuestionSelect = async (question) => {
    setMessages([...messages, { type: 'user', content: question }]);
    
    try {
      setIsTyping(true);
      const response = await axios.post('/chatbot', { 
        category: selectedCategory, 
        question 
      });
      
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: response.data.answer || response.data.message 
      }]);
      
      if (response.data.message) {
        // Question wasn't found, prompt for custom message
        setMessages(prev => [...prev, { 
          type: 'bot', 
          content: 'Would you like to send a custom message to our team?' 
        }]);
      }
      setIsTyping(false);
    } catch (error) {
      console.error('Error fetching answer:', error);
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: 'Sorry, I encountered an error. Please try again later.' 
      }]);
      setIsTyping(false);
    }
  };

  const handleCustomMessageSubmit = async (e) => {
    e.preventDefault();
    if (!customMessage.trim()) return;
    
    setMessages([...messages, { type: 'user', content: customMessage }]);
    setCustomMessage('');
    
    try {
      setIsTyping(true);
      const response = await axios.post('/chatbot', {
        category: selectedCategory || 'Custom Message',
        customMessage
      });
      
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: response.data.message 
      }]);

      // Reset back to categories after submitting custom message
      setSelectedCategory('');
      fetchCategories();
      setIsTyping(false);
    } catch (error) {
      console.error('Error submitting custom message:', error);
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: 'Sorry, I encountered an error submitting your message. Please try again later.' 
      }]);
      setIsTyping(false);
    }
  };

  const resetChat = () => {
    setMessages([{ 
      type: 'bot', 
      content: 'Welcome to ShareMyRide support! Please select a category to get started.' 
    }]);
    setSelectedCategory('');
    setQuestions([]);
    fetchCategories();
  };

  return (
    <div className="flex flex-col h-full max-w-md mx-auto bg-gray-100 shadow-lg rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-blue-500 text-white px-4 py-3 flex justify-between items-center">
        <h3 className="text-lg font-semibold">ShareMyRide Support</h3>
        <button 
          onClick={resetChat}
          className="text-sm bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded"
        >
          New Chat
        </button>
      </div>
      
      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.map((message, index) => (
          <div key={index} className={`mb-4 ${message.type === 'user' ? 'text-right' : ''}`}>
            <div 
              className={`
                inline-block px-4 py-2 rounded-lg max-w-xs lg:max-w-md
                ${message.type === 'user' 
                  ? 'bg-yellow-400 text-gray-800' 
                  : 'bg-white text-gray-800 shadow'
                }
              `}
            >
              {message.content}
              
              {message.isQuestionList && (
                <ul className="mt-2 space-y-1">
                  {message.questions.map((q, qIndex) => (
                    <li key={qIndex}>
                      <button
                        onClick={() => handleQuestionSelect(q)}
                        className="text-left text-blue-600 hover:text-blue-800 hover:underline w-full"
                      >
                        {q}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="mb-4">
            <div className="inline-block px-4 py-2 rounded-lg bg-white text-gray-800 shadow">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input or Categories */}
      <div className="border-t border-gray-200 p-4 bg-white">
        {!selectedCategory ? (
          <div>
            <p className="text-sm text-gray-500 mb-2">Select a category:</p>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => handleCategorySelect(category)}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-800 py-2 px-3 rounded text-sm transition-colors"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleCustomMessageSubmit} className="flex">
            <input
              type="text"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Type your question here..."
              className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg"
            >
              Send
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChatBot;