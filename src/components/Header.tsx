import React from 'react'

type Props = {
  darkMode: boolean
}

const Header = ({ darkMode }: Props) => {
  return (
    <header className={`${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-md transition-colors duration-500`}>
      <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className={`${darkMode ? 'text-blue-300' : 'text-blue-600'} text-2xl font-bold`}>
          📘 Bayan
        </h1>
        <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
          AI Study Companion
        </span>
      </div>
    </header>
  )
}

export default Header
