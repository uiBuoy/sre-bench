import { useEffect, useState } from 'react'
import TerminalTable from './components/TerminalTable';
import Terminal from './components/Terminal';
import './terminal.css';


import { getFromStorage, getFromStoragePartial, setToStorage } from '../../lib/utils';


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
  const [selectedUserPreference, setSelectedUserPreference] = useState<string>(getFromStoragePartial('user', 'userPreference', ''));
  const [isChatCompleted, setIsChatCompleted] = useState<boolean>(getFromStoragePartial(selectedUserPreference, 'isQuizCompleted', false));
  const newQuizDetails = getFromStoragePartial(selectedUserPreference, 'answer', []);

  const [showFinalResult, setFinalResult] = useState(isChatCompleted);


  // useEffect(() => {
  //   console.log("check ||||||||||", isChatCompleted)
  //   setFinalResult(isChatCompleted)
  //   // if every thing is done 
  //   // once relaod the page 
  //   // select the userPrefrence which is already selected, 
  //   // what's why useEffect did not call render-once gain 
  // }, [isChatCompleted, selectedUserPreference])


  return (
    <div className="bg-gray-900 h-dvh px-4 pb-2">
      {
        isChatCompleted ?
          <>
            {/* <Results /> */}
            <TerminalTable
              data={newQuizDetails}
              handleBack={setIsChatCompleted}
              selectedUserPreference={selectedUserPreference}
            />

            &nbsp;
            &nbsp;

            <div className='flex justify-center'>
              <pre className="font-mono text-[6px] leading-none text-green-400 whitespace-pre">{ascii}</pre>
            </div>



          </>
          :
          <Terminal
            setIsChatCompleted={setIsChatCompleted}
            setSelectedUserPreference={setSelectedUserPreference}
            selectedUserPreference={selectedUserPreference}
          />
      }
    </div>

  )
}
