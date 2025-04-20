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
  const [summaryAudioUrl, setSummaryAudioUrl] = useState<string | null>(null)
  const [pageNumber, setPageNumber] = useState<number | ''>('') // top of component
  const [originalAudioUrl, setOriginalAudioUrl] = useState<string | null>(null)






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
      {summary && <ResultCard summary={summary} quiz={quiz} />}

      {originalAudioUrl && (
        <div className="mt-6 w-full max-w-xl">
          <h4 className="text-lg font-semibold mb-2">📄 Listen to Original Page</h4>
          <audio controls className="w-full rounded-lg shadow" src={`http://localhost:5000${originalAudioUrl}`} />
        </div>
      )}

      {summaryAudioUrl && (
        <div className="mt-4 w-full max-w-xl">
          <h4 className="text-lg font-semibold mb-2">🎧 Listen to the Summary</h4>
          <audio controls className="w-full rounded-lg shadow" src={`http://localhost:5000${audioUrl}`} />
        </div>
      )}


    </div>
  )
}

export default FileUpload
