"use client"
import { useState } from 'react';
import { Bell, MoreVertical, ChevronRight } from 'lucide-react';
import Image from "next/image";
import Link from 'next/link';

const agents = [
  {
    id: 1,
    name: "Sofia",
    description: "Help with General transactions",
    price: 12,
    avatar: "/chat-bot.webp",
    link: 'https://dumbtransfers.com/chat'
  },
  {
    id: 2,
    name: "Alex",
    description: "Interopolabilty",
    price: 15,
    avatar: "https://images.ctfassets.net/gcj8jwzm6086/5VHupNKwnDYJvqMENeV7iJ/fdd6326b7a82c8388e4ee9d4be7062d4/avalanche-avax-logo.svg",
    link: '/chat'
  },
];

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [balance, setBalance] = useState(256);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="max-w-md mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
        <Image
className="rounded-full"
          src="/lautaro.jpg"
          alt=" Logo"
          width={20}
          height={20}
          priority
        />
          {/* <img src="./public/lautaro.jpg" alt="Profile" className="rounded-full" /> */}
          <div className="flex gap-2">
            <button className="p-2 rounded-full bg-blue-600 text-white">
              <Bell size={20} />
            </button>
            <button className="p-2 rounded-full bg-blue-600 text-white">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>

        {/* Balance */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold">${balance}</h1>
          <p className="text-sm text-blue-600 uppercase">Balance Total</p>
          <button className="w-full bg-blue-600 text-white rounded-lg py-3 mt-4">
            Top up
          </button>
        </div>

        {/* Agents List */}
        <div>
          <h2 className="text-xl mb-4">Asistentes</h2>
          <div className="space-y-4">
            {agents.map(agent => (
        
              <div 
                key={agent.id}
                className="bg-blue-600 text-white p-4 rounded-xl flex items-center justify-between cursor-pointer hover:bg-blue-700 transition-colors"
              >
                  <Link href={agent.link}>
                          
                <div className="flex items-center gap-4">
                  <Image src={agent.avatar} alt={agent.name} className="rounded-full"           width={40}
          height={40}/>
                  <div>
                    <h3 className="font-medium">{agent.name}</h3>
                    <p className="text-sm opacity-90">{agent.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span>${agent.price}</span>
                  <ChevronRight size={20} />
                </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Theme Toggle */}
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="fixed bottom-4 right-4 p-2 rounded-full bg-blue-600 text-white"
        >
          {darkMode ? '🌞' : '🌙'}
        </button>
      </div>
    </div>
  );
}