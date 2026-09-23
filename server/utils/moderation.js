const profanityList = [
  'kill yourself', 'die', 'hate speech', 'racial slur', 'fuck', 'shit', 'asshole'
];

const crisisKeywords = [
  'suicide', 'kill myself', 'end my life', 'want to die',
  'self harm', 'hurt myself', 'no reason to live', 'worthless'
];

const moderateMessage = async (content) => {
  let cleanedContent = content;
  let isSafe = true;
  let reason = null;
  let isCrisis = false;
  
  const lowerContent = content.toLowerCase();
  
  for (const word of profanityList) {
    if (lowerContent.includes(word)) {
      isSafe = false;
      reason = 'inappropriate language';
      const regex = new RegExp(word, 'gi');
      cleanedContent = cleanedContent.replace(regex, '[filtered]');
    }
  }
  
  for (const keyword of crisisKeywords) {
    if (lowerContent.includes(keyword)) {
      isCrisis = true;
    }
  }
  
  return {
    isSafe,
    isCrisis,
    reason,
    cleanedContent,
    wasModified: cleanedContent !== content
  };
};

module.exports = { moderateMessage };