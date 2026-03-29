import React from 'react';
import { Sparkles, Layers } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center text-indigo-600">
              <Sparkles className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold">Pear Media Lab</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <button
                onClick={() => setActiveTab('text')}
                className={`${
                  activeTab === 'text'
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Creative Studio (Text)
              </button>
              <button
                onClick={() => setActiveTab('image')}
                className={`${
                  activeTab === 'image'
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Style Lab (Image)
              </button>
            </div>
          </div>
          
          <div className="flex items-center sm:hidden">
            <select 
              value={activeTab} 
              onChange={(e) => setActiveTab(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="text">Creative Studio</option>
              <option value="image">Style Lab</option>
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
