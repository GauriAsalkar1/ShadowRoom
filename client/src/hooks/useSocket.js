import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { token } = useAuth();
  const socketRef = useRef(null);

  useEffect(() => {
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    
    const newSocket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });
    
    socketRef.current = newSocket;
    setSocket(newSocket);
    
    newSocket.on('connect', () => {
      console.log('🔌 Socket connected');
      setIsConnected(true);
    });
    
    newSocket.on('disconnect', () => {
      console.log('🔌 Socket disconnected');
      setIsConnected(false);
    });
    
    return () => {
      newSocket.disconnect();
    };
  }, [token]);
  
  return { socket, isConnected };
};