import React from 'react'
import { FaBookOpen, FaQuestionCircle, FaLightbulb, FaCheckCircle } from 'react-icons/fa'


type Props = {
    summary: string
    quiz: string[]
}

const ResultCard = ({ summary, quiz }: Props) => {
    return (
        <div className="bg-white mt-8 p-6 rounded-xl shadow-lg space-y-6">
            <div>
                <h3 className="flex items-center text-xl font-semibold text-blue-700 mb-2">
                    <FaBookOpen className="mr-2 text-blue-500" />
                    <FaLightbulb className="mr-2 text-yellow-400" />
                    Summary
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">{summary}</p>
            </div>

            <div>
                <h3 className="flex items-center text-xl font-semibold text-green-700 mb-2">
                    <FaQuestionCircle className="mr-2 text-green-500" />
                    Quiz Questions
                </h3>
                <ul className="list-none pl-2 text-gray-800 text-sm space-y-2">
                    {quiz.map((q, i) => (
                        <li key={i} className="flex items-start gap-2">
                            <FaCheckCircle className="text-green-500 mt-1" />
                            <span>{q}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default ResultCard
