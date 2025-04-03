import React from 'react';
import { format } from 'date-fns';
import { Clock, ArrowLeft } from 'lucide-react';
import Button from '../ui/Button';

interface VersionHistoryItem {
  version: number;
  updatedAt: Date;
  changes: string[];
}

interface PromptVersionHistoryProps {
  versions: VersionHistoryItem[];
  currentVersion: number;
  onRestoreVersion: (version: number) => void;
}

const PromptVersionHistory: React.FC<PromptVersionHistoryProps> = ({
  versions,
  currentVersion,
  onRestoreVersion,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Version History</h3>
      
      <div className="space-y-3">
        {versions.map((version) => (
          <div 
            key={version.version}
            className={`
              p-4 rounded-lg border 
              ${currentVersion === version.version 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-gray-200 dark:border-gray-700'}
            `}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center">
                  <Clock size={16} className="text-gray-500 dark:text-gray-400 mr-1" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {format(new Date(version.updatedAt), 'MMM d, yyyy h:mm a')}
                  </span>
                </div>
                <h4 className="font-medium mt-1">
                  Version {version.version}
                  {currentVersion === version.version && (
                    <span className="ml-2 text-blue-600 dark:text-blue-400 text-sm">
                      (Current)
                    </span>
                  )}
                </h4>
              </div>
              
              {currentVersion !== version.version && (
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<ArrowLeft size={14} />}
                  onClick={() => onRestoreVersion(version.version)}
                >
                  Restore
                </Button>
              )}
            </div>
            
            {version.changes.length > 0 && (
              <div className="mt-2">
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Changes:
                </h5>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 pl-5 list-disc">
                  {version.changes.map((change, index) => (
                    <li key={index}>{change}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromptVersionHistory;
