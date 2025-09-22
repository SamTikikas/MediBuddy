import React from 'react';
import { ChevronUp, ChevronDown, ExternalLink, TrendingUp, TrendingDown, Star, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatMarketCap, formatPercentage, formatVolume } from '../../utils/formatters';
import { getNextSortConfig } from '../../utils/helpers';
import { TableRowSkeleton } from '../common/Loading';

const CoinsList = ({ coins, loading = false, error = null, sortConfig, onSortChange, onCoinClick }) => {
  const handleSort = (field) => {
    if (onSortChange) {
      const newConfig = getNextSortConfig(sortConfig, field);
      onSortChange(newConfig);
    }
  };

  const getSortIcon = (field) => {
    if (sortConfig.field !== field) {
      return <ChevronUp className="w-4 h-4 text-gray-400" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="w-4 h-4 text-blue-600" /> : 
      <ChevronDown className="w-4 h-4 text-blue-600" />;
  };

  const getChangeDisplay = (change) => {
    if (change === null || change === undefined || isNaN(change)) return 'N/A';

    const isPositive = change > 0;
    const isNegative = change < 0;
    const isNeutral = change === 0;

    if (isNeutral) {
      return (
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-700">
          0.00%
        </span>
      );
    }

    return (
      <div className={`flex items-center space-x-1 ${
        isPositive ? 'text-green-600' : 'text-red-600'
      }`}>
        {isPositive && <TrendingUp className="w-3 h-3" />}
        {isNegative && <TrendingDown className="w-3 h-3" />}
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
          isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {formatPercentage(change)}
        </span>
      </div>
    );
  };

  const getRankDisplay = (rank) => {
    if (!rank) return 'N/A';

    let bgColor = 'bg-gray-100 text-gray-700';
    if (rank <= 10) bgColor = 'bg-yellow-100 text-yellow-800';
    else if (rank <= 50) bgColor = 'bg-green-100 text-green-800';
    else if (rank <= 100) bgColor = 'bg-blue-100 text-blue-800';

    return (
      <div className="flex items-center space-x-1">
        <span className={`text-sm font-bold px-2 py-1 rounded-lg ${bgColor}`}>
          #{rank}
        </span>
        {rank <= 10 && <Star className="w-3 h-3 text-yellow-500" />}
      </div>
    );
  };

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-red-800 mb-2">Error Loading Cryptocurrencies</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <p className="text-sm text-red-500">
          This might be due to network issues or API limitations. Please try refreshing the page.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <th 
                scope="col" 
                className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => handleSort('market_cap_rank')}
              >
                <div className="flex items-center space-x-2">
                  <span>Rank</span>
                  {getSortIcon('market_cap_rank')}
                </div>
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Cryptocurrency
              </th>
              <th 
                scope="col" 
                className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => handleSort('current_price')}
              >
                <div className="flex items-center space-x-2">
                  <span>Price (USD)</span>
                  {getSortIcon('current_price')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => handleSort('price_change_percentage_24h')}
              >
                <div className="flex items-center space-x-2">
                  <span>24h Change</span>
                  {getSortIcon('price_change_percentage_24h')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => handleSort('market_cap')}
              >
                <div className="flex items-center space-x-2">
                  <span>Market Cap</span>
                  {getSortIcon('market_cap')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => handleSort('total_volume')}
              >
                <div className="flex items-center space-x-2">
                  <span>24h Volume</span>
                  {getSortIcon('total_volume')}
                </div>
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {loading && [...Array(15)].map((_, index) => (
              <TableRowSkeleton key={index} columns={7} />
            ))}

            {!loading && coins.map((coin, index) => (
              <tr 
                key={coin.id} 
                className={`hover:bg-blue-50 cursor-pointer transition-all duration-200 hover:shadow-sm ${
                  index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                }`}
                onClick={() => onCoinClick && onCoinClick(coin)}
              >
                <td className="px-6 py-5 whitespace-nowrap">
                  {getRankDisplay(coin.market_cap_rank)}
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="relative">
                      <img 
                        className="h-12 w-12 rounded-full border-2 border-gray-200 shadow-sm" 
                        src={coin.image} 
                        alt={coin.name}
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+';
                        }}
                      />
                      {coin.market_cap_rank <= 10 && (
                        <div className="absolute -top-1 -right-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-base font-bold text-gray-900">{coin.name}</div>
                      <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{coin.symbol}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="text-base font-bold text-gray-900">
                    {formatCurrency(coin.current_price)}
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  {getChangeDisplay(coin.price_change_percentage_24h)}
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="text-base font-semibold text-gray-900">
                    {formatMarketCap(coin.market_cap)}
                  </div>
                  {coin.market_cap_rank <= 10 && (
                    <div className="text-xs text-green-600 font-medium">Top 10</div>
                  )}
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="text-base font-semibold text-gray-900">
                    {formatVolume(coin.total_volume)}
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <Link 
                    to={`/coin/${coin.id}`}
                    className="group inline-flex items-center p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all duration-200 shadow-sm hover:shadow-md"
                    onClick={(e) => e.stopPropagation()}
                    title={`View ${coin.name} details`}
                  >
                    <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </Link>
                </td>
              </tr>
            ))}

            {!loading && coins.length === 0 && (
              <tr>
                <td colSpan="7" className="px-6 py-20 text-center">
                  <div className="text-gray-500">
                    <div className="text-8xl mb-6">🔍</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">No cryptocurrencies found</h3>
                    <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                      Try adjusting your search criteria or check back later. The cryptocurrency market data might be temporarily unavailable.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!loading && coins.length > 0 && (
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600">
            <div>
              Showing <span className="font-semibold text-gray-900">{coins.length}</span> cryptocurrencies
            </div>
            <div className="mt-2 sm:mt-0">
              <span className="text-green-600 font-medium">
                {coins.filter(c => c.price_change_percentage_24h > 0).length} gainers
              </span>
              {' • '}
              <span className="text-red-600 font-medium">
                {coins.filter(c => c.price_change_percentage_24h < 0).length} losers
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoinsList;