import React from "react";

import { FiLink } from "react-icons/fi";
import { FaCopy } from "react-icons/fa";

interface LinkData {
  shortKey: string;
  originalUrl: string;
  clicks: number;
  createdAt: string
}

interface ClickedLinksTableProps {
  data: LinkData[],
  setCopied: (isCopied: boolean) => void,
}

const ClickedLinksTable: React.FC<ClickedLinksTableProps> = ({ data = [], setCopied }) => {
  
  // UPDATE THE SHORTKEY FIELD
  const apiCode = "str2pegh3m";
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
    <div className="overflow-x-auto my-15">

      <div className="text-center my-4">
        <p className="text-2xl font-bold text-gray-300 inline-block">
          Most Clicked Links
        </p>
      </div>

      <table className="min-w-6xl border text-gray-300 border-[#0B101B] bg-gray-900">
        <thead>
          <tr className="bg-gray-800 text-left">
            <th className="p-4 border-b border-[#0B101B]">Short Link</th>
            <th className="p-4 border-b border-[#0B101B]">Original Link</th>
            <th className="p-4 border-b border-[#0B101B]">Clicks</th>
            <th className="p-4 border-b border-[#0B101B]">Created</th>
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
                    <a href={rootUrl + row.shortKey}>{rootUrl}{row.shortKey}</a>
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
                    <a href={row.originalUrl}>{row.originalUrl}</a>
                  </div>
                </td>
                <td className="p-4 border-b border-[#0B101B]">{row.clicks}</td>
                <td className="p-4 border-b border-[#0B101B]">{row.createdAt}</td>
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

export default ClickedLinksTable;