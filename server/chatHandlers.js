const ChatSession = require('../models/ChatSession');
const { generateAnonymousName } = require('../utils/anonymousNames');
const { addToQueue, findMatch, removeFromQueue } = require('./redis');
const { moderateMessage } = require('../utils/moderation');

module.exports = (io, socket) => {
  let currentSession = null;
  let currentTempId = null;
  let currentTempName = null;
  let matchInterval = null;
  let timeoutTimer = null;
  
  // Helper to get participant name
  const getParticipantName = (tempId) => {
    if (!currentSession) return 'Anonymous';
    const participant = currentSession.participants.find(p => p.tempId === tempId);
    return participant?.tempName || generateAnonymousName();
  };
  
  // Join chat room
  socket.on('chat:join', ({ sessionId }) => {
    socket.join(sessionId);
    console.log(`📡 User ${socket.id} joined room: ${sessionId}`);
  });
  
  // User wants to chat
  socket.on('chat:find', async (data) => {
    const { mood } = data;
    
    // Clear any existing intervals/timers
    if (matchInterval) clearInterval(matchInterval);
    if (timeoutTimer) clearTimeout(timeoutTimer);
    
    // Generate temporary identity
    currentTempId = socket.id;
    currentTempName = generateAnonymousName();
    const sessionId = `session_${Date.now()}_${currentTempId.substring(0, 8)}`;
    
    console.log(`🔍 User ${currentTempName} (${currentTempId}) looking for chat with mood: ${mood}`);
    
    // Add to matchmaking queue
    await addToQueue(mood, sessionId, currentTempId, currentTempName);
    
    // Emit waiting status
    socket.emit('chat:waiting', { 
      message: 'Finding someone who feels the same...', 
      position: 1 
    });
    
    // Try to find match every 2 seconds
    matchInterval = setInterval(async () => {
      const match = await findMatch(mood, sessionId);
      
      if (match) {
        clearInterval(matchInterval);
        clearTimeout(timeoutTimer);
        matchInterval = null;
        timeoutTimer = null;
        
        await removeFromQueue(mood, sessionId);
        
        // Create chat session
        const chatSession = new ChatSession({
          sessionId,
          mood,
          participants: [
            { 
              tempId: currentTempId, 
              tempName: currentTempName, 
              joinedAt: new Date(), 
              isActive: true 
            },
            { 
              tempId: match.tempId, 
              tempName: match.tempName || generateAnonymousName(), 
              joinedAt: new Date(), 
              isActive: true 
            }
          ],
          status: 'active',
          expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
        });
        
        await chatSession.save();
        currentSession = chatSession;
        
        // Join socket room
        socket.join(sessionId);
        const partnerSocket = io.sockets.sockets.get(match.tempId);
        if (partnerSocket) {
          partnerSocket.join(sessionId);
        }
        
        // Notify both users
        const partnerName = match.tempName || generateAnonymousName();
        
        socket.emit('chat:matched', {
          sessionId,
          partnerName,
          expiresAt: chatSession.expiresAt,
          yourName: currentTempName
        });
        
        if (partnerSocket) {
          partnerSocket.emit('chat:matched', {
            sessionId,
            partnerName: currentTempName,
            expiresAt: chatSession.expiresAt,
            yourName: partnerName
          });
        }
        
        // Send system message to both
        const systemMessage = {
          content: "🔒 You're now connected anonymously. Be kind, be safe.\n\nType !help for mental health resources.",
          isSystem: true,
          timestamp: new Date()
        };
        
        io.to(sessionId).emit('chat:message', systemMessage);
        
        console.log(`✅ Matched: ${currentTempName} <> ${partnerName} in session ${sessionId}`);
      }
    }, 2000);
    
    // Timeout after 45 seconds - offer AI chat
    timeoutTimer = setTimeout(async () => {
      clearInterval(matchInterval);
      matchInterval = null;
      
      // Check if still in queue
      const stillWaiting = await ChatSession.findOne({ sessionId, status: 'waiting' });
      if (stillWaiting || true) {
        socket.emit('chat:ai_fallback', {
          message: "No one's available right now. Would you like to talk to our AI companion?",
          offerAI: true
        });
        console.log(`🤖 AI fallback offered to ${currentTempName}`);
      }
      timeoutTimer = null;
    }, 45000);
  });
  
  // Cancel matchmaking
  socket.on('chat:cancel', async () => {
    if (matchInterval) {
      clearInterval(matchInterval);
      matchInterval = null;
    }
    if (timeoutTimer) {
      clearTimeout(timeoutTimer);
      timeoutTimer = null;
    }
    console.log(`❌ User ${currentTempId} cancelled matchmaking`);
    socket.emit('chat:cancelled', { message: 'Matchmaking cancelled' });
  });
  
  // Send message
  socket.on('chat:message', async (data) => {
    const { sessionId, content } = data;
    
    if (!currentSession || currentSession.sessionId !== sessionId) {
      return socket.emit('chat:error', { message: 'Session not found' });
    }
    
    // Check if session is still active
    if (currentSession.status !== 'active') {
      return socket.emit('chat:error', { message: 'Chat session has ended' });
    }
    
    // Moderate message
    const moderation = await moderateMessage(content);
    
    if (!moderation.isSafe) {
      socket.emit('chat:blocked', { 
        reason: moderation.reason,
        suggestion: "Please keep conversations respectful and supportive."
      });
      return;
    }
    
    // Check for crisis keywords
    if (moderation.isCrisis) {
      socket.emit('chat:crisis_support', {
        resources: [
          { name: '988 Suicide & Crisis Lifeline', number: '988' },
          { name: 'Crisis Text Line', number: '741741' },
          { name: 'Mental Health America', url: 'https://mhanational.org' }
        ],
        message: "We care about you. You're not alone. Please reach out to these resources for support."
      });
    }
    
    // Handle !help command
    if (moderation.cleanedContent.trim().toLowerCase() === '!help') {
      socket.emit('chat:crisis_support', {
        resources: [
          { name: '988 Suicide & Crisis Lifeline', number: '988' },
          { name: 'Crisis Text Line', number: '741741' },
          { name: 'National Domestic Violence Hotline', number: '1-800-799-7233' }
        ],
        message: "Here are some resources that can help:"
      });
      return;
    }
    
    // Save and broadcast message
    const message = {
      content: moderation.cleanedContent,
      senderTempId: currentTempId,
      senderName: currentTempName,
      timestamp: new Date(),
      isModerated: moderation.wasModified
    };
    
    currentSession.messages.push(message);
    await currentSession.save();
    
    io.to(sessionId).emit('chat:message', message);
  });
  
  // Typing indicator
  socket.on('chat:typing', (data) => {
    const { sessionId, isTyping } = data;
    socket.to(sessionId).emit('chat:typing', { isTyping });
  });
  
  // Report user
  socket.on('chat:report', async (data) => {
    const { sessionId, reason } = data;
    
    const session = await ChatSession.findOne({ sessionId });
    if (session) {
      session.reportCount += 1;
      session.reportedBy.push(currentTempId);
      session.status = 'reported';
      await session.save();
      
      // Notify moderators (admin dashboard)
      io.emit('admin:report', { 
        sessionId, 
        reason, 
        reportedBy: currentTempId,
        reportedByName: currentTempName,
        timestamp: new Date()
      });
      
      // Notify both users
      io.to(sessionId).emit('chat:ended', { 
        reason: 'reported', 
        message: 'Chat has been reported to moderators. Session ending.' 
      });
      
      // Clean up
      socket.leave(sessionId);
      console.log(`⚠️ Chat ${sessionId} reported by ${currentTempName}: ${reason}`);
    }
  });
  
  // Leave chat voluntarily
  socket.on('chat:leave', async () => {
    if (currentSession) {
      const sessionId = currentSession.sessionId;
      
      // Notify other participant
      socket.to(sessionId).emit('chat:partner_left', {
        message: "Your partner has left the chat. Session ending."
      });
      
      // Update session
      const participant = currentSession.participants.find(p => p.tempId === currentTempId);
      if (participant) {
        participant.leftAt = new Date();
        participant.isActive = false;
      }
      
      currentSession.status = 'ended';
      await currentSession.save();
      
      socket.leave(sessionId);
      socket.emit('chat:ended', { reason: 'user_left', message: 'You left the chat.' });
      
      console.log(`🚪 User ${currentTempName} left chat ${sessionId}`);
      currentSession = null;
    }
  });
  
  // Disconnect handling
  socket.on('disconnect', async () => {
    console.log(`🔌 User disconnected: ${currentTempName || socket.id}`);
    
    // Clear intervals/timeouts
    if (matchInterval) {
      clearInterval(matchInterval);
      matchInterval = null;
    }
    if (timeoutTimer) {
      clearTimeout(timeoutTimer);
      timeoutTimer = null;
    }
    
    if (currentSession) {
      const sessionId = currentSession.sessionId;
      
      // Notify other participant
      socket.to(sessionId).emit('chat:partner_disconnected', {
        message: "Your partner has disconnected. They have 30 seconds to reconnect..."
      });
      
      // Update participant status
      const participant = currentSession.participants.find(p => p.tempId === currentTempId);
      if (participant) {
        participant.leftAt = new Date();
        participant.isActive = false;
      }
      
      await currentSession.save();
      
      // Give 30 seconds to reconnect
      setTimeout(async () => {
        const session = await ChatSession.findById(currentSession?._id);
        const reconnected = session?.participants.some(p => p.tempId === currentTempId && p.isActive);
        
        if (!reconnected && session && session.status === 'active') {
          io.to(sessionId).emit('chat:ended', { 
            reason: 'partner_disconnected', 
            message: 'Your partner did not reconnect. Session ending.' 
          });
          session.status = 'ended';
          await session.save();
          console.log(`💀 Chat ${sessionId} ended due to disconnect timeout`);
        }
      }, 30000);
      
      currentSession = null;
    }
    
    // Remove from queues
    if (currentTempId) {
      // Remove from all possible mood queues
      const moods = ['angry', 'sad', 'confused', 'happy', 'anxious', 'lonely', 'depressed'];
      for (const mood of moods) {
        await removeFromQueue(mood, currentTempId);
      }
    }
  });
};