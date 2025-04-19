import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Button } from "../../../components/Button";
import useTimer from "../../../hooks/useTimer";
import useTypewriterEffect from "../../../hooks/useTypewriterEffect";
import { convertSecondsToTime, getFromStorage, getFromStoragePartial, getPrecentageFromValue, isButtonDisable, setToStorage, setToStoragePartial, validateEmail } from "../../../lib/utils";
import ClockIcon from "../../../assets/svg/icons/clock.svg";
import Progress from "../../../components/Progress";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import { createUser, getAllQuizzes, getQuestions, getSuggestions, submitAnswer } from "../../../apis/terminal";




const markdownTableResponse = {
    "id": 1,
    "title": "User Information",
    "content": "| Name    | Age | City      |\n|---------|-----|-----------|\n| Anilraj   | 27  | GGN  |\n| Tony     | 30  | Mewar |\n| muskan | 25 | marwar   |"
  }

// const suggestionCommands = [
//     {
//         command_id: 'cmd-1',
//         command: 'This is my command one'
//     },
//     {
//         command_id: 'cmd-2',
//         command: 'It could be Alwar'
//     },
//     {
//         command_id: 'cmd-3',
//         command: 'It clouser to all big city of that state'
//     },
//     {
//         command_id: 'cmd-4',
//         command: 'City name will be Jodhpur'
//     },
//     {
//         command_id: 'cmd-5',
//         command: 'City could have good amout of water supply'
//     },
//     {
//         command_id: 'cmd-6',
//         command: 'That City could have better trasportaion connectivty with other biggest city of India'
//     }
// ]

const predefinedMessages = [
    {
        id: 'm-1',
        question: "Hello. Welcome to the Race Against the AI.\nWhat's your name? (optional, will not be used on the leaderboard)",
        possible_answer: 'Name (optional)',
        type_check: 'name',
    },
    {
        id: 'm-2',
        question: "Your email id? (vaild email is allowed)",
        possible_answer: '',
        type_check: 'email',
    },
    {
        id: 'm-3',
        question: "Choose option to select",
        possible_answer: 'Option (to be selected)',
    }
];



const defaultHints = {
    'r-1': [
        {
            hint_question_id: 'h-r-1-q-1',
            hint_question_questions: 'State capital could be clouser to the National Captial'
        },
        {
            hint_question_id: 'h-r-1-q-2',
            hint_question_questions: 'State capital could be Biggest city of that state'
        },
        {
            hint_question_id: 'h-r-1-q-3',
            hint_question_questions: 'State capital city can be have historical impect'
        },
    ],
    'r-2': [
        {
            hint_question_id: 'h-r-2-q-1',
            hint_question_questions: 'It could be comman language of country'
        },
        {
            hint_question_id: 'h-r-2-q-2',
            hint_question_questions: 'It could one of the resional language of state'
        },
    ],
}

const Terminal: React.FC = ({ setIsChatCompleted, setSelectedUserPreference, selectedUserPreference }) => {
    const { time, startTimer, stopTimer, resetTimer } = useTimer();

    const [quizOptions, setQuizOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState<string>(getFromStoragePartial(selectedUserPreference, 'userPreference', ''));
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(getFromStoragePartial(selectedOption, 'currentQuestionIndex', 0)); //getFromStorage('currentQuestionIndex', 0)
    const [input, setInput] = useState("");
    const [visibleMessages, setVisibleMessages] = useState<string[]>(getFromStoragePartial(selectedOption, 'visibleMessages', []));
    const terminalExecutedContainerRef = useRef(null);
    const [questions, setQuestions] = useState(getFromStoragePartial(selectedOption, 'questions', predefinedMessages));
    const [answers, setAnswers] = useState(getFromStoragePartial(selectedOption, 'answer', []));
    const [showSelectionOptions, setShowSelectionOptions] = useState<boolean>(false);
    const [hoveredSelectionOption, setHoveredSelectionOption] = useState('');
    const [showActions, setShowActions] = useState<boolean>(selectedOption && questions.length ? true : false);
    const [messageToRenderWordByWord, setMessageToRenderWordByWord] = useState<string>('')
    const {displayedText, setDisplayedText} = useTypewriterEffect(messageToRenderWordByWord, []);
    const [totalRunningTime, setTotalRunningTime] = useState<number>(getFromStoragePartial(selectedOption, 'totalRunningTime', 0));
    const [userDetails, setUserDetails] = useState<{name: string; email: string}>({name: '', email: ''});

    const [IsTerminal2Visible, setIsTerminal2Visible] = useState(selectedOption ? true : false);
    const [terminal2Hints, setTerminal2Hints] = useState([]);
    const [terminal2visibleMessages, setTerminal2visibleMessages] = useState<string[]>([]);
    const [terminal2Input, setTerminal2Input] = useState("");
    const [terminal2CurrentHintIndex, setTerminal2CurrentHintIndex] = useState(0);
    const [terminal2MessageToRenderWordByWord, setTerminal2MessageToRenderWordByWord] = useState<string>('')
    const {displayedText:terminal2DisplayedText, setDisplayedText:setTerminal2DisplayedText} = useTypewriterEffect(terminal2MessageToRenderWordByWord, []);
    
    const [showTerminal2InputSuggestionList, setShowTerminal2InputSuggestionList] = useState(false);
    const [terminal2SuggestionsList, setTerminal2SuggestionsList] = useState([]);
    const [terminal2HighlitedSuggestionIndex,  setTerminal2HighlitedSuggestionIndex]=useState<number>(-1);

    const handleAddNewTerminal = () => {
        setIsTerminal2Visible(!IsTerminal2Visible);
    };


    const fetchQuizessOptions = async() => {
        let response = await getAllQuizzes();
        response =  await response?.json();
        setQuizOptions(response?.map((_resp) => ({id: _resp.id, category:_resp.category })))
    }

    useEffect(() => {
        if (currentQuestionIndex < questions.length) {
            // get message line to render word by word with removing extra spaces
            let message = questions[currentQuestionIndex].question.trim();

          
            setMessageToRenderWordByWord(message);
            setDisplayedText("");

            // let hasSelectionQuestion = false;
            if (message === "Choose option to select") {
                // hasSelectionQuestion = true;
                setShowSelectionOptions(true);
                fetchQuizessOptions();
            }

            // message = message[0]+message; // it is not picking up the first later so adding one extra later
            // setDisplayedText("");

            // let i = 0;
            // const interval = setInterval(() => {
            //     if (i < message.length - 1) {
            //         setDisplayedText((prev) => prev + message[i]);
            //         i++;
            //     } else {
            //         if (hasSelectionQuestion) {
            //             setShowSelectionOptions(true);
            //         }
            //         clearInterval(interval);
            //     }
            // }, 10);
            
        }
    }, [currentQuestionIndex]);


    const updateTheAnswerState = () => {
    console.log("answer", answers)
       
        if (answers.length) {
            setAnswers((preState) => {
                const modifiedAnswerState =  preState.map((_answer, index) => {
                    if (index === currentQuestionIndex) {
                        return {
                            ..._answer,
                            userAnswer: input ? input : "",
                            time,
                        }
                    } else {
                        return _answer;
                    }
                })
                // setToStorage('answer', modifiedAnswerState);
                setToStoragePartial(selectedOption, 'answer', modifiedAnswerState);
                return modifiedAnswerState;
            })
        }
    }

    const moveToNextQuestion = () => {
        setInput("");

        if (questions.length > currentQuestionIndex) {
            console.log("currentQuestionIndex----", currentQuestionIndex, questions.length)
            setCurrentQuestionIndex((prev) => prev + 1);
        } else {
            //
        }

        // when question change in terminal-1, terminal-2 should be washout
        setTerminal2Hints([]);
        setTerminal2visibleMessages([]);
        setTerminal2CurrentHintIndex(0);

        // remove the previous word by word smg from hook's state;
        // setDisplayedText("");
    }


    const handleEnterKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && input.trim()) {
            if (questions[currentQuestionIndex]?.type_check === 'email') {
                if (validateEmail(input)) {
                    setVisibleMessages((prev) => [
                        ...prev,
                        `${questions[currentQuestionIndex].question}`,
                        `$ ${input}`,
                    ]);
                    setUserDetails((prevState) => ({...prevState, email: input}))
                } else {
                    return;
                }
                moveToNextQuestion();
            } else if(selectedOption) {

                // add input answer to visible message
                setVisibleMessages((prev) => [
                    ...prev,
                    `${questions[currentQuestionIndex].question}`,
                    `$ ${input}`
                ]);

                // check whether user's answer is correct or not
                 const answerBody = {
                    params: {
                        quizId: selectedOption,
                        questionId: questions[currentQuestionIndex]?.id,
                    },
                    body: {
                        questionId: questions[currentQuestionIndex]?.id,
                        answer: input,
                        time
                    }
                 }
                 let answerResponse = await submitAnswer(answerBody);
                 answerResponse = await answerResponse?.json();

                setDisplayedText("");
                setMessageToRenderWordByWord(answerResponse?.feedback);
                stopTimer(); // timer should be stop untill feedback doesnot completly typed(or untill move to next question)

                setTimeout(() => {
                    setVisibleMessages((prev) => [
                        ...prev,
                        answerResponse?.feedback
                    ]);

                    moveToNextQuestion();
                    // reset the on going time for currently asked question
                    setTotalRunningTime((prevTime) => prevTime + time);

                    if (currentQuestionIndex + 1 === questions.length) {
                        resetTimer();
                        stopTimer();
                    }else{
                        resetTimer();
                        startTimer();
                    }
                }
                , 1000);

                // options is selected
                // check that userAnswer is matching to possible_asnwer
                // if not match the give feedback/error
                // if(input.toLocaleLowerCase() === questions[currentQuestionIndex]?.possible_answer.toLocaleLowerCase()){
                //     const feedback = `FEEDBACK: Well done you are doing good \n ///////////////////////////// -Feedback ended- /////////////////////////////////////`
                //     setVisibleMessages((prev) => [
                //         ...prev,
                //         `${questions[currentQuestionIndex].question}`,
                //         `$ ${input}`
                //     ]);
                //     // moveToNextQuestion();
                //     // resetTimer();

                //     setDisplayedText("");
                //     setMessageToRenderWordByWord(feedback);
                //     stopTimer(); // timer should be stop untill feedback doesnot completly typed(or untill move to next question)

                //     setTimeout(() => {
                //         setVisibleMessages((prev) => [
                //             ...prev,
                //             feedback
                //         ]);

                //         moveToNextQuestion();
                //         // reset the on going time for currently asked question
                //         setTotalRunningTime((prevTime) => prevTime + time);

                //         if (currentQuestionIndex + 1 === questions.length) {
                //             console.log("currentQuestionIndex", currentQuestionIndex)
                //             resetTimer();
                //             stopTimer();
                //         }else{
                //             resetTimer();
                //             console.log("start form here", 271)
                //             startTimer();
                //         }
                //     }
                //     , 1000);
                // }else{
                //     const feedback = `FEEDBACK: Others who use this device won’t see your activity, so you can browse more privately. This won't change how data is collected by websites that you visit and the services that they use, \n ///////////////////////////// -Feedback ended- /////////////////////////////////////`
                //     setVisibleMessages((prev) => [
                //         ...prev,
                //         `${questions[currentQuestionIndex]?.question}`,
                //         `$ ${input}`
                //     ]);
                //     setDisplayedText("");
                //     setMessageToRenderWordByWord(feedback);
                //     stopTimer(); // timer should be stop untill feedback doesnot completly typed(or untill move to next question)

                //     setTimeout(() => {
                //         setVisibleMessages((prev) => [
                //             ...prev,
                //             feedback
                //         ]);

                //         moveToNextQuestion();
                //         // reset the on going time for currently asked question
                //         setTotalRunningTime((prevTime) => prevTime + time);

                //         if (currentQuestionIndex + 1 === questions.length) {
                //             console.log("currentQuestionIndex", currentQuestionIndex)
                //             resetTimer();
                //             stopTimer();
                //         }else{
                //             resetTimer();
                //             console.log("start form here", 271)
                //             startTimer();
                //         }
                       
                //     }
                //     , 2000);
                // }
            }else{
                setVisibleMessages((prev) => [
                    ...prev,
                    `${questions[currentQuestionIndex].question}`,
                    `$ ${input}`
                ]);
                if(questions[currentQuestionIndex]?.type_check === 'name'){
                    setUserDetails((prevState) => ({...prevState, name: input}))
                }
                moveToNextQuestion();
            }

            updateTheAnswerState();
           
        }
    };

    const scrollToBottom = () => {
        if (terminalExecutedContainerRef.current) {
            terminalExecutedContainerRef.current.scrollTo({
                top: terminalExecutedContainerRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [visibleMessages.length]);



    const handleSelectedQuizType = async (type: string) => {
        if(userDetails?.name && userDetails?.email){
            await createUser(userDetails);
        }
        
        const isQuizCompleted = getFromStoragePartial(type, 'isQuizCompleted', false);
        if (isQuizCompleted) {
            setIsChatCompleted(true);
            setToStoragePartial(selectedOption, 'isQuizCompleted', true);
            setSelectedUserPreference(type);
        } else {
            handleAddNewTerminal();
            let apiResponse = await getQuestions(type);
            apiResponse = await apiResponse?.json() || [];
            console.log("apiResponse---------", apiResponse)
            //  apiResponse = [
            //     {
            //         question_id: 'r-1',
            //         question: 'What is the capital of Rajasthan?',
            //         possible_answer: 'Jaipur'
            //     },
            //     {
            //         question_id: 'r-2',
            //         question: 'What is the official language of Rajasthan?',
            //         possible_answer: 'Rajasthani'
            //     },
            //     {
            //         question_id: 'r-3',
            //         question: 'Which Rajput emperor is credited with building many forts in Rajasthan, including Chittorgarh?',
            //         possible_answer: 'Maharan Kumbha'
            //     },
            //     {
            //         question_id: 'r-4',
            //         question: 'Which is the largest artificial lake in Rajasthan?',
            //         possible_answer: 'Jaisamand Lake'
            //     },
            // ]
            apiResponse.map((_question) => ({ ..._question, userAnswer: undefined }));
            setSelectedOption(type);
            setSelectedUserPreference(type);
            // setting the userPreference to user-object also so when user start once gaine so he know could know about his last qui also
            setToStoragePartial('user', 'userPreference', type);
            // setToStorage('userPreference', type);
            setToStoragePartial(type, 'userPreference', type);
            // setToStorage('visibleMessages', []);
            setToStoragePartial(type, 'visibleMessages', []);

            // make empty terminal to show new question now
            setVisibleMessages([]);
            setQuestions(apiResponse);
            // setToStorage('questions', apiResponse);
            setToStoragePartial(type, 'questions', apiResponse);

            setAnswers(apiResponse);
            setCurrentQuestionIndex(0);

            // show actions(submit/skip) if options is selected
            setShowActions(true);


            // start timer for eachquestion
            console.log("start form here", 344)
            startTimer();
        }
    }




    const handleActionClick = (ActionType: string) => {
        if(ActionType === 'submit'){
            setTotalRunningTime(0);
            setIsChatCompleted(true);
            setToStoragePartial(selectedOption, 'isQuizCompleted', true);
            
        }else if(ActionType === 'skip'){
            if(currentQuestionIndex === questions.length){
                setIsChatCompleted(true);
                setToStoragePartial(selectedOption, 'isQuizCompleted', true);
                setTotalRunningTime(0);
            }
            setVisibleMessages((prev) => [
                ...prev,
                `${questions[currentQuestionIndex]?.question}`,
            ]);
            
            // chnage the answer state
            updateTheAnswerState();

            // go to next question
            moveToNextQuestion();
            setTotalRunningTime((prevTime) => prevTime + time)

        }
       
    }


    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            
             // Allow normal behavior if typing in an input or textarea
            const activeTag = document.activeElement?.tagName;
            if (activeTag === "INPUT" || activeTag === "TEXTAREA") {
                return;
            }
            
            if (event.key === "ArrowLeft") {
                setHoveredSelectionOption('quiz-1');
                event.preventDefault();
            } else if (event.key === "ArrowRight") {
                setHoveredSelectionOption('quiz-2');
                event.preventDefault();
            }
            // else if (event.key === "Enter") {
            //     console.log("hoveredSelectionOption", hoveredSelectionOption)
            //     if(hoveredSelectionOption){
            //         handleSelectedQuizType('quiz-1')    
            //     }
               
            // }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };

    }, [showSelectionOptions]);





    // working for TERMINAL-2
    // after select option(quiz/quiz-2) new terminal open for hints/suggestion interaction 
    useEffect(() => {
        // set the hints for terminal-2, currsponding to the terminal-1's question
        if (selectedOption && currentQuestionIndex !== null) {
            // get the question-id and set currsponding hints
            const terminal1QuestionId = questions[currentQuestionIndex]?.id;

            if (terminal1QuestionId) {
                setTerminal2Hints(defaultHints[terminal1QuestionId]);
            }

        }
    }, [currentQuestionIndex, selectedOption])


    // select the suggestion by up and down arrow 
    const slectetSuggestionOnKeyDown=(e: React.KeyboardEvent<HTMLInputElement>) => {
        console.log("check------------------")
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          setTerminal2HighlitedSuggestionIndex((prev) =>
            prev < terminal2SuggestionsList.length - 1 ? prev + 1 : 0
          )
        } else if (e.key === 'ArrowUp') {
          e.preventDefault()
          setTerminal2HighlitedSuggestionIndex((prev) =>
            prev > 0 ? prev - 1 : terminal2SuggestionsList.length - 1
          )
        } 
        else if (e.key === 'Enter') {
          if (terminal2HighlitedSuggestionIndex >= 0) {
            const selected = terminal2SuggestionsList[terminal2HighlitedSuggestionIndex]
            setTerminal2Input(selected.command)
            setShowTerminal2InputSuggestionList(false)
          } else {
            handleKeyDownTerminal2(e) // your existing logic
          }
        }
      }


    // hint based question's answers
    const handleKeyDownTerminal2 = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && terminal2Input.trim() && terminal2Hints[terminal2CurrentHintIndex]) {
            // setting the visble list of hints [with hint question and user answer of hints]
            setTerminal2visibleMessages((prev) => [
                ...prev,
                `${terminal2Hints[terminal2CurrentHintIndex]?.hint_question_questions}`,
                `$ ${terminal2Input}`
            ]);


            setTerminal2Input("");

            // to get second hint based question after first answer submited
            if (terminal2Hints.length > terminal2CurrentHintIndex) {
                setTerminal2CurrentHintIndex((prev) => prev + 1);
            }
        }

        // slectetSuggestionOnKeyDown(e)
    };


    // word by word for terminal-2
    useEffect(() => {
        if (terminal2CurrentHintIndex < terminal2Hints?.length) {
            let message = terminal2Hints[terminal2CurrentHintIndex]?.hint_question_questions?.trim();
            setTerminal2MessageToRenderWordByWord(message);
            setTerminal2DisplayedText("")
            // message = message[0]+message;
            // setTerminal2DisplayedText("");
            // // let hasSelectionQuestion = false;
            // // if (message === "Choose option to select") {
            // //     hasSelectionQuestion = true;
            // // }

            // let i = 0;
            // const interval = setInterval(() => {
            //     if (i < message.length - 1) {
            //         setTerminal2DisplayedText((prev) => prev + message[i]);
            //         i++;
            //     } else {
            //         // if (hasSelectionQuestion) {
            //         //     setShowSelectionOptions(true);
            //         // }
            //         clearInterval(interval);
            //     }
            // }, 10);
        }
    }, [terminal2CurrentHintIndex, terminal2Hints?.length]);

    const fetchSuggestionCommnads = async() =>{
        const queryBody = {
            quizId: selectedOption,
            query: terminal2Input,
        }
       let suggestionResponse = await getSuggestions(queryBody);
       suggestionResponse = await suggestionResponse?.json();
       console.log("suggestionResponse", suggestionResponse)

    //    const matchSuggestions = suggestionCommands.filter((_command) => _command.command.toLocaleLowerCase().includes(terminal2Input.toLocaleLowerCase()));
       setTerminal2SuggestionsList(suggestionResponse);
    }

    useEffect(() => {
        const timerId = setTimeout(fetchSuggestionCommnads, 300);
        return () => {
            clearInterval(timerId)
        }
    }, [terminal2Input])
    




    useEffect(() => {
      if(visibleMessages.length){
        //  setToStorage('visibleMessages', visibleMessages)
         setToStoragePartial(selectedOption, 'visibleMessages', visibleMessages);
      }
    }, [visibleMessages]);

    useEffect(() => {
        if(currentQuestionIndex !=null){
        //    setToStorage('currentQuestionIndex', currentQuestionIndex)
           setToStoragePartial(selectedOption, 'currentQuestionIndex', currentQuestionIndex);
        }
      }, [currentQuestionIndex]);

    useEffect(() => {
        if(totalRunningTime){
        //    setToStorage('totalRunningTime', totalRunningTime)
           setToStoragePartial(selectedOption, 'totalRunningTime', totalRunningTime);
        }
    }, [totalRunningTime]);

    useEffect(() => {
        const existingTotalRunningTime = getFromStoragePartial(selectedOption, 'totalRunningTime', 0);
        if(existingTotalRunningTime){
        //    TODO: timer did not restart when user forcefuly reload the page
            startTimer();
        }
      }, []);

    useEffect(() => {
        const isQuizCompleted = getFromStoragePartial(selectedOption, 'isQuizCompleted', false);
        const userDetails = getFromStoragePartial('user', 'visibleMessages', []);
        
        if(isQuizCompleted){
            setVisibleMessages(userDetails);
            setSelectedOption('');
            setShowActions(false);
            setQuestions(predefinedMessages);
            setCurrentQuestionIndex(2);
            setIsTerminal2Visible(false);
        }
    }, [])
    

    

    return (
        <div className="w-full relative h-full border-red-500">
            <div
                className={`transition-all duration-500 h-full mr-2 ${IsTerminal2Visible ? 'w-1/2 border-r-4 border-white' : 'w-full'}`}
            >
                <div className="bg-gray-900 text-green-400 py-4 font-mono mx-auto rounded-md shadow-lg relative flex flex-col h-full">
                    <button
                        className="absolute right-1 top-1 border-red-100 hover:border py-[3px] px-[10px] rounded-full"
                        onClick={handleAddNewTerminal}
                    >
                        {IsTerminal2Visible ? "-" : "+"}
                    </button>

                    {
                        selectedOption && <div className="pl-4 pr-10">
                        <div className="flex items-center space-x-4 p-2 mx-12 dark:text-white">
                         
                          <div className=" px-2 py-1">
                            Question: {currentQuestionIndex}/{questions.length}
                          </div>
                      
                          <div className="flex-1">
                            <Progress value={getPrecentageFromValue(currentQuestionIndex, questions.length)} colorClass="bg-green-500"/>
                          </div>
                      
                          <div className="whitespace-nowrap">{getPrecentageFromValue(currentQuestionIndex, questions.length)}%</div>
                          <div className="whitespace-nowrap">{convertSecondsToTime(totalRunningTime)}</div>
                        </div>

    
                      </div>
                    }

                    <div
                        ref={terminalExecutedContainerRef}
                        className="px-4 min-h-56 overflow-y-scroll mb-4 leading-8 flex-grow"
                    >
                        {visibleMessages.map((msg, index) => (
                            <p key={index} className="mb-1  whitespace-pre">{msg}</p>
                        ))}

                        {/* Displaying current question being typed */}
                        {currentQuestionIndex < questions.length && (
                            <p className="mb-1 whitespace-pre">{displayedText}</p>
                        )}

                        {
                            !selectedOption && showSelectionOptions && <div className="my-4 leading-6">
                                {
                                  quizOptions.length ?   quizOptions.map((_quiz, index: number) => {
                                        return <React.Fragment>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => handleSelectedQuizType(_quiz?.id)}
                                                className={`bg-gray-800 w-auto hover:bg-gray-700 ${hoveredSelectionOption === 'quiz-1' ? 'bg-gray-700 text-green-400' : ''} hover:text-green-400 py-2 h-8 px-4 font-mono text-green-400 border-green-400 cursor-pointer`}
                                            >
                                                {_quiz?.category}
                                            </Button>

                                            &nbsp;
                                            &nbsp;

                                        </React.Fragment>
                                    })
                                : null
                                }
                               
                                {/* &nbsp;
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleSelectedQuizType('quiz-2')}
                                    className={`bg-gray-800 hover:bg-gray-700 hover:text-green-400 ${hoveredSelectionOption === 'quiz-2' ? 'bg-gray-700 text-green-400' : ''} py-2 h-8 px-10 font-mono text-green-400 border-green-400 break-normal cursor-pointer`}
                                >
                                    Quiz 2
                                </Button> */}
                            </div>
                        }
                    </div>



                    {/* Input field to get user response */}
                    <div className="px-4 py-2 w-full">
                        <div className="flex items-center">
                            <span className="text-green-400">$</span>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleEnterKeyDown}
                                className="bg-transparent text-green-400 border-none focus:outline-none ml-2 w-full"
                                placeholder="Enter your response..."
                                autoFocus
                            />
                            {
                                selectedOption && <>
                                <span><img width={45} height={45} src={ClockIcon} alt="icon"/></span> 
                                <span>{convertSecondsToTime(time)}</span>
                                </>
                            }
                        </div>

                        {/* Action buttons to skip and submit quiz */}
                        {       
                            showActions && <div className="mt-2 leading-6">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleActionClick('submit')}
                                    className={`py-2 px-10 h-8 font-mono border transition-colors duration-200 ${
                                        isButtonDisable(currentQuestionIndex, questions.length)
                                          ? "bg-gray-800 border-gray-400 text-gray-300 cursor-not-allowed"
                                          : "bg-gray-800 border-green-400 text-green-400 hover:bg-gray-700 text-green-400 cursor-pointer"
                                      }`}
                                    disabled={isButtonDisable(currentQuestionIndex, questions.length)}
                                >
                                    Submit
                                </Button>
                                &nbsp;
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleActionClick('skip')}
                                    className={`bg-gray-800 hover:bg-gray-700 py-2 h-8 px-10 font-mono text-green-400 border-green-400 cursor-pointer`}
                                >
                                    Skip
                                </Button>
                            </div>
                        }
                    </div>
                </div>
            </div>



            {/* TERMINAL-2 */}

            {IsTerminal2Visible && (
                <div className={`absolute top-0 right-0 ml-2 transition-all duration-500 h-full w-1/2`} style={{ animation: IsTerminal2Visible ? 'growBox 0.5s forwards' : '' }}>
                    <div className="bg-gray-900 text-green-400 py-4 font-mono  mx-auto rounded-md shadow-lg relative flex flex-col h-full">
                        <div
                            ref={terminalExecutedContainerRef}
                            className="px-4 min-h-56 overflow-y-scroll mb-4 leading-6 flex-grow"
                        >

                            {terminal2visibleMessages.map((msg, index) => (
                                <p key={index} className="mb-1">{msg}</p>
                            ))}

                            {/* Displaying current question being typed */}
                            {terminal2CurrentHintIndex < terminal2Hints?.length && (
                                <p className="mb-1 whitespace-pre">{terminal2DisplayedText}</p>
                            )}

                            {/* <div className="render_markdown">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {markdownTableResponse.content}
                            </ReactMarkdown>
                            </div> */}
                        </div>

                        




                       {/* terminal-2 footer-section */}
                        <div className="relative w-full">
                            {
                                showTerminal2InputSuggestionList && <ul className="absolute bottom-12 left-0 w-full px-4 py-2 bg-gray-600">
                                    {
                                        terminal2SuggestionsList.map((_command, index) => {
                                            const isSelected = index === terminal2HighlitedSuggestionIndex
                                            return ( <li
                                                key={_command.command_id}
                                                className={`cursor-pointer px-2 py-1 ${
                                                  isSelected ? "text-white" : "hover:text-white"
                                                }`}
                                                onMouseDown={() => {
                                                  setTerminal2Input(_command.command)
                                                  setShowTerminal2InputSuggestionList(false)
                                                }}
                                              >
                                                {_command.command}
                                              </li>)
                                        })
                                    }
                                </ul>
                            }
                            
                            {/* Input field for user response after question is done typing */}
                            {(
                                <div className="flex items-center px-4 py-2 w-full">
                                    <span className="text-green-400">$</span>
                                    <input
                                        type="text"
                                        value={terminal2Input}
                                        onChange={(e) => setTerminal2Input(e.target.value)}
                                        onKeyDown={handleKeyDownTerminal2}
                                        className="bg-transparent text-green-400 border-none focus:outline-none ml-2 w-full"
                                        placeholder="Enter your suggestion..."
                                        // autoFocus
                                        onFocus={() => setShowTerminal2InputSuggestionList(true)}
                                        onBlur={() => setTimeout(() => {
                                            setShowTerminal2InputSuggestionList(false)
                                            // setHighlightedIndex(-1)
                                        }, 100)}
                                        // onKeyDown={slectetSuggestionOnKeyDown}
                                    />
                                </div>
                            )}
                        </div>
                        
                    </div>
                </div>
            )}

        </div>
    );
};

export default Terminal;
