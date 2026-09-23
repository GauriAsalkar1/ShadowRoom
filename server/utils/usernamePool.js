// Pool of anonymous-sounding usernames
const usernamePool = [
  // Nature themed
  "SilentForest", "MidnightRiver", "WhisperingPine", "HiddenMeadow",
  "QuietMountain", "SecretGarden", "DistantThunder", "GentleRain",
  
  // Shadow themed
  "ShadowWalker", "EclipseSeeker", "TwilightGhost", "DarkenedPath",
  "UmbralHeart", "ShadeHunter", "GloomWatcher", "DuskTraveler",
  
  // Mystery themed
  "MysticSoul", "EnigmaMind", "RiddleKeeper", "SecretKeeper",
  "AnonymousEcho", "HiddenDepths", "QuietStorm", "ElectricSilence",
  
  // Animal themed
  "SilentWolf", "MidnightOwl", "ShadowFox", "WhisperPhoenix",
  "GhostRaven", "MysticFalcon", "SecretDove", "HiddenHawk",
  
  // Abstract
  "VoidWalker", "EtherealDream", "AstralProject", "NebulaMind",
  "QuantumGhost", "InfiniteShadow", "EchoChamber", "SilentScream"
];

// Generate random username from pool
const getRandomUsername = () => {
  const randomIndex = Math.floor(Math.random() * usernamePool.length);
  const randomNumber = Math.floor(Math.random() * 1000);
  return `${usernamePool[randomIndex]}${randomNumber}`;
};

// Check if username exists in pool (for custom usernames)
const isInPool = (username) => {
  // Remove numbers to check base name
  const baseName = username.replace(/[0-9]/g, '');
  return usernamePool.includes(baseName);
};

module.exports = { getRandomUsername, isInPool, usernamePool };