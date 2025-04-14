export function validateEmail(email : string) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }
  
  
  export function convertSecondsToTime(seconds: number) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
  
    // Pad with leading zero if needed
    const formattedTime = [
        hrs.toString().padStart(2, '0'),
        mins.toString().padStart(2, '0'),
        secs.toString().padStart(2, '0')
    ].join(':');
  
    return formattedTime;
  }
  
  
  export const getFromStorage = <T>(key: string, fallback: T): T => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  };
  
  export const setToStorage = (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error('Failed to write to localStorage', err);
    }
  };
  
  
  export const getPrecentageFromValue = (currentValue: number, totalValue:number) => {
   return (currentValue/totalValue)*100;
  }