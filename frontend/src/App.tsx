import './styles/App.css'

import { useState, useEffect } from 'react';
import { FiLink } from "react-icons/fi";
import { FaCopy } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

import RecentLinksTable from './components/RecentLinksTable';
import ClickedLinksTable from './components/ClickedLinksTable';

interface LinkData {
  shortKey: string;
  originalUrl: string;
  clicks: number;
  createdAt: string
}

function App() {
  const [ url, setUrl ] = useState<string>("");
  const [ shortenedUrl, setShortenedUrl ] = useState<string>("");
  const [ copied, setCopied ] = useState<boolean>(false);
  const [ recentLinks, setRecentLinks ] = useState<LinkData[]>([]);
  const [ clickedLinks, setClickedLinks ] = useState<LinkData[]>([]);

  const apiCode = "str2pegh3m";
  const region = "ap-southeast-2"

  const rootUrl = `https://${apiCode}.execute-api.${region}.amazonaws.com/prod/`;

  const shortenUrl = `${rootUrl}shorten`;
  const statsUrl = `${rootUrl}stats`;
  const handleShortenUrl = async () => {
    try {
      const response = await axios.post(shortenUrl, { url });
      const shortKey = response.data.shortKey;

      setShortenedUrl(`${rootUrl}${shortKey}`);
      setCopied(false);
    } catch (error) {
      console.error('Error shortening URL:', error);
    }
  };
  
  useEffect(() => {
    const fetchTableData = async () => {
      try {
        // const [recentRes, clickedRes] = await Promise.all([
        //   axios.get(recentUrl),
        //   axios.get(statsUrl),
        // ]);

        const clickedRes = await axios.get(statsUrl);

        setRecentLinks([]);
        setClickedLinks(clickedRes.data);
      } catch(error) {
        console.error("Error fetching data: ", error);
      }
    }

    fetchTableData()
  }, [handleShortenUrl]);

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(shortenedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 700);
  }

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

      {/* <RecentLinksTable data={recentLinks} setCopied={setCopied}/> */}
      <ClickedLinksTable data={clickedLinks} setCopied={setCopied}/>
      </div>
    </>
  )
}

export default App
