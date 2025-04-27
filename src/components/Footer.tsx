import React from 'react'

type Props = {
  darkMode: boolean
}

const Footer = ({ darkMode }: Props) => {
  return (
    <footer className={`${darkMode ? 'bg-gray-900 text-gray-400' : 'border-t text-gray-500'} mt-12 py-6 text-center text-sm transition-colors duration-500`}>
      <p>
        Made with 💙 by <span className={`${darkMode ? 'text-blue-300' : 'text-blue-700'} font-medium`}>Bayan</span> · © {new Date().getFullYear()}
      </p>
      <p className="mt-1">
        AI-powered learning — Simplifying knowledge one page at a time.
      </p>
    </footer>
  )
}

export default Footer
