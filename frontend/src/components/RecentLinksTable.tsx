import React from "react"

import { FiLink } from "react-icons/fi";
import { FaCopy } from "react-icons/fa";

interface RecentTableProps {
  data: { shortenedUrl: string, originalUrl: string, clicks: number, date: string }[],
  handleCopyUrl: () => void,
}

const RecentLinksTable: React.FC<RecentTableProps> = ({ data, handleCopyUrl }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-6xl my-20 border text-gray-300 border-gray-700 bg-gray-900">
        <thead>
          <tr className="bg-gray-800 text-left">
            <th className="p-4 border-b border-gray-700">Short Link</th>
            <th className="p-4 border-b border-gray-700">Original Link</th>
            <th className="p-4 border-b border-gray-700">Clicks</th>
            <th className="p-4 border-b border-gray-700">Created</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, index) => (
              <tr key={index} className="hover:bg-[#1a222d]">
                <td className="p-4 border-b border-gray-700">
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => handleCopyUrl()}
                  >
                    <a href={row.shortenedUrl}>{row.shortenedUrl}</a>
                    <span className="text-gray-400 pl-4 pr-2 cursor-pointer hover:text-gray-100">
                      <FaCopy size={18} />
                    </span>
                  </div>
                </td>
                <td className="p-4 border-b border-gray-700">
                <div 
                  className="flex items-center cursor-pointer"
                  onClick={handleCopyUrl}
                >
                  <span className="text-gray-400 pr-2">
                    <FiLink size={24} />
                  </span>
                  <a href={row.originalUrl}>{row.originalUrl}</a>
                </div>
                </td>
                <td className="p-4 border-b border-gray-700">{row.clicks}</td>
                <td className="p-4 border-b border-gray-700">{row.date}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center p-4 text-gray-400">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default RecentLinksTable;