import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import { Button } from "../../components/Button";
import { useNavigate } from "react-router-dom";



const HeaderSection = () => (
    <div className="mb-4">
        <h2 className="text-3xl font-bold flex items-center gap-2 mb-4">
            <span>〢</span> Want to Race with the Sherlock AI?
        </h2>
        <p className="">
            See how you stack up against our AI SRE by trying to determine root cause for real-world k8s incidents.
        </p>
    </div>
);



interface StepItemProps {
    stepNumber: number;
    text: string;
    completed?: boolean;
}

const StepItem: React.FC<StepItemProps> = ({ stepNumber, text, completed }) => (
    <div className="flex items-start space-x-3 mb-4 mx-4">
        <div className={`w-6 h-6 flex items-center justify-center rounded-full border ${completed ? 'bg-gray-800 text-white' : 'border-gray-400 text-gray-400'}`}>
            {completed ? '✓' : stepNumber}
        </div>
        <p className="">{text}</p>
    </div>
);



const StepsSection = () => (
    <div className="w-full ">
        <h4 className="font-semibold mb-4">Here's how it works:</h4>
        <StepItem stepNumber={1} text="Enter your info (all optional)" />
        <StepItem stepNumber={2} text="Determine root cause in 3 scenarios" />
        <StepItem stepNumber={3} text="Get your score and join the leaderboard!" completed />
    </div>
);



const TerminalSection = () => {

    const content = `$ kubectl get pods
    NAME    READY   STATUS    RESTARTS   AGE
    dev     1/1     Running   0          20h
    prod    1/1     Running   0          25h`;

    return (
        <div className="">
            <h4 className="font-semibold mb-0  pt-4 mb-4">You can run `kubectl` commands and you'll get a response:</h4>
            <div className="flex gap-4 items-center mx-4">

                {/* <div className="bg-gray-800 p-4 font-mono whitespace-pre-wrap rounded-md ">
                    <div className=" font-mono rounded-md overflow-x-auto">
                        <pre className="whitespace-pre">{content}</pre>
                    </div>
                </div> */}


                <div className="bg-gray-800 p-4 font-mono whitespace-pre-wrap rounded-md ">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {content}
                    </ReactMarkdown>
                </div>

            </div>

        </div>
    )
};



const ResultSection = () => (
    <div>
        <h4 className="font-semibold mb-2">Submit your root cause and get a score</h4>
        <div className="p-4 bg-gray-800 p-4 font-mono whitespace-pre-wrap rounded-md mx-4">

            {`$ pods are in crashloopbackoff because they're missing the secret for the docker registry!
  Grade: Incorrect! Time to resolution: 5 min`}
        </div>
    </div>
);



const HomePage = () => {

    const navigate = useNavigate();
    const handleGoToTerminal = () => {
        navigate('/terminal')
    }
    return (
        <>
            <div className="p-10 max-w-full h-full bg-gray-900 text-green-400 shadow-md text-lg">
                <HeaderSection />
                <div className="mx-4">
                    <StepsSection />
                    <div className=" border-gray-600 outline-dotted my-4 mb-8"></div>
                    <TerminalSection />
                    <div className=" border-gray-600 outline-dotted w-full mt-10 mb-16"></div>
                    <ResultSection />


                    <div className="w-full mx-10 my-14 px-auto p-4 flex justify-center">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleGoToTerminal()}
                            className={`bg-gray-800 hover:bg-gray-700 hover:text-white h-14 w-60 px-20 font-mono text-green-400 border-green-400 cursor-pointer`}
                        >
                            Go to Terminal
                        </Button>
                    </div>
                </div>

            </div>

        </>
    );
};


export default HomePage;
