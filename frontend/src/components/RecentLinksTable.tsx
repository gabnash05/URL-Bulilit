import React from "react";

import { FiLink } from "react-icons/fi";
import { FaCopy } from "react-icons/fa";

interface LinkData {
  shortKey: string;
  originalUrl: string;
  clicks: number;
  createdAt: string
}

interface RecentTableProps {
  data: LinkData[],
  setCopied: (isCopied: boolean) => void,
}

const RecentLinksTable: React.FC<RecentTableProps> = ({ data = [], setCopied }) => {

  // UPDATE THE SHORTKEY FIELD
  const apiCode = "5nmng4fg48";
  const region = "ap-southeast-2"

  const rootUrl = `https://${apiCode}.execute-api.${region}.amazonaws.com/prod/`;
  // -------------
  
  const handleCopyUrl = async (copiedUrl: string) => {
    try {
      await navigator.clipboard.writeText(copiedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 700);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="overflow-x-auto mt-15">
      
      <div className="text-center my-4">
        <p className="text-2xl font-bold text-gray-300 inline-block">
          Recent Links
        </p>
      </div>

      <table className="min-w-6xl border text-gray-300 border-[#0B101B] bg-gray-900">
        <thead>
          <tr className="bg-gray-800 text-left">
            <th className="p-4 border-b border-[#0B101B] w-1/5">Short Link</th>
            <th className="p-4 border-b border-[#0B101B]">Original Link</th>
            <th className="p-4 border-b border-[#0B101B] w-1/10">Clicks</th>
            <th className="p-4 border-b border-[#0B101B] w-1/5">Created</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, index) => (
              <tr key={index} className="hover:bg-[#1a222d]">
                <td className="p-4 border-b border-[#0B101B]">
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => handleCopyUrl(rootUrl + row.shortKey)}
                  >
                    <a 
                      href={rootUrl + row.shortKey}
                      className="max-w-[200px] overflow-hidden whitespace-nowrap"
                    >
                      {rootUrl}{row.shortKey}
                    </a>
                    <span className="text-gray-400 pl-4 pr-2 cursor-pointer hover:text-gray-100">
                      <FaCopy size={18} />
                    </span>
                  </div>
                </td>
                <td className="p-4 border-b border-[#0B101B]">
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => handleCopyUrl(row.originalUrl)}
                  >
                    <span className="text-gray-400 pr-2">
                      <FiLink size={24} />
                    </span>
                    <a 
                      href={row.originalUrl}
                      className="max-w-[500px] overflow-hidden whitespace-nowrap"
                    >
                      {row.originalUrl}
                    </a>
                  </div>
                </td>
                <td className="p-4 border-b border-[#0B101B]">{row.clicks}</td>
                <td className="p-4 border-b border-[#0B101B]">
                  {new Date(row.createdAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center p-4 text-gray-400">
                No links available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default RecentLinksTable;