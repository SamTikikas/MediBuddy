import React from 'react';
import { Loader2, TrendingUp } from 'lucide-react';

export const Loading = ({ size = 'md', text = 'Loading...', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className={`flex flex-col items-center justify-center p-6 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600 mb-3`} />
      <p className="text-gray-600 font-medium text-center">{text}</p>
    </div>
  );
};

export const TableRowSkeleton = ({ columns = 7 }) => {
  return (
    <tr className="border-b border-gray-100 animate-pulse">
      {[...Array(columns)].map((_, index) => (
        <td key={index} className="px-6 py-5">
          <div className="h-4 bg-gray-200 rounded-lg loading-skeleton"></div>
        </td>
      ))}
    </tr>
  );
};

export const PageLoading = ({ text = 'Loading crypto dashboard...' }) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-12 shadow-2xl border border-blue-100 max-w-sm w-full mx-4 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <div className="flex justify-center space-x-1 mb-4">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Crypto Dashboard</h3>
        <p className="text-gray-600 font-medium">{text}</p>
      </div>
    </div>
  );
};

export default Loading;