import { useEffect, useState } from 'react'
import TerminalTable from './components/TerminalTable';
import Terminal from './components/Terminal';
import './terminal.css';


import { getFromStorage, setToStorage } from '../../lib/utils';


const ascii = `
                                                              @@@@@@
                                                          @@@@@@@@@@@@@@@@
                                                      @@@@@@@@    @@@@@@@
                                                    @@@@@@@           
                                                  @@@@@@  
                                                @@@@@             
                                              @@@@@                 
                                            @@@@@@                  
                                          @@@@@@                   
                                         @@@@@@                    
                                        @@@@@@                     
                                      @@@@@@@@                     
                                     @@@@@@@@@                      
                                    @@@@@@@@@@                      
                                   @@@@@@@@@@@                       
                @@@@@@@@@         @@@@@@@@@@@                       
             @@@@@@@@@@@@        @@@@@@@@@@@                        
           @@@@@@@@@@@@@@       @@@@@@@@@@@                          
          @@@@@@@@@@@@@@@      @@@@@@@@@@@                           
          @@@@@@@@@@@@@@@     @@@@@@@@@@@
            @@@@@@@@@@@@@     @@@@@@@@@
              @@@@@@@@@@@     @@@@@@@@
                @@@@@@@@@@@@@@@@@@@@
                  @@@@@@@@@@@@@@@@
                   @@@@@@@@@@@@@@
                       @@@@@@@
  `;

export default function TerminalPage() {
    const [isChatCompleted, setIsChatCompleted] = useState<boolean>(false);
    const [quizDetails, setQuizDetails] = useState([]);

    useEffect(() => {
      const existing = getFromStorage('quizDetails', []);
      console.log("checking 00000000", existing)
      if(existing.length){
        setQuizDetails(existing);
        setIsChatCompleted(true);
      }
    }, []);

    useEffect(() => {
        if (quizDetails.length > 0) {
            console.log("checking", quizDetails)
            setToStorage('quizDetails', quizDetails);
        }
    }, [quizDetails]);

    return (
        <div className="bg-gray-900 h-dvh mx-10">
            {
                isChatCompleted ?
                    <>
                        {/* <Results /> */}
                        <TerminalTable data={quizDetails} />

                        &nbsp;
                        &nbsp;

                        <pre className="font-mono text-[6px] leading-none text-green-400 whitespace-pre">{ascii}</pre>


                    </>
                    :
                    <Terminal
                        setIsChatCompleted={setIsChatCompleted}
                        setQuizDetails={setQuizDetails}
                    />
            }
        </div>

    )
}
