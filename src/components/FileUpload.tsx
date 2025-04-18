import React, { useState } from 'react'
import ResultCard from './ResultCard'
import readingSVG from '../assets/undraw_reading-a-book_4cap.svg'
import { FaFilePdf } from 'react-icons/fa'
import axios from 'axios'

const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState<string | null>(null)
  const [quiz, setQuiz] = useState<string[]>([])
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
 
  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile)
      setSummary(null)
      setQuiz([])
      setAudioUrl(null)
    } else {
      alert('Please upload a valid PDF file.')
    }
  }

  const handleAnalyze = async () => {
    if (!file) return

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('pdf', file)

      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      const { summary, quiz } = response.data

      setSummary(summary)
      setQuiz(quiz)
      setAudioUrl(response.data.audioUrl)

    } catch (err) {
      console.error('Error:', err)
      alert('Something went wrong while analyzing the PDF.')
    } finally {
      setLoading(false)
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
      {summary && <ResultCard summary={summary} quiz={quiz} />}

      {audioUrl && (
  <div className="mt-4">
    <h4 className="text-lg font-medium mb-1">🎧 Listen to the Summary</h4>
    <audio controls src={`http://localhost:5000${audioUrl}`} className="w-full rounded-md" />
  </div>
)}

    </div>
  )
}

export default FileUpload
