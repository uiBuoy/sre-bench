

const BASE_URL = 'http://localhost:5001';

export const getQuestions = async (quizId) => {
   try {
      return fetch(`${BASE_URL}/quizzes/${quizId}/questions`);
   } catch (error) {
      console.log("error", error)
   }
}

export const getAllQuizzes = async () => {
   try {
      return fetch(`${BASE_URL}/quizzes`);
   } catch (error) {
      console.log("error", error)
   }
}

export const submitAnswer = async (data) => {
   const { params, body } = data;
   try {
      return fetch(`${BASE_URL}/quizzes/${params.quizId}/answer/${params.questionId}`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(body),
      });
   } catch (error) {
      console.log("error", error)
   }
}



export const getSuggestions = async (data) => {
   const { quizId, query } = data;
   try {
      return fetch(`${BASE_URL}/quizzes/${quizId}/auto-suggestions?q=${query}`);
   } catch (error) {
      console.log("error", error)
   }
}


export const createUser = async (userDetails) => {
   try {
      return fetch(`${BASE_URL}/user`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(userDetails),
      });
   } catch (error) {
      console.log("error", error)
   }
}


export const getQuizAnalysis = async (data) => {
   const { quizId } = data;
   try {
      return fetch(`${BASE_URL}/quizzes/${quizId}/quiz-analysis`);
   } catch (error) {
      console.log("error", error)
   }
}