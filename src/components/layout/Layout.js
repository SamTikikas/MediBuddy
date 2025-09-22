import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {children}
      <footer className="bg-white border-t mt-16 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Crypto Dashboard</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Real-time cryptocurrency market data, analytics, and insights for the top 100 
                cryptocurrencies by market capitalization.
              </p>
            </div>

            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/" className="text-gray-600 hover:text-blue-600 transition-colors">Dashboard</a></li>
                <li><a href="/highlights" className="text-gray-600 hover:text-blue-600 transition-colors">Market Highlights</a></li>
                <li><a href="/statistics" className="text-gray-600 hover:text-blue-600 transition-colors">Statistics</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-4">Data Source</h4>
              <p className="text-gray-600 text-sm mb-3">
                Powered by{' '}
                <a 
                  href="https://www.coingecko.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:text-blue-800 font-medium underline"
                >
                  CoinGecko API
                </a>
              </p>
              <p className="text-gray-500 text-xs">
                Real-time market data updated every minute
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mt-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <p className="text-gray-500 text-sm">
                © 2025 Complete Crypto Dashboard v2.1 • Built with React & Tailwind CSS
              </p>
              <p className="text-gray-500 text-sm mt-2 md:mt-0">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;