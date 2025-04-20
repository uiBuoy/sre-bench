// data.js

const data = {
    quizzes: [
        {
            id: "quiz-1",
            category: "DevOps",
            questions: [
                {
                    id: 'r-1',
                    question: 'What is the capital of Rajasthan?',
                    possible_answer: 'Jaipur',
                    metadata: {},
                },
                {
                    id: 'r-2',
                    question: 'What is the official language of Rajasthan?',
                    possible_answer: 'Rajasthani',
                    metadata: {},
                },
                {
                    id: 'r-3',
                    question: 'Which Rajput emperor is credited with building many forts in Rajasthan, including Chittorgarh?',
                    possible_answer: 'Maharan Kumbha',
                    metadata: {},
                },
                {
                    id: 'r-4',
                    question: 'Which is the largest artificial lake in Rajasthan?',
                    possible_answer: 'Jaisamand Lake',
                    metadata: {},
                },
            ],
            answers: [
                // {
                //     id: "a1",
                //     questionId: "r-1",
                //     answer: "the answer would be like reactjs",
                //     correctAnswer: false,
                //     time: 20
                // },
                // {
                //     id: "a2",
                //     questionId: "r-2",
                //     answer: "the answer would be like nodejs",
                //     correctAnswer: true,
                //     time: 100
                // }
            ], // { questionId, is_correct }
            suggestions: [
                {
                    command_id: 'cmd-1',
                    command: 'This is my command one'
                },
                {
                    command_id: 'cmd-2',
                    command: 'It could be Alwar'
                },
                {
                    command_id: 'cmd-3',
                    command: 'It clouser to all big city of that state'
                },
                {
                    command_id: 'cmd-4',
                    command: 'City name will be Jodhpur'
                },
                {
                    command_id: 'cmd-5',
                    command: 'City could have good amout of water supply'
                },
                {
                    command_id: 'cmd-6',
                    command: 'That City could have better trasportaion connectivty with other biggest city of India'
                }
            ],
            response: "### Your Answer Was Correct!"
        },
        {
            id: "quiz-2",
            category: "development",
            questions: [
                      {
                    id: 'r-1',
                    question: 'What is the capital of Rajasthan?',
                    possible_answer: 'Jaipur',
                    metadata: {},
                },
                {
                    id: 'r-2',
                    question: 'What is the official language of Rajasthan?',
                    possible_answer: 'Rajasthani',
                    metadata: {},
                },
                {
                    id: 'r-3',
                    question: 'Which Rajput emperor is credited with building many forts in Rajasthan, including Chittorgarh?',
                    possible_answer: 'Maharan Kumbha',
                    metadata: {},
                },
                {
                    id: 'r-4',
                    question: 'Which is the largest artificial lake in Rajasthan?',
                    possible_answer: 'Jaisamand Lake',
                    metadata: {},
                },
            ],
            answers: [
                {
                    id: "a1",
                    questionId: "r-1",
                    answer: "building online application",
                    correctAnswer: true,
                    time: 100,
                },
                {
                    id: "a2",
                    questionId: "r-2",
                    answer: "reactjs is is open source js-library, to build single page application",
                    correctAnswer: true,
                    time: 150, 
                }
            ], // { questionId, is_correct }
            suggestions: [
                {
                    command_id: 'cmd-1',
                    command: 'This is my command one'
                },
                {
                    command_id: 'cmd-2',
                    command: 'It could be Alwar'
                },
                {
                    command_id: 'cmd-3',
                    command: 'It clouser to all big city of that state'
                },
                {
                    command_id: 'cmd-4',
                    command: 'City name will be Jodhpur'
                },
                {
                    command_id: 'cmd-5',
                    command: 'City could have good amout of water supply'
                },
                {
                    command_id: 'cmd-6',
                    command: 'That City could have better trasportaion connectivty with other biggest city of India'
                }
            ],
            response: "### Your Answer Was Correct!"
        }
    ],
    users: []
};

module.exports = data;
