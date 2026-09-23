// Profanity list (simplified - use a proper library in production)
const profanityList = [
  'kill yourself', 'die', 'hate speech', 'racial slur'
  // Add comprehensive list from npm package 'bad-words'
];

const crisisKeywords = [
  'suicide', 'kill myself', 'end my life', 'want to die',
  'self harm', 'hurt myself', 'no reason to live', 'worthless'
];

export const moderateMessage = async (content) => {
  let cleanedContent = content;
  let isSafe = true;
  let reason = null;
  let isCrisis = false;
  
  // Check for profanity
  for (const word of profanityList) {
    if (content.toLowerCase().includes(word)) {
      isSafe = false;
      reason = 'inappropriate language';
      cleanedContent = content.replace(new RegExp(word, 'gi'), '[filtered]');
    }
  }
  
  // Check for crisis
  for (const keyword of crisisKeywords) {
    if (content.toLowerCase().includes(keyword)) {
      isCrisis = true;
    }
  }
  
  // Optional: AI toxicity check (using Perspective API)
  // const toxicityResult = await checkToxicity(content);
  // if (toxicityResult.toxicity > 0.7) isSafe = false;
  
  return {
    isSafe,
    isCrisis,
    reason,
    cleanedContent,
    wasModified: cleanedContent !== content
  };
};