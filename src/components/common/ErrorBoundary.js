import React, { Component } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
          <div className="max-w-md w-full mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-red-100">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Oops! Something went wrong
              </h2>

              <p className="text-gray-600 mb-6 leading-relaxed">
                We encountered an unexpected error while loading the crypto dashboard.
              </p>

              <div className="space-y-3">
                <button onClick={this.handleReset} className="btn-primary w-full">
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Refresh Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export const ErrorDisplay = ({ error, onRetry, onDismiss, className = '' }) => {
  if (!error) return null;

  return (
    <div className={`bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-6 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className="w-6 h-6 text-red-500 mt-1" />
        </div>

        <div className="ml-4 flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Data</h3>
          <p className="text-red-700 mb-4 break-words">{error}</p>

          <div className="flex flex-wrap gap-3">
            {onRetry && (
              <button 
                onClick={onRetry} 
                className="inline-flex items-center px-4 py-2 bg-red-100 text-red-800 font-medium rounded-lg hover:bg-red-200 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;