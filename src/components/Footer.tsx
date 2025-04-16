import React from 'react'

const Footer = () => {
  return (
    <footer className="mt-12 py-6 border-t text-center text-sm text-gray-500">
      <p>
        Made with 💙 by <span className="font-medium text-blue-700">Bayan</span> · © {new Date().getFullYear()}
      </p>
      <p className="mt-1">
        AI-powered learning — Simplifying knowledge one page at a time.
      </p>
    </footer>
  )
}

export default Footer
