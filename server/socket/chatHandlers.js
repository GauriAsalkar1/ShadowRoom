const ChatSession = require('../models/ChatSession');
const { generateAnonymousName } = require('../utils/anonymousNames');
const { addToQueue, findMatch, removeFromQueue } = require('../services/redis');
const { moderateMessage } = require('./moderation');

module.exports = (io, socket) => {
  let currentSession = null;
  let currentTempId = null;
  
  // User wants to chat
  socket.on('chat:find', async (data) => {
    const { mood } = data;
    
    // Generate temporary identity
    const tempId = socket.id;
    const tempName = generateAnonymousName();
    const sessionId = `session_${Date.now()}_${tempId}`;
    
    currentTempId = tempId;
    
    // Add to matchmaking queue
    await addToQueue(mood, sessionId, tempId);
    
    // Emit waiting status
    socket.emit('chat:waiting', { message: 'Finding someone who feels the same...', position: 1 });
    
    // Try to find match (check every 2 seconds)
    const matchInterval = setInterval(async () => {
      const match = await findMatch(mood, sessionId);
      
      if (match) {
        clearInterval(matchInterval);
        await removeFromQueue(mood, sessionId);
        
        // Create chat session
        const chatSession = new ChatSession({
          sessionId,
          mood,
          participants: [
            { tempId, tempName, joinedAt: new Date(), isActive: true },
            { tempId: match.tempId, tempName: match.tempName || generateAnonymousName(), joinedAt: new Date(), isActive: true }
          ],
          status: 'active',
          expiresAt: new Date(Date.now() + 30 * 60 * 1000)
        });
        
        await chatSession.save();
        currentSession = chatSession;
        
        // Join socket room
        socket.join(sessionId);
        io.to(match.tempId).socketsJoin(sessionId);
        
        // Notify both users
        io.to(sessionId).emit('chat:matched', {
          sessionId,
          partnerName: match.tempName || generateAnonymousName(),
          expiresAt: chatSession.expiresAt,
          yourName: tempName
        });
        
        // Send system message
        io.to(sessionId).emit('chat:message', {
          content: "You're now connected anonymously. Be kind, be safe. Type '!help' for resources.",
          isSystem: true,
          timestamp: new Date()
        });
      }
    }, 2000);
    
    // Timeout after 30 seconds - offer AI chat
    setTimeout(async () => {
      clearInterval(matchInterval);
      const stillWaiting = await ChatSession.findOne({ sessionId, status: 'waiting' });
      if (stillWaiting) {
        socket.emit('chat:ai_fallback', {
          message: "No one's available right now. Would you like to talk to our AI companion?",
          offerAI: true
        });
      }
    }, 30000);
  });
  
  // Send message
  socket.on('chat:message', async (data) => {
    const { sessionId, content } = data;
    
    if (!currentSession || currentSession.sessionId !== sessionId) {
      return socket.emit('chat:error', { message: 'Session not found' });
    }
    
    // Moderate message
    const moderation = await moderateMessage(content);
    
    if (!moderation.isSafe) {
      socket.emit('chat:blocked', { 
        reason: moderation.reason,
        suggestion: moderation.suggestion
      });
      return;
    }
    
    // Check for crisis
    if (moderation.isCrisis) {
      socket.emit('chat:crisis_support', {
        resources: [
          { name: 'Crisis Helpline', number: '988' },
          { name: 'Mental Health Support', url: 'https://mentalhealth.gov' }
        ],
        message: "We care about you. Here are some resources that can help."
      });
    }
    
    // Save and broadcast message
    const message = {
      content: moderation.cleanedContent,
      senderTempId: currentTempId,
      senderName: currentSession.participants.find(p => p.tempId === currentTempId)?.tempName,
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
    socket.to(sessionId).emit('chat:typing', { isTyping, user: currentTempId });
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
      io.emit('admin:report', { sessionId, reason, reportedBy: currentTempId });
      
      // End chat
      io.to(sessionId).emit('chat:ended', { reason: 'reported', message: 'Chat has been reported to moderators.' });
      
      // Clean up
      socket.leave(sessionId);
      socket.to(sessionId).socketsLeave(sessionId);
    }
  });
  
  // Leave chat
  socket.on('chat:leave', async () => {
    if (currentSession) {
      // Notify other participant
      socket.to(currentSession.sessionId).emit('chat:partner_left', {
        message: "Your partner has left the chat. Session ending."
      });
      
      // Update session
      const participant = currentSession.participants.find(p => p.tempId === currentTempId);
      if (participant) {
        participant.leftAt = new Date();
        participant.isActive = false;
      }
      
      await currentSession.save();
      socket.leave(currentSession.sessionId);
      currentSession = null;
      
      socket.emit('chat:ended', { reason: 'user_left' });
    }
  });
  
  // Disconnect handling
  socket.on('disconnect', async () => {
    if (currentSession) {
      socket.to(currentSession.sessionId).emit('chat:partner_disconnected', {
        message: "Your partner has disconnected. Waiting for reconnection..."
      });
      
      // Give 30 seconds to reconnect
      setTimeout(async () => {
        const session = await ChatSession.findById(currentSession._id);
        const participant = session?.participants.find(p => p.tempId === currentTempId);
        
        if (participant && !participant.isActive) {
          // Partner never reconnected
          io.to(currentSession.sessionId).emit('chat:ended', { reason: 'partner_disconnected' });
          await session.save();
        }
      }, 30000);
    }
    
    // Remove from queues
    if (currentTempId) {
      await removeFromQueue('*', currentTempId);
    }
  });
};