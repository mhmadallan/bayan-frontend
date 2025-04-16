import React from 'react'
import Header from './components/Header'
import FileUpload from './components/FileUpload'
import Footer from './components/Footer'
import './App.css'

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-3xl mx-auto p-4">
        <FileUpload />
      </main>
      <Footer />
    </div>
  )
}

export default App
