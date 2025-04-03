import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="flex items-center">
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              © {new Date().getFullYear()} PromptCradle. All rights reserved.
            </span>
          </div>
          
          <div className="mt-4 md:mt-0">
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                Terms
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                Privacy
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                Contact
              </a>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center">
            <span className="text-gray-500 dark:text-gray-400 text-sm flex items-center">
              Made with <Heart size={14} className="mx-1 text-red-500" /> for prompt engineers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
