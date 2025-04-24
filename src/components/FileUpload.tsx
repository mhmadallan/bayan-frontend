import React, { useState, useRef, useEffect } from 'react'
import ResultCard from './ResultCard'
import readingSVG from '../assets/undraw_reading-a-book_4cap.svg'
import { FaFilePdf } from 'react-icons/fa'
import axios from 'axios'

const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState<string | null>(null)
  const [quiz, setQuiz] = useState<string[]>([])
  const [summaryAudioUrl, setSummaryAudioUrl] = useState<string | null>(null)
  const [pageNumber, setPageNumber] = useState<number | ''>('') // top of component
  const [originalAudioUrl, setOriginalAudioUrl] = useState<string | null>(null)
  const originalAudioRef = useRef<HTMLAudioElement>(null)
  const summaryAudioRef = useRef<HTMLAudioElement>(null)
  const [showQuiz, setShowQuiz] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [feedback, setFeedback] = useState("")
  const [score, setScore] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([])
  const [quizRecords, setQuizRecords] = useState<
    { question: string; answer: string; feedback: string }[]
  >([])




  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile)
      setSummary(null)
      setQuiz([])
      setSummaryAudioUrl(null)
      setOriginalAudioUrl(null)
    } else {
      alert('Please upload a valid PDF file.')
    }
  }

  const handleAnalyze = async () => {
    if (!file || !pageNumber) {
      alert('Please select a file and page number.')
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('pdf', file)
      formData.append('pageNumber', pageNumber.toString()) // ✅ send page number

      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      const { summary, quiz, summaryAudioUrl, originalAudioUrl } = response.data
      setSummary(summary)
      setQuiz(quiz)
      setSummaryAudioUrl(summaryAudioUrl || null)
      setOriginalAudioUrl(originalAudioUrl || null)


    } catch (err) {
      console.error('Error:', err)
      alert('Something went wrong while analyzing the PDF.')
    } finally {
      setLoading(false)
    }
  }

  const handleExportPDF = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/export-quiz', {
        bookTitle: file?.name || 'Book',
        pageNumber,
        quizData: quizRecords,
      })

      const downloadUrl = response.data.downloadUrl
      window.open(`http://localhost:5000${downloadUrl}`, '_blank')
    } catch (err) {
      console.error('PDF export error:', err)
      alert('Failed to export quiz to PDF.')
    }
  }




  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 px-4">

      {/* 👋 Hero Section */}
      <div className="text-center mb-6 max-w-xl">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-2">
          Welcome to Bayan 📘
        </h1>
        <p className="text-gray-600 text-base md:text-lg">
          Your AI-powered study companion. Upload a PDF, and let Bayan help you understand it with summaries, quizzes, and clarity.
        </p>
      </div>

      {/* Illustration */}
      <img
        src={readingSVG}
        alt="Reading Illustration"
        className="w-36 md:w-48 mb-6 opacity-90"
      />

      {/* Upload Card */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-xl transition-all">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">
          Upload a PDF Book
        </h2>

        <label className="block mb-4">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </label>

        {file && (
          <div className="flex items-center gap-2 bg-gray-100 text-sm text-gray-700 p-3 rounded mt-2">
            <FaFilePdf className="text-red-500" />
            <span>
              <strong>Selected:</strong> {file.name}
            </span>
          </div>
        )}
        <div className="mt-4">
          <label htmlFor="pageNumber" className="block text-sm text-gray-700 mb-1">📄 Page Number</label>
          <input
            type="number"
            id="pageNumber"
            min="1"
            value={pageNumber}
            onChange={(e) => setPageNumber(e.target.value ? parseInt(e.target.value) : '')}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            placeholder="e.g. 5"
          />
        </div>


        <button
          disabled={!file || loading}
          onClick={handleAnalyze}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md disabled:opacity-50 flex justify-center items-center gap-2 transition duration-200"
        >
          {loading && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>

      {/* Result Section */}
      {summary && (
        <>
          <ResultCard summary={summary} quiz={[]} />
          <button
            onClick={() => {
              setShowQuiz(!showQuiz)
              setCurrentQuestionIndex(0)
              setUserAnswer("")
              setFeedback("")
              setScore(0)
              setAnsweredQuestions(new Array(quiz.length).fill(false)) // Track which were answered
            }}
            className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md shadow transition"
          >
            {showQuiz ? '🙈 Hide Quiz' : '📝 Show Quiz'}
          </button>
        </>
      )}
      {showQuiz && quiz.length > 0 && (
        <div className="mt-4 bg-white p-6 rounded-xl shadow max-w-xl w-full text-center space-y-4">
          <h3 className="text-lg font-semibold text-blue-800">
            Quiz Question {currentQuestionIndex + 1} of {quiz.length}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            🎯 Score: {score} / {quiz.length}
          </p>
          <p className="text-gray-700 text-base">{quiz[currentQuestionIndex]}</p>

          <textarea
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            rows={3}
            placeholder="Type your answer..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-blue-500"
          />

          <button
            onClick={async () => {
              try {
                const res = await axios.post('http://localhost:5000/api/quiz-feedback', {
                  question: quiz[currentQuestionIndex],
                  answer: userAnswer,
                })

                const feedbackText = res.data.feedback
                setFeedback(feedbackText)

                // Update score logic...
                if (!answeredQuestions[currentQuestionIndex] && feedbackText.includes("✅")) {
                  setScore((prev) => prev + 1)
                  const updated = [...answeredQuestions]
                  updated[currentQuestionIndex] = true
                  setAnsweredQuestions(updated)
                }

                // Save this QA to the export list
                const record = {
                  question: quiz[currentQuestionIndex],
                  answer: userAnswer,
                  feedback: feedbackText,
                }

                // Prevent duplicates if rechecking
                const updatedRecords = [...quizRecords]
                updatedRecords[currentQuestionIndex] = record
                setQuizRecords(updatedRecords)

              } catch (err) {
                console.error(err)
                setFeedback("Error checking answer.")
              }
            }}


            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
          >
            ✅ Check Answer
          </button>

          {feedback && (
            <div className="text-sm text-gray-700 font-medium bg-gray-100 p-3 rounded-md">
              🧠 Feedback: {feedback}
            </div>
          )}

          <div className="flex justify-between mt-4">
            <button
              onClick={() => {
                setCurrentQuestionIndex(prev => Math.max(0, prev - 1))
                setFeedback("")
                setUserAnswer("")
              }}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded disabled:opacity-50"
            >
              ⬅️ Previous
            </button>

            <button
              onClick={() => {
                setCurrentQuestionIndex(prev => Math.min(quiz.length - 1, prev + 1))
                setFeedback("")
                setUserAnswer("")
              }}
              disabled={currentQuestionIndex === quiz.length - 1}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              Next ➡️
            </button>
          </div>
          {currentQuestionIndex === quiz.length - 1 && (
            <button
              onClick={handleExportPDF}
              className="mt-6 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
            >
              📄 Download Quiz Report as PDF
            </button>
          )}

        </div>
      )}



      {originalAudioUrl && (
        <div className="mt-6 w-full max-w-xl bg-white rounded-lg shadow p-6 space-y-4 text-center">
          <h4 className="text-xl font-semibold text-blue-800">♠️ Page Reader</h4>

          {/* The link opens the audio in a new tab where browser controls appear */}
          <a
            href={`http://localhost:5000${originalAudioUrl}`}
            download="original-audio.mp3"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-md shadow-md transition"
          >
            ▶️ Open & Download MP3
          </a>

          {/* Optional hidden player in case you still want to preload */}
          <audio
            ref={originalAudioRef}
            src={`http://localhost:5000${originalAudioUrl}`}
            preload="metadata"
            className="hidden"
          />
        </div>
      )}


      {summaryAudioUrl && (
        <div className="mt-6 w-full max-w-xl bg-white rounded-lg shadow p-6 space-y-4 text-center">
          <h4 className="text-xl font-semibold text-blue-800">♣️ Summary Reader</h4>

          {/* The link opens the audio in a new tab where browser controls appear */}
          <a
            href={`http://localhost:5000${summaryAudioUrl}`}
            download="summary-audio.mp3"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-medium px-6 py-2 rounded-md shadow-md transition"
          >
            ▶️ Open & Download MP3
          </a>

          {/* Optional hidden player in case you still want to preload */}
          <audio
            ref={summaryAudioRef}
            src={`http://localhost:5000${summaryAudioUrl}`}
            preload="metadata"
            className="hidden"
          />
        </div>
      )}

    </div>
  )
}

export default FileUpload
