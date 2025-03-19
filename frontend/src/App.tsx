import './styles/App.css'

import { useState } from 'react';
import { FiLink } from "react-icons/fi";
import { FaCopy } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';

import RecentLinksTable from './components/recentLinksTable';

function App() {
  const [ url, setUrl ] = useState("");
  const [ shortenedUrl, setshortenedUrl ] = useState("");
  const [ copied, setCopied ] = useState(false);

  const handleShortenUrl = async () => {
    setshortenedUrl("https://facebook.com");
    setCopied(false);
  }

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(shortenedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  }

  const tableData = [{
    shortenedUrl: "https://bllt.com/Ah5B6",
    originalUrl: "https://www.figma.com/design/jzfm21jotgC7QgSfYWsPPq/URL-Bulilit",
    clicks: 12,
    date: "03/20/2025"
  },
  {
    shortenedUrl: "https://bllt.com/Ah5B6",
    originalUrl: "https://www.figma.com/design/jzfm21jotgC7QgSfYWsPPq/URL-Bulilit",
    clicks: 12,
    date: "03/20/2025"
  },
  {
    shortenedUrl: "https://bllt.com/Ah5B6",
    originalUrl: "https://www.figma.com/design/jzfm21jotgC7QgSfYWsPPq/URL-Bulilit",
    clicks: 12,
    date: "03/20/2025"
  },
  {
    shortenedUrl: "https://bllt.com/Ah5B6",
    originalUrl: "https://www.figma.com/design/jzfm21jotgC7QgSfYWsPPq/URL-Bulilit",
    clicks: 12,
    date: "03/20/2025"
  }
  ]

  return (
    <>
      <h2 className="absolute top-8 left-15 text-3xl font-extrabold bg-gradient-to-r from-pink-500 to-blue-700 bg-clip-text text-transparent">
        URL Bulilit
      </h2>

      <div className='flex flex-col items-center justify-center min-h-screen text-white p-6'>
        

        <h1 className='text-6xl mt-30 font-extrabold text-center max-w-200 bg-gradient-to-r from-blue-700 to-pink-500 bg-clip-text text-transparent mb-8'>
          Less is More – Shorten Your URL!
        </h1>

        <div className="mt-6 flex items-center w-full max-w-2xl bg-gray-800 rounded-[35px] p-2 shadow-lg outline-solid outline-[#353C4A]">
        <span className="text-gray-400 pl-4 pr-2">
          <FiLink size={24} />
        </span>

          <input
            type='text'
            placeholder='Enter the link here'
            className="flex-1 bg-transparent outline-none text-white p-2"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white py-4 px-5 rounded-3xl shadow-md justify-self-stretch cursor-pointer"
            onClick={handleShortenUrl}
          >
            Shorten Now!
          </button>
        </div>

      {shortenedUrl && (
        <div className="mt-7 text-lg flex">
          <p className='font-bold mr-3 bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent'>
            Shortened URL: 
          </p>
          <a href={shortenedUrl} className="text-xl text-gray-100 self-center underline mb-10">{shortenedUrl}</a>
          <span 
            className="text-gray-400 pl-4 pr-2 cursor-pointer hover:text-gray-100"
            onClick={handleCopyUrl}
          >
            <FaCopy size={24} />
          </span>
        </div>
      )}

      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-30 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-md px-4 py-2 rounded-lg shadow-md"
          >
            Copied!
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-4 text-gray-400 text-center max-w-2xl">
        <strong>URL-Buliit</strong> is a lightweight URL shortener that takes no time to set up and instantly
        transforms long, cumbersome links into short, shareable URLs.
      </p>

      <RecentLinksTable data={tableData} handleCopyUrl={handleCopyUrl}/>
      </div>
    </>
  )
}

export default App
