import { Button } from "../../../components/Button";
import { convertSecondsToTime } from "../../../lib/utils";
import React, { useState, useEffect } from "react";



const checkUserAnswerKeywordsIncludesInActualAnswer = (userAnser: string, actualAnswer: string) => {
    console.log("userAnser", userAnser)
    if (userAnser !="" && userAnser !=undefined && actualAnswer.trim().toLowerCase().includes(userAnser.trim().toLowerCase())){
        return '✅';
    }else{
        return '❌';
    }
}

const checkUserAnswerStatus = (userAnser: string, actualAnswer: string) => {
  return userAnser.trim().toLowerCase() === actualAnswer.trim().toLowerCase()? '✅' : '❌';
}


// TableRow component to render each row
type TableRowProps = {
    row: string[];
    isHighlighted: boolean; // Whether this row is selected or not
};

const TableRow: React.FC<TableRowProps> = ({ row, isHighlighted }) => {
    return (
        <tr className="border-t border-dashed border-gray-500">
            {row.map((value, index) => (
                <td
                    key={index}
                    className={`px-6 py-4 text-left text-sm font-mono border-r border-dashed border-gray-500 ${isHighlighted ? "text-red-500" : "text-green-400"
                        }`}
                >
                    {value}
                </td>
            ))}
        </tr>
    );
};

const TerminalTable: React.FC = ({ data, handleBack,  selectedUserPreference }) => {
    // Column headers
    const columns = ["Question Id", "Question", "Given Answer", "answer", "status", "time", "accuracy"];

    console.log("data", data)


    const newRow = data.map((_item) => {
        return [_item.question_id, _item.question, _item.userAnswer, 
            _item.possible_answer, checkUserAnswerKeywordsIncludesInActualAnswer(_item.userAnswer, _item.possible_answer), 
            convertSecondsToTime(_item?.time),  "99.98%"];
        
    })
    // Rows of data
    const rows = newRow;


    // State to track the selected row
    const [selectedRow, setSelectedRow] = useState<number>(0);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "ArrowDown") {
                setSelectedRow((prev) => Math.min(rows.length - 1, prev + 1)); // Move down
                event.preventDefault(); // Prevent page scrolling
            } else if (event.key === "ArrowUp") {
                setSelectedRow((prev) => Math.max(0, prev - 1)); // Move up
                event.preventDefault(); // Prevent page scrolling
            }
        };

        // Add event listener for keydown
        window.addEventListener("keydown", handleKeyDown);

        // Cleanup the event listener
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [rows.length]); // Dependency on rows.length to ensure we reattach event listener if rows change

    return (
        <div className="bg-gray-900 text-green-400 font-mono p-6 ">
            <h2 className="text-lg text-center mb-6 text-gray-100 font-bold">System Performance Metrics of {selectedUserPreference}</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse border-dashed border-2 border-gray-500 rounded-lg">
                    <thead className="bg-gray-800">
                        <tr className="border-b border-dashed border-gray-500">
                            {columns.map((col, index) => (
                                <th
                                    key={index}
                                    className="px-6 py-2 text-left text-sm text-gray-400 font-mono font-semibold uppercase tracking-wider"
                                >
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, index) => (
                            <TableRow
                                key={index}
                                row={row}
                                isHighlighted={index === selectedRow} // Highlight the selected row
                            />
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="text-center mt-6">
                <p className="text-gray-200">LEADERBOARD</p>
                <p className="text-gray-400">TOTAL ATTEMPT: {data.length}</p>
                <p className="text-gray-400">TOTAL TIME: {data.reduce((acc, curr) => acc+curr?.time, 0)}</p>
            </div>

            <div className="w-full text-center my-8">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleBack(false)}
                    className={`bg-gray-800 mx-auto hover:bg-gray-700 hover:text-white h-10 w-60 px-20 font-mono text-green-400 border-green-400 cursor-pointer`}
                >
                    Back to main screen
                </Button>
            </div>
           
        </div>
    );
};

export default TerminalTable;
