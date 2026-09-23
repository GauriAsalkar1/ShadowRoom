import React, { useState, useEffect } from 'react';
import { Loader2, X, Bot, Clock } from 'lucide-react';

const moods = [
  { id: 'angry', emoji: '😠', label: 'Angry', color: 'from-red-600 to-orange-600' },
  { id: 'sad', emoji: '😢', label: 'Sad', color: 'from-blue-600 to-indigo-600' },
  { id: 'confused', emoji: '😕', label: 'Confused', color: 'from-yellow-600 to-amber-600' },
  { id: 'happy', emoji: '😊', label: 'Happy', color: 'from-green-600 to-emerald-600' },
  { id: 'anxious', emoji: '😰', label: 'Anxious', color: 'from-purple-600 to-pink-600' },
  { id: 'lonely', emoji: '🫂', label: 'Lonely', color: 'from-cyan-600 to-blue-600' },
  { id: 'depressed', emoji: '💔', label: 'Depressed', color: 'from-gray-600 to-slate-600' }
];

export const MatchmakingModal = ({ isOpen, onClose, onMatch }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [isMatching, setIsMatching] = useState(false);
  const [waitingTime, setWaitingTime] = useState(0);
  const [offerAI, setOfferAI] = useState(false);
  const { socket } = useSocket();
  
  useEffect(() => {
    if (!socket) return;
    
    socket.on('chat:waiting', ({ message, position }) => {
      // Update waiting UI
    });
    
    socket.on('chat:matched', ({ sessionId, partnerName, expiresAt, yourName }) => {
      setIsMatching(false);
      onMatch({ sessionId, partnerName, expiresAt, yourName });
    });
    
    socket.on('chat:ai_fallback', ({ message, offerAI }) => {
      setOfferAI(true);
    });
    
    return () => {
      socket.off('chat:waiting');
      socket.off('chat:matched');
      socket.off('chat:ai_fallback');
    };
  }, [socket]);
  
  useEffect(() => {
    let interval;
    if (isMatching) {
      interval = setInterval(() => {
        setWaitingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isMatching]);
  
  const handleStartMatching = () => {
    if (!selectedMood) return;
    setIsMatching(true);
    socket.emit('chat:find', { mood: selectedMood });
  };
  
  const handleAIChat = () => {
    // Implement AI chatbot
    toast.info('AI companion coming soon...');
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="max-w-md w-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-purple-500/30 p-6">
        {!isMatching ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Talk to Someone</h3>
              <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <p className="text-gray-400 text-sm mb-4">How are you feeling right now?</p>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              {moods.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => setSelectedMood(mood.id)}
                  className={`p-4 rounded-xl text-center transition-all ${
                    selectedMood === mood.id
                      ? `bg-gradient-to-r ${mood.color} text-white shadow-lg`
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  <span className="text-2xl block mb-1">{mood.emoji}</span>
                  <span className="text-sm font-medium">{mood.label}</span>
                </button>
              ))}
            </div>
            
            <button
              onClick={handleStartMatching}
              disabled={!selectedMood}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50"
            >
              Talk to Someone
            </button>
            
            <p className="text-center text-xs text-gray-500 mt-4">
              🔒 100% Anonymous • 30 min sessions • Auto-delete
            </p>
          </>
        ) : (
          <>
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Finding someone...</h3>
              <p className="text-gray-400">Looking for someone who feels the same way</p>
              
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                Waiting: {Math.floor(waitingTime / 60)}:{(waitingTime % 60).toString().padStart(2, '0')}
              </div>
              
              {offerAI && (
                <div className="mt-6 p-4 bg-purple-500/20 rounded-xl">
                  <Bot className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-white text-sm mb-3">No one's available right now</p>
                  <button
                    onClick={handleAIChat}
                    className="px-4 py-2 bg-purple-600 rounded-lg text-white text-sm"
                  >
                    Talk to AI Companion
                  </button>
                </div>
              )}
              
              <button
                onClick={() => {
                  setIsMatching(false);
                  socket.emit('chat:cancel');
                }}
                className="mt-6 text-gray-500 hover:text-gray-300 text-sm"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};