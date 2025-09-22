import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, Volume2, Star, Zap, Crown, Flame, Rocket, ArrowRight } from 'lucide-react';
import { useCoinData } from '../hooks/useCoinData';
import { PageLoading } from '../components/common/Loading';
import { ErrorDisplay } from '../components/common/ErrorBoundary';
import Header from '../components/layout/Header';

const MarketHighlights = () => {
  const {
    highlightData,
    highlightsLoading,
    highlightsError,
    refreshData,
    coins
  } = useCoinData({
    autoRefresh: true,
    refreshInterval: 60000
  });

  const handleRefresh = async () => {
    await refreshData();
  };

  if (highlightsLoading) {
    return <PageLoading text="Loading market highlights..." />;
  }

  const { topGainers = [], topLosers = [], highestVolume = [], trending = [] } = highlightData || {};

  // Extended highlight categories
  const highlightCategories = [
    {
      id: 'topGainers',
      title: "🚀 Top Gainers",
      subtitle: "Biggest winners in the last 24 hours",
      description: "Cryptocurrencies showing the highest price increases",
      icon: <TrendingUp className="w-6 h-6 text-green-600" />,
      coins: topGainers.slice(0, 15),
      valueKey: "price_change_percentage_24h",
      formatValue: (value) => `+${value.toFixed(2)}%`,
      colorClass: "text-green-600",
      bgColor: "bg-green-50 border-green-200",
      headerColor: "bg-gradient-to-r from-green-500 to-green-600"
    },
    {
      id: 'topLosers',
      title: "📉 Top Losers",
      subtitle: "Biggest drops in the last 24 hours", 
      description: "Cryptocurrencies showing the highest price decreases",
      icon: <TrendingDown className="w-6 h-6 text-red-600" />,
      coins: topLosers.slice(0, 15),
      valueKey: "price_change_percentage_24h",
      formatValue: (value) => `${value.toFixed(2)}%`,
      colorClass: "text-red-600",
      bgColor: "bg-red-50 border-red-200",
      headerColor: "bg-gradient-to-r from-red-500 to-red-600"
    },
    {
      id: 'highestVolume',
      title: "💰 Highest Volume",
      subtitle: "Most traded cryptocurrencies today",
      description: "Cryptocurrencies with the highest 24h trading volume",
      icon: <Volume2 className="w-6 h-6 text-blue-600" />,
      coins: highestVolume.slice(0, 15),
      valueKey: "total_volume",
      formatValue: (value) => {
        if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
        if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
        return `$${value.toLocaleString()}`;
      },
      colorClass: "text-blue-600",
      bgColor: "bg-blue-50 border-blue-200",
      headerColor: "bg-gradient-to-r from-blue-500 to-blue-600"
    },
    {
      id: 'trending',
      title: "⭐ Trending Now",
      subtitle: "Most searched cryptocurrencies",
      description: "Popular cryptocurrencies based on search trends",
      icon: <Star className="w-6 h-6 text-purple-600" />,
      coins: trending.slice(0, 15).map(coin => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        image: coin.small,
        market_cap_rank: coin.market_cap_rank,
      })),
      valueKey: "market_cap_rank",
      formatValue: (value) => `#${value}`,
      colorClass: "text-purple-600",
      bgColor: "bg-purple-50 border-purple-200",
      headerColor: "bg-gradient-to-r from-purple-500 to-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onRefresh={handleRefresh} totalCoins={coins?.length || 0} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <div className="flex items-center mb-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-xl mr-4">
                <Star className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Market Highlights</h1>
                <p className="text-blue-100 text-lg">
                  Discover the most active and trending cryptocurrencies in real-time
                </p>
              </div>
            </div>

            <div className="flex items-center text-blue-100">
              <Zap className="w-5 h-5 mr-2" />
              <span>Updated every minute • Live market data</span>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {highlightsError && (
          <div className="mb-8">
            <ErrorDisplay
              error={highlightsError}
              onRetry={handleRefresh}
              onDismiss={() => {}}
            />
          </div>
        )}

        {/* Market Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Top Gainer', value: topGainers[0] ? `${topGainers[0].name} (+${topGainers[0].price_change_percentage_24h.toFixed(2)}%)` : 'Loading...', icon: Crown, color: 'green' },
            { label: 'Highest Volume', value: highestVolume[0] ? highestVolume[0].name : 'Loading...', icon: Flame, color: 'blue' },
            { label: 'Most Trending', value: trending[0] ? trending[0].name : 'Loading...', icon: Rocket, color: 'purple' },
            { label: 'Categories', value: '4 Highlight Categories', icon: Star, color: 'indigo' }
          ].map((stat, index) => {
            const IconComponent = stat.icon;
            const colorClasses = {
              green: 'bg-green-500 text-green-500 bg-green-50',
              blue: 'bg-blue-500 text-blue-500 bg-blue-50',
              purple: 'bg-purple-500 text-purple-500 bg-purple-50',
              indigo: 'bg-indigo-500 text-indigo-500 bg-indigo-50'
            };
            const colors = colorClasses[stat.color].split(' ');

            return (
              <div key={index} className="bg-white rounded-2xl p-6 border shadow-sm">
                <div className="flex items-center mb-3">
                  <div className={`p-3 rounded-xl ${colors[2]}`}>
                    <IconComponent className={`w-6 h-6 ${colors[1]}`} />
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.label}</h3>
                <p className="text-lg font-bold text-gray-900">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Highlight Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {highlightCategories.map((category) => (
            <div key={category.id} className="bg-white rounded-2xl border shadow-sm overflow-hidden">
              {/* Category Header */}
              <div className={`${category.headerColor} p-6 text-white`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="bg-white bg-opacity-20 p-2 rounded-lg mr-3">
                      {category.icon}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{category.title}</h2>
                      <p className="text-white text-opacity-90 text-sm">{category.subtitle}</p>
                    </div>
                  </div>
                </div>
                <p className="text-white text-opacity-80 text-sm">{category.description}</p>
              </div>

              {/* Category Content */}
              <div className="p-6">
                {category.coins && category.coins.length > 0 ? (
                  <div className="space-y-3">
                    {category.coins.map((coin, index) => (
                      <Link
                        key={coin.id || index}
                        to={`/coin/${coin.id}`}
                        className="group flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-100"
                      >
                        <div className="flex items-center space-x-4 flex-1 min-w-0">
                          <div className="relative">
                            <span className={`absolute -top-2 -left-2 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${category.bgColor.split(' ')[0]} ${category.colorClass.replace('text-', 'border-')} border-2`}>
                              {index + 1}
                            </span>
                            <img 
                              src={coin.image} 
                              alt={coin.name}
                              className="w-12 h-12 rounded-full border-2 border-gray-200"
                              onError={(e) => {
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+';
                              }}
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                              {coin.name}
                            </h3>
                            <p className="text-sm text-gray-500 uppercase font-medium">
                              {coin.symbol}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <span className={`text-lg font-bold ${category.colorClass}`}>
                            {coin[category.valueKey] !== null && coin[category.valueKey] !== undefined 
                              ? category.formatValue(coin[category.valueKey]) 
                              : 'N/A'
                            }
                          </span>
                          <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                            <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-blue-600" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-2">📊</div>
                    <p className="text-gray-500">No data available</p>
                  </div>
                )}

                {category.coins && category.coins.length >= 15 && (
                  <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                    <Link
                      to="/"
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      View all coins in market section →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default MarketHighlights;