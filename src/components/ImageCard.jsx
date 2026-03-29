import React from 'react';
import { Download } from 'lucide-react';

const ImageCard = ({ src, alt, title }) => {
  if (!src) return null;

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg flex flex-col mt-6">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">{title || 'Generated Image'}</h3>
        <a
          href={src}
          download="generated-image.jpg"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none"
        >
          <Download className="h-4 w-4 mr-1" />
          Download
        </a>
      </div>
      <div className="p-4 bg-gray-50 flex-grow flex items-center justify-center">
        <img
          src={src}
          alt={alt || "Output"}
          className="max-h-[500px] w-auto object-contain rounded-md shadow-sm"
        />
      </div>
    </div>
  );
};

export default ImageCard;
