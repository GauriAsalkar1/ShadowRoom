const prefixes = [
  'Silent', 'Gentle', 'Calm', 'Quiet', 'Peaceful', 'Kind', 'Wise', 'Brave',
  'Shadow', 'Whisper', 'Echo', 'Dream', 'Moon', 'Star', 'River', 'Forest',
  'Ocean', 'Mountain', 'Cloud', 'Mist', 'Dawn', 'Dusk', 'Light', 'Hope'
];

const suffixes = [
  'Soul', 'Heart', 'Mind', 'Spirit', 'Listener', 'Walker', 'Seeker', 'Friend',
  'Companion', 'Guide', 'Helper', 'Healer', 'Thinker', 'Dreamer', 'Believer'
];

const animals = [
  'Wolf', 'Fox', 'Owl', 'Hawk', 'Dove', 'Swan', 'Deer', 'Bear', 'Lion', 'Tiger',
  'Butterfly', 'Dragonfly', 'Phoenix', 'Raven', 'Crow', 'Falcon', 'Eagle'
];

const generateRandomNumber = () => Math.floor(Math.random() * 10000);

const generateAnonymousName = () => {
  const type = Math.floor(Math.random() * 3);
  
  switch(type) {
    case 0:
      return `${prefixes[Math.floor(Math.random() * prefixes.length)]}${suffixes[Math.floor(Math.random() * suffixes.length)]}_${generateRandomNumber()}`;
    case 1:
      return `${prefixes[Math.floor(Math.random() * prefixes.length)]}${animals[Math.floor(Math.random() * animals.length)]}_${generateRandomNumber()}`;
    default:
      return `${suffixes[Math.floor(Math.random() * suffixes.length)]}Of${prefixes[Math.floor(Math.random() * prefixes.length)]}_${generateRandomNumber()}`;
  }
};

module.exports = { generateAnonymousName };