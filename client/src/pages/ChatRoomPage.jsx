import React, {
  useEffect,
  useRef,
  useState
} from 'react';

import { useParams } from 'react-router-dom';

import { io } from 'socket.io-client';

import {
  Send,
  Users
} from 'lucide-react';

import { Sidebar }
from '../components/layout/Sidebar';

import { Header }
from '../components/layout/Header';

const socket =
  io('http://localhost:5000');

// ======================
// RANDOM NICKNAME
// ======================

const generateNickname = () => {

  const first = [
    'Shadow',
    'Dark',
    'Ghost',
    'Silent',
    'Broken',
    'Hidden',
    'Moon',
    'Lost'
  ];

  const second = [
    'Wolf',
    'Crow',
    'Fox',
    'Soul',
    'Tiger',
    'Storm',
    'Raven'
  ];

  return `${first[Math.floor(Math.random() * first.length)]}${second[Math.floor(Math.random() * second.length)]}${Math.floor(Math.random() * 999)}`;
};

const ChatRoomPage = () => {

  const { mood } =
    useParams();

  const [messages, setMessages] =
    useState([]);

  const [message, setMessage] =
    useState('');

  const [onlineUsers, setOnlineUsers] =
    useState(0);

  const [typingUser, setTypingUser] =
    useState('');

  // ======================
  // FIXED NICKNAME
  // ======================

  const [nickname] = useState(() => {

    const savedNickname =
      localStorage.getItem(
        'shadowroom_nickname'
      );

    if (savedNickname) {

      return savedNickname;
    }

    const newNickname =
      generateNickname();

    localStorage.setItem(
      'shadowroom_nickname',
      newNickname
    );

    return newNickname;
  });

  const messagesEndRef =
    useRef(null);

  const typingTimeoutRef =
    useRef(null);

  // ======================
  // AUTO SCROLL
  // ======================

  const scrollToBottom = () => {

    messagesEndRef.current
      ?.scrollIntoView({
        behavior: 'smooth'
      });
  };

  useEffect(() => {

    scrollToBottom();

  }, [messages]);

  // ======================
  // SOCKET EVENTS
  // ======================

  useEffect(() => {

    socket.emit(
      'join_room',
      mood
    );

    // OLD MESSAGES

    socket.on(
      'previous_messages',
      (data) => {

        setMessages(data);
      }
    );

    // RECEIVE NEW MESSAGE

    socket.on(
      'receive_message',
      (data) => {

        setMessages(prev => [
          ...prev,
          data
        ]);
      }
    );

    // ONLINE USERS

    socket.on(
      'online_users',
      (count) => {

        setOnlineUsers(count);
      }
    );

    // USER TYPING

    socket.on(
      'user_typing',
      (username) => {

        if (
          username === nickname
        ) return;

        setTypingUser(username);

        clearTimeout(
          typingTimeoutRef.current
        );

        typingTimeoutRef.current =
          setTimeout(() => {

            setTypingUser('');

          }, 1500);
      }
    );

    return () => {

      socket.off(
        'previous_messages'
      );

      socket.off(
        'receive_message'
      );

      socket.off(
        'online_users'
      );

      socket.off(
        'user_typing'
      );
    };

  }, [mood, nickname]);

  // ======================
  // SEND MESSAGE
  // ======================

 const sendMessage = () => {

  if (!message.trim()) return;

  socket.emit(
    'send_message',
    {
      room: mood,
      username: nickname,
      message
    }
  );

  setMessage('');
};

  // ======================
  // HANDLE TYPING
  // ======================

  const handleTyping = (e) => {

    setMessage(e.target.value);

    socket.emit(
      'typing',
      {
        room: mood,
        username: nickname
      }
    );
  };

  // ======================
  // TIME FORMAT
  // ======================

  const formatTime = (date) => {

    return new Date(date)
      .toLocaleTimeString([], {

        hour: '2-digit',

        minute: '2-digit'
      });
  };

  return (

    <div className="min-h-screen bg-[#070710]">

      <Sidebar />

      <Header />

      <main className="ml-64 pt-24 px-6">

        <div className="max-w-5xl mx-auto">

          {/* ROOM HEADER */}

          <div className="bg-[#121225] border border-white/10 rounded-2xl p-5 mb-5">

            <div className="flex items-center justify-between">

              <div>

                <h1 className="text-5xl font-bold text-white">

                  {mood} Room

                </h1>

                <p className="text-gray-400 mt-2">

                  Anonymous support room

                </p>

              </div>

              <div className="bg-purple-600/20 px-5 py-3 rounded-xl flex items-center gap-2">

                <Users className="w-5 h-5 text-purple-400" />

                <span className="text-white font-semibold">

                  {onlineUsers} Online

                </span>

              </div>

            </div>

          </div>

          {/* CHAT BOX */}

          <div className="bg-[#121225] border border-white/10 rounded-2xl h-[70vh] flex flex-col overflow-hidden">

            {/* MESSAGES */}

            <div className="flex-1 overflow-y-auto p-5 space-y-4">

              {messages.map(
                (msg, index) => {

                  const isOwnMessage =
                    msg.username === nickname;

                  return (

                    <div
                      key={index}
                      className={`flex ${
                        isOwnMessage
                          ? 'justify-end'
                          : 'justify-start'
                      }`}
                    >

                      <div
                        className={`px-4 py-3 rounded-2xl max-w-[75%] ${
                          isOwnMessage
                            ? 'bg-purple-600 text-white'
                            : 'bg-[#1d1d35] text-white'
                        }`}
                      >

                        {!isOwnMessage && (

                          <div className="flex items-center gap-2 mb-1">

                            <p className="text-purple-300 text-sm font-semibold">

                              {msg.username}

                            </p>

                            <p className="text-gray-400 text-xs">

                              {formatTime(
                                msg.createdAt
                              )}

                            </p>

                          </div>
                        )}

                        {isOwnMessage && (

                          <p className="text-right text-xs text-gray-200 mb-1">

                            {formatTime(
                              msg.createdAt
                            )}

                          </p>
                        )}

                        <p className="break-words text-lg">

                          {msg.message}

                        </p>

                      </div>

                    </div>
                  );
                }
              )}

              {/* TYPING */}

              {typingUser && (

                <p className="text-gray-400 italic text-sm">

                  {typingUser} is typing...

                </p>

              )}

              <div ref={messagesEndRef} />

            </div>

            {/* INPUT */}

            <div className="border-t border-white/10 p-4 flex gap-3">

              <input
                type="text"
                value={message}
                onChange={handleTyping}
                onKeyDown={(e) => {

                  if (
                    e.key === 'Enter'
                  ) {

                    sendMessage();
                  }
                }}
                placeholder="Type your message..."
                className="flex-1 bg-[#1b1b33] text-white px-4 py-3 rounded-xl outline-none border border-white/10 focus:border-purple-500"
              />

              <button
                onClick={sendMessage}
                className="bg-purple-600 hover:bg-purple-700 transition px-5 rounded-xl flex items-center justify-center"
              >

                <Send className="w-5 h-5 text-white" />

              </button>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
};

export default ChatRoomPage;