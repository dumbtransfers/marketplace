"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { Send } from 'lucide-react';
import { LoadingIcon } from '@/components/LoadingIcon';
import Image from 'next/image';
import { FaTimes, FaBars, FaPaperclip, FaSmile } from 'react-icons/fa';

const DumbTransfersAIMainPage = () => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<any>([]);
  const [balance, setBalance] = useState<number | null>(null);
  const [entries, setEntries] = useState<any>([]);
//   const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [amountUsdc, setAmountUsdc] = useState(0)
  const [contactName, setContactName] = useState('')
  const [isButtonDisabled ,setIsButtonDisabled] = useState(false)
  const [mpcWallet, setMpcWallet] = useState('')
  const [contacts, setContacts] = useState<any>('')

  const handleAiAssistant = async (value: string) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: value}),
      });
  
      if (!response.ok) {
        throw new Error('Failed to get a response from the AI assistant.');
      }
  
      console.log(response, "check teh response dude")
      const responseStream = await response.json();
      return responseStream;
    } catch (error) {
      console.error('Error handling AI assistant:', error);
      return null;
    }
  };

  




  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    // setMessages((prev: any) => [...prev, { text: inputValue, isUser: true }]);
    setMessages((prev: any) => [...prev, { text: inputValue, isUser: true }]);

    try {
        // Await the AI assistant's response
        setIsLoading(true)
        const aiResponse = await handleAiAssistant(inputValue);
          if (aiResponse) {
              setMessages((prev: any) => [...prev, { text: aiResponse, isUser: false , hasButton: aiResponse.hasButton || false, buttonText: aiResponse.buttonText || "",}]);
            }
            setIsLoading(false)

    } catch (error) {
        console.error("Error fetching AI response:", error);
    }

    setInputValue('');
  };



  const handleUserResponse = async (response:string) => {
    let aiResponse:string;
    if (!isButtonDisabled) {
      setIsButtonDisabled(true); // Disable the button to prevent double-click
      // Your click handling logic here
  
      // Optionally, re-enable the button after some async action (e.g., after submitting data)
      setTimeout(() => setIsButtonDisabled(false), 3000); // Example timeout for re-enabling
    }
    setIsLoading(true)
    if (response === 'yes') {
      // Logic for saving the contact
      aiResponse = await handleAiAssistant('yes')
      console.log("User wants to save the contact.");
    } else if (response === 'no') {
      aiResponse = await handleAiAssistant('no')
    }
    else{
      aiResponse = await handleAiAssistant(response)
    }
    setIsLoading(false)
    setMessages((prev: any) => [...prev, { text: aiResponse, isUser: false}]);
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-white text-black">
      <aside
        className={`bg-gray-100 border-r border-gray-300 p-4 transform transition-transform duration-300 ease-in-out 
          w-64 fixed inset-y-0 left-0 z-40 md:relative md:translate-x-0 
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
          md:w-1/4`}
      >
        <div className="flex justify-between items-center mb-4">
        <button
        className="md:hidden fixed top-4 left-4 z-30 bg-[#004aad] hover:bg-[#004aad] text-white p-3 rounded-lg focus:outline-none"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>
        </div>
        <h2 className="text-lg font-bold">Contacts</h2>
        <ul className="space-y-4">
        </ul>
      </aside>


      {/* Main Chat Area */}
      <div className={`flex-grow flex flex-col ${isSidebarOpen && 'md:ml-0'} transition-all`}>
  <header className="sticky top-0 z-50 p-4 bg-white border-b border-gray-300 flex justify-between items-center">
    <button
      className="md:hidden top-4 left-4 z-30 bg-white text-white p-3 rounded-lg focus:outline-none"
      onClick={toggleSidebar}
    >
      {isSidebarOpen ? <FaTimes size={24} /> : <FaBars color='blue' size={24} />}
    </button>
    <h1 className={`text-2xl font-bold bg-clip-text text-transparent bg-[#004aad]`}>
      DumbTransfers
    </h1>
    <div className="bg-white text-black">
    </div>
  </header>

<main className="flex-grow overflow-y-auto p-4 pb-20">
  <div className="space-y-4">
    {messages.map((message: any, index: any) => (
      <div
        key={index}
        className={`flex items-start max-w-[80%] ${
          message.isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
        }`}
      >
        {/* Image */}
        <div className="flex-shrink-0">
          <Image
            width={50}
            height={50}
            src={message.isUser ? '/lautaro.jpg' : '/chat-bot.webp'}
            alt={message.isUser ? 'User' : 'AI'}
            className="rounded-full"
          />
        </div>

        {/* Message Bubble */}
        <div
          className={`relative p-3 max-w-[70%] break-words ${
            message.isUser
              ? 'mr-2 bg-gray-200 bg-opacity-50 backdrop-blur-sm rounded-tl-lg rounded-br-lg rounded-bl-lg'
              : 'ml-2 bg-[#004aad] bg-opacity-50 backdrop-blur-sm rounded-tr-lg rounded-bl-lg rounded-br-lg'
          }`}
          style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }} // Ensure text breaks properly
        >
          <div dangerouslySetInnerHTML={{ __html: message.text.text ? message.text.text : message.text }}></div>

          {message.text.hasInput && (
            <input 
              type="text"
              placeholder={message.text.translatedName || 'Name'}
              onChange={(e) => setContactName(e.target.value)}
              className="mt-2 px-3 py-2 border border-gray-300 rounded w-full"
            />
          )}

          {message.text.hasButtonName && (
            <button 
              disabled={isButtonDisabled}
              onClick={() => handleUserResponse(contactName)}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded w-full"
            >
              {message.text.translatedSend || 'Send'}
            </button>
          )}

          {message.text.hasButton && (
            <div className="flex space-x-2 mt-2">
              <button 
                disabled={isButtonDisabled}
                onClick={() => handleUserResponse('yes')}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                {message.text.buttonTextYes || 'Yes'}
              </button>

              <button 
                disabled={isButtonDisabled}
                onClick={() => handleUserResponse('no')}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                {message.text.buttonTextNo || 'No'}
              </button>
            </div>
          )}
        </div>
      </div>
    ))}

    {isLoading && <LoadingIcon />}
  </div>
</main>
        <footer className="p-4 border-t border-gray-300 bg-white sticky bottom-0">
  <form onSubmit={handleSubmit} className="flex gap-2 items-center">
    <button className="p-2 text-gray-500 hover:text-gray-700">
      <FaPaperclip size={18} />
    </button>
    <button className="p-2 text-gray-500 hover:text-gray-700">
      <FaSmile size={18} />
    </button>
    <input
      type="text"
      placeholder="Transfer..."
      value={inputValue}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        setInputValue(e.target.value)
      }
      className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
    />
    <button
      type="submit"
      className="bg-[#004aad] px-4 py-2 rounded-lg text-white"
    >
      <Send size={18} />
    </button>
  </form>
</footer>

      </div>
    </div>
  );
};

export default DumbTransfersAIMainPage;
