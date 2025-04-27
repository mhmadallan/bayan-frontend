import { useState } from 'react'
import FileUpload from './components/FileUpload'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  const [darkMode, setDarkMode] = useState(false)
//
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} min-h-screen transition-colors duration-500`}>
      <ToastContainer />
      
      
      <button
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-1 rounded-full shadow-md transition"
      >
        {darkMode ? '🌞 Light' : '🌚 Dark'}
      </button>
      <Header darkMode={darkMode}/>
      <FileUpload darkMode={darkMode} />
      <Footer darkMode={darkMode} />
    </div>
  )
}

export default App
