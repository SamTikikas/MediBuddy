import React, { useState } from 'react';
import { Search, TrendingUp, RefreshCw, Settings, BarChart3, Activity, Star, PieChart, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { debounce } from '../../utils/helpers';
import { formatMarketCap, formatPercentage } from '../../utils/formatters';

const Header = ({ 
  onSearch, 
  onRefresh, 
  isRefreshing = false, 
  searchTerm = '', 
  totalCoins = 0,
  marketStats = null 
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const debouncedSearch = debounce((term) => {
    if (onSearch) onSearch(term);
  }, 300);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    debouncedSearch(value);
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: BarChart3, description: 'View all cryptocurrencies' },
    { path: '/highlights', label: 'Market Highlights', icon: Star, description: 'Top gainers & losers' },
    { path: '/statistics', label: 'Statistics', icon: PieChart, description: 'Market analytics' }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white shadow-2xl sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity group">
              <div className="bg-white bg-opacity-20 p-3 rounded-xl backdrop-blur-sm group-hover:bg-opacity-30 transition-all">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold text-white">Crypto Dashboard</h1>
                <p className="text-blue-100 text-sm">
                  {totalCoins > 0 ? `Tracking ${totalCoins} cryptocurrencies` : 'Live market data'}
                </p>
              </div>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center space-x-1 bg-white bg-opacity-10 rounded-xl p-1 backdrop-blur-sm">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  title={item.description}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-white bg-opacity-20 text-white font-semibold shadow-lg'
                      : 'text-blue-100 hover:bg-white hover:bg-opacity-10 hover:text-white'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {location.pathname === '/' && (
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-300" />
                </div>
                <input
                  type="text"
                  placeholder="Search cryptocurrencies..."
                  value={localSearchTerm}
                  onChange={handleSearchChange}
                  className="block w-full pl-10 pr-3 py-3 border-0 rounded-xl bg-white bg-opacity-20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:bg-opacity-30 transition-all backdrop-blur-sm"
                />
                {localSearchTerm && (
                  <button
                    onClick={() => {
                      setLocalSearchTerm('');
                      if (onSearch) onSearch('');
                    }}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <X className="h-4 w-4 text-gray-300 hover:text-white" />
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center space-x-3">
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all duration-200 backdrop-blur-sm disabled:opacity-50"
              title="Refresh data"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>

            <button
              className="hidden md:block p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all duration-200 backdrop-blur-sm"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all duration-200 backdrop-blur-sm"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {marketStats && location.pathname === '/' && (
          <div className="hidden md:block border-t border-white border-opacity-20 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center bg-white bg-opacity-10 rounded-lg p-3 backdrop-blur-sm">
                <div className="flex items-center justify-center space-x-2 text-blue-100 text-sm mb-1">
                  <BarChart3 className="w-4 h-4" />
                  <span>Total Market Cap</span>
                </div>
                <div className="text-lg font-bold">
                  {formatMarketCap(marketStats.totalMarketCap)}
                </div>
                {marketStats.marketCapChangePercent !== undefined && (
                  <div className={`text-xs ${marketStats.marketCapChangePercent > 0 ? 'text-green-300' : 'text-red-300'}`}>
                    {formatPercentage(marketStats.marketCapChangePercent)} (24h)
                  </div>
                )}
              </div>

              <div className="text-center bg-white bg-opacity-10 rounded-lg p-3 backdrop-blur-sm">
                <div className="flex items-center justify-center space-x-2 text-blue-100 text-sm mb-1">
                  <Activity className="w-4 h-4" />
                  <span>24h Volume</span>
                </div>
                <div className="text-lg font-bold">
                  {formatMarketCap(marketStats.total24hVolume)}
                </div>
              </div>

              <div className="text-center bg-white bg-opacity-10 rounded-lg p-3 backdrop-blur-sm">
                <div className="flex items-center justify-center space-x-2 text-blue-100 text-sm mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>Bitcoin Dominance</span>
                </div>
                <div className="text-lg font-bold">
                  {marketStats.btcDominance ? marketStats.btcDominance.toFixed(1) + '%' : 'N/A'}
                </div>
              </div>

              <div className="text-center bg-white bg-opacity-10 rounded-lg p-3 backdrop-blur-sm">
                <div className="flex items-center justify-center space-x-2 text-blue-100 text-sm mb-1">
                  <span className="w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  </span>
                  <span>Market Sentiment</span>
                </div>
                <div className="text-lg font-bold">
                  {marketStats.sentimentRatio ? marketStats.sentimentRatio.toFixed(1) + '% 📈' : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        )}

        {location.pathname === '/' && (
          <div className="md:hidden py-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-300" />
              </div>
              <input
                type="text"
                placeholder="Search cryptocurrencies..."
                value={localSearchTerm}
                onChange={handleSearchChange}
                className="block w-full pl-10 pr-10 py-3 border-0 rounded-xl bg-white bg-opacity-20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:bg-opacity-30 transition-all backdrop-blur-sm"
              />
              {localSearchTerm && (
                <button
                  onClick={() => {
                    setLocalSearchTerm('');
                    if (onSearch) onSearch('');
                  }}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X className="h-4 w-4 text-gray-300 hover:text-white" />
                </button>
              )}
            </div>
          </div>
        )}

        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-white border-opacity-20 py-4 space-y-2">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-white bg-opacity-20 text-white font-semibold'
                      : 'text-blue-200 hover:text-white hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-sm text-blue-200">{item.description}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;