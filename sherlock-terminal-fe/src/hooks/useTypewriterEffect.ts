import { useState, useEffect } from 'react';

function useTypewriterEffect(message: string, deps: any[], speed: number =10) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    console.log("hooooooko", message)
    let trimmedMessage = message.trim();
    trimmedMessage = trimmedMessage[0] + trimmedMessage;
    let index = 0;
    const typingInterval = setInterval(() => {
      setDisplayedText((prev) => prev + trimmedMessage.charAt(index));
      index += 1;
      if (index === trimmedMessage.length) {
        clearInterval(typingInterval);
      }
    }, speed);

    return () => clearInterval(typingInterval); // Cleanup on component unmount
  }, [message, speed]);

  return {displayedText, setDisplayedText};
}

export default useTypewriterEffect;
