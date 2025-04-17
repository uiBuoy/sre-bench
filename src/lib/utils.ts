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


  // Define the shape of one quiz entry
export interface QuizData {
  answer?: any[];
  questions?: any[];
  time?: number;
  userPreference?: string;
  visibleMessages?: string[];
  currentQuestionIndex?: number;
  totalRunningTime?: number;
  isQuizCompleted?: boolean;
}

// Shape of the entire terminal object
export interface TerminalStorage {
  [quizId: string]: QuizData;
}


const LOCAL_STORAGE_KEY = "terminal";

export const setToStoragePartial = <K extends keyof QuizData>(
  quizId: string,
  field: K,
  value: QuizData[K]
): void => {
  try {
    if(!quizId) quizId = 'user';

    const terminal: TerminalStorage = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "{}");

    const currentQuizData = terminal[quizId] || {};

    const updatedQuizData: QuizData = {
      ...currentQuizData,
      [field]: value,
    };

    const updatedTerminal: TerminalStorage = {
      ...terminal,
      [quizId]: updatedQuizData,
    };

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTerminal));
  } catch (error) {
    console.error("Error setting to storage:", error);
  }
};



export const getFromStoragePartial = <T>(
  quizId: string | null,
  field: keyof QuizData | null,
  fallback: T
): T => {
  try {
    if(!quizId) return fallback;

    const terminal: TerminalStorage = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "{}");

    if (!quizId) {
      return (terminal as unknown as T) ?? fallback;
    }

    const quizData = terminal[quizId];

    if (!quizData) return fallback;

    if (field) {
      return (quizData[field] as T) ?? fallback;
    }

    return quizData as unknown as T;
  } catch {
    return fallback;
  }
};

  
  
  export const getPrecentageFromValue = (currentValue: number, totalValue:number) => {
   return (currentValue/totalValue)*100;
  }


  export const isButtonDisable = (index:number, total:number) =>{
      if(total=== index){
        return false
      }
      return true
  }



  