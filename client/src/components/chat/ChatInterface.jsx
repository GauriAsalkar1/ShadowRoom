import React, { useState, useEffect, useRef } from 'react';
import { Send, AlertCircle, Flag, X, UserMinus } from 'lucide-react';
import { useSocket } from '../../hooks/useSocket';
import { SessionTimer } from './SessionTimer';
import { TypingIndicator } from './TypingIndicator';
import toast from 'react-hot-toast';

export const ChatInterface = ({ sessionId, partnerName, expiresAt, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const messagesEndRef = useRef(null);
  const { socket } = useSocket();
  
  useEffect(() => {
    if (!socket) return;
    
    // Join chat room
    socket.emit('chat:join', { sessionId });
    
    // Message handlers
    socket.on('chat:message', (message) => {
      setMessages(prev => [...prev, message]);
      scrollToBottom();
    });
    
    socket.on('chat:typing', ({ isTyping }) => {
      setPartnerTyping(isTyping);
    });
    
    socket.on('chat:partner_left', (data) => {
      toast.error(data.message);
      setIsConnected(false);
    });
    
    socket.on('chat:blocked', ({ reason, suggestion }) => {
      toast.error(`Message blocked: ${reason}`);
      if (suggestion) toast(suggestion);
    });
    
    socket.on('chat:crisis_support', ({ resources, message }) => {
      toast((t) => (
        <div className="bg-red-500/20 p-3 rounded-lg">
          <p className="text-red-300 font-bold">⚠️ We're here for you</p>
          <p className="text-sm">{message}</p>
          <div className="mt-2 space-y-1">
            {resources.map((r, i) => (
              <p key={i} className="text-xs">📞 {r.name}: {r.number}</p>
            ))}
          </div>
        </div>
      ), { duration: 10000 });
    });
    
    socket.on('chat:ended', ({ reason }) => {
      toast(`Chat ended: ${reason}`);
      setTimeout(() => onClose(), 2000);
    });
    
    return () => {
      socket.off('chat:message');
      socket.off('chat:typing');
      socket.off('chat:partner_left');
      socket.off('chat:blocked');
      socket.off('chat:crisis_support');
      socket.off('chat:ended');
    };
  }, [socket, sessionId]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    if (!isConnected) {
      toast.error('Chat session ended');
      return;
    }
    
    socket.emit('chat:message', {
      sessionId,
      content: inputMessage
    });
    
    setInputMessage('');
  };
  
  const handleTyping = (e) => {
    setInputMessage(e.target.value);
    
    if (!isTyping && e.target.value.length > 0) {
      setIsTyping(true);
      socket.emit('chat:typing', { sessionId, isTyping: true });
    } else if (isTyping && e.target.value.length === 0) {
      setIsTyping(false);
      socket.emit('chat:typing', { sessionId, isTyping: false });
    }
  };
  
  const handleReport = () => {
    if (confirm('Report this user? This will end the chat.')) {
      socket.emit('chat:report', { sessionId, reason: 'Inappropriate behaviour' });
    }
  };
  
  const handleLeave = () => {
    if (confirm('Are you sure you want to leave?')) {
      socket.emit('chat:leave');
      onClose();
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-2xl bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-purple-500/30 shadow-2xl flex flex-col h-[600px]">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <div>
            <h3 className="text-white font-semibold">Chatting with</h3>
            <p className="text-purple-400 text-sm">{partnerName}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <SessionTimer expiresAt={expiresAt} onEnd={onClose} />
            <button onClick={handleReport} className="p-2 hover:bg-red-500/20 rounded-lg transition">
              <Flag className="w-5 h-5 text-red-400" />
            </button>
            <button onClick={handleLeave} className="p-2 hover:bg-white/10 rounded-lg transition">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.senderTempId === socket?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] ${msg.isSystem ? 'bg-gray-700/50 text-center mx-auto' : msg.senderTempId === socket?.id ? 'bg-purple-600' : 'bg-gray-700'} rounded-2xl px-4 py-2`}>
                {!msg.isSystem && !(msg.senderTempId === socket?.id) && (
                  <p className="text-xs text-purple-400 mb-1">{msg.senderName}</p>
                )}
                <p className="text-white text-sm">{msg.content}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          {partnerTyping && <TypingIndicator name={partnerName} />}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input */}
        <div className="p-4 border-t border-white/10 flex gap-3">
          <input
            type="text"
            value={inputMessage}
            onChange={handleTyping}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={!isConnected}
          />
          <button
            onClick={handleSendMessage}
            disabled={!isConnected || !inputMessage.trim()}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        {/* Safety Note */}
        <div className="px-4 pb-4 text-center">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Your identity is protected. Report any inappropriate behaviour.
          </p>
        </div>
      </div>
    </div>
  );
};