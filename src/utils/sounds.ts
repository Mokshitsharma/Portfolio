export const playSound = (type: 'click' | 'message' | 'open' | 'close') => {
  const sounds = {
    click: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
    message: 'https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3',
    open: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
    close: 'https://assets.mixkit.co/active_storage/sfx/2567/2567-preview.mp3',
  };

  const audio = new Audio(sounds[type]);
  audio.volume = 0.3;
  audio.play().catch(err => console.log('Audio play blocked:', err));
};
