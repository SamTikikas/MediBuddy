import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, BarChart3, PieChart, TrendingUp, TrendingDown, 
  DollarSign, Activity, Users, Globe, Clock, Target,
  Zap, Crown, Award, Percent, Calculator, Eye
} from 'lucide-react';
import { useCoinData } from '../hooks/useCoinData';
import { PageLoading } from '../components/common/Loading';
import { ErrorDisplay } from '../components/common/ErrorBoundary';
import { formatCurrency, formatMarketCap, formatPercentage } from '../utils/formatters';
import Header from '../components/layout/Header';

const Statistics = () => {
  const {
    coins,
    highlightData,
    loadingState,
    highlightsLoading,
    refreshData
  } = useCoinData({
    autoRefresh: true,
    refreshInterval: 60000
  });

  const handleRefresh = async () => {
    await refreshData();
  };

  // Calculate comprehensive statistics
  const stats = React.useMemo(() => {
    if (!coins.length) return null;

    const totalMarketCap = coins.reduce((sum, coin) => sum + (coin.market_cap || 0), 0);
    const total24hVolume = coins.reduce((sum, coin) => sum + (coin.total_volume || 0), 0);
    const marketCapChange24h = coins.reduce((sum, coin) => sum + (coin.market_cap_change_24h || 0), 0);

    const gainers = coins.filter(coin => coin.price_change_percentage_24h > 0);
    const losers = coins.filter(coin => coin.price_change_percentage_24h < 0);
    const neutral = coins.filter(coin => coin.price_change_percentage_24h === 0);

    const btcCoin = coins.find(coin => coin.symbol.toLowerCase() === 'btc');
    const ethCoin = coins.find(coin => coin.symbol.toLowerCase() === 'eth');

    const btcDominance = btcCoin && totalMarketCap > 0 ? (btcCoin.market_cap / totalMarketCap) * 100 : 0;
    const ethDominance = ethCoin && totalMarketCap > 0 ? (ethCoin.market_cap / totalMarketCap) * 100 : 0;

    const avgPrice = coins.reduce((sum, coin) => sum + (coin.current_price || 0), 0) / coins.length;
    const avgMarketCap = totalMarketCap / coins.length;
    const avgVolume = total24hVolume / coins.length;

    const highestPrice = Math.max(...coins.map(coin => coin.current_price || 0));
    const lowestPrice = Math.min(...coins.filter(coin => coin.current_price > 0).map(coin => coin.current_price));

    const coinsAbove1B = coins.filter(coin => coin.market_cap > 1e9).length;
    const coinsAbove1M = coins.filter(coin => coin.market_cap > 1e6).length;
    const coinsBelow1M = coins.filter(coin => coin.market_cap < 1e6 && coin.market_cap > 0).length;

    const avgGain = gainers.length > 0 
      ? gainers.reduce((sum, coin) => sum + coin.price_change_percentage_24h, 0) / gainers.length 
      : 0;
    const avgLoss = losers.length > 0 
      ? losers.reduce((sum, coin) => sum + coin.price_change_percentage_24h, 0) / losers.length 
      : 0;

    const topPerformers = coins
      .filter(coin => coin.price_change_percentage_24h > 0)
      .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
      .slice(0, 5);

    const worstPerformers = coins
      .filter(coin => coin.price_change_percentage_24h < 0)
      .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
      .slice(0, 5);

    return {
      // Core Market Stats
      totalMarketCap,
      total24hVolume,
      marketCapChange24h,
      marketCapChangePercent: totalMarketCap > 0 ? (marketCapChange24h / (totalMarketCap - marketCapChange24h)) * 100 : 0,
      totalCoins: coins.length,

      // Market Sentiment
      gainers: gainers.length,
      losers: losers.length,
      neutral: neutral.length,
      gainersPercent: (gainers.length / coins.length) * 100,
      losersPercent: (losers.length / coins.length) * 100,
      avgGain,
      avgLoss,

      // Dominance
      btcDominance,
      ethDominance,
      otherDominance: 100 - btcDominance - ethDominance,

      // Averages
      avgPrice,
      avgMarketCap,
      avgVolume,

      // Price Extremes
      highestPrice,
      lowestPrice,

      // Market Cap Categories
      coinsAbove1B,
      coinsAbove1M,
      coinsBelow1M,

      // Performance Lists
      topPerformers,
      worstPerformers
    };
  }, [coins]);

  if (loadingState.isLoading && !coins.length) {
    return <PageLoading text="Loading comprehensive market statistics..." />;
  }

  if (!stats) {
    return <PageLoading text="Calculating market statistics..." />;
  }

  const statisticsCategories = [
    {
      title: "📊 Market Overview",
      description: "Core cryptocurrency market statistics",
      stats: [
        { label: "Total Market Cap", value: formatMarketCap(stats.totalMarketCap), change: formatPercentage(stats.marketCapChangePercent), icon: DollarSign, positive: stats.marketCapChangePercent > 0 },
        { label: "24h Volume", value: formatMarketCap(stats.total24hVolume), icon: Activity },
        { label: "Active Cryptocurrencies", value: stats.totalCoins.toLocaleString(), icon: Globe },
        { label: "Average Market Cap", value: formatMarketCap(stats.avgMarketCap), icon: Calculator }
      ]
    },
    {
      title: "🎭 Market Sentiment",
      description: "How the market is performing today",
      stats: [
        { label: "Gainers", value: `${stats.gainers} (${stats.gainersPercent.toFixed(1)}%)`, icon: TrendingUp, positive: true },
        { label: "Losers", value: `${stats.losers} (${stats.losersPercent.toFixed(1)}%)`, icon: TrendingDown, positive: false },
        { label: "Average Gain", value: formatPercentage(stats.avgGain), icon: Award, positive: stats.avgGain > 0 },
        { label: "Average Loss", value: formatPercentage(stats.avgLoss), icon: Target, positive: false }
      ]
    },
    {
      title: "👑 Market Dominance",
      description: "Market share by major cryptocurrencies",
      stats: [
        { label: "Bitcoin Dominance", value: `${stats.btcDominance.toFixed(2)}%`, icon: Crown, color: "text-orange-600" },
        { label: "Ethereum Dominance", value: `${stats.ethDominance.toFixed(2)}%`, icon: Zap, color: "text-blue-600" },
        { label: "Others Combined", value: `${stats.otherDominance.toFixed(2)}%`, icon: PieChart, color: "text-purple-600" }
      ]
    },
    {
      title: "💰 Price Analytics",
      description: "Price statistics across the market",
      stats: [
        { label: "Highest Price", value: formatCurrency(stats.highestPrice), icon: Crown },
        { label: "Lowest Price", value: formatCurrency(stats.lowestPrice), icon: Eye },
        { label: "Average Price", value: formatCurrency(stats.avgPrice), icon: Calculator },
        { label: "Average Volume", value: formatMarketCap(stats.avgVolume), icon: Activity }
      ]
    },
    {
      title: "🏢 Market Capitalization Distribution",
      description: "Breakdown by market cap sizes",
      stats: [
        { label: "Large Cap (>$1B)", value: stats.coinsAbove1B.toLocaleString(), icon: Crown, color: "text-green-600" },
        { label: "Mid Cap (>$1M)", value: stats.coinsAbove1M.toLocaleString(), icon: Award, color: "text-blue-600" },
        { label: "Small Cap (<$1M)", value: stats.coinsBelow1M.toLocaleString(), icon: Target, color: "text-orange-600" }
      ]
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

          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
            <div className="flex items-center mb-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-xl mr-4">
                <BarChart3 className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Market Statistics</h1>
                <p className="text-indigo-100 text-lg">
                  Comprehensive analytics and insights from the cryptocurrency market
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="bg-white bg-opacity-10 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">{formatMarketCap(stats.totalMarketCap)}</div>
                <div className="text-indigo-100">Total Market Cap</div>
              </div>
              <div className="bg-white bg-opacity-10 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">{stats.totalCoins.toLocaleString()}</div>
                <div className="text-indigo-100">Cryptocurrencies</div>
              </div>
              <div className="bg-white bg-opacity-10 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">{stats.gainersPercent.toFixed(1)}%</div>
                <div className="text-indigo-100">Market Positive</div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {loadingState.error && (
          <div className="mb-8">
            <ErrorDisplay
              error={loadingState.error}
              onRetry={handleRefresh}
              onDismiss={() => {}}
            />
          </div>
        )}

        {/* Statistics Categories */}
        <div className="space-y-8">
          {statisticsCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-2xl border shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{category.title}</h2>
                <p className="text-gray-600">{category.description}</p>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {category.stats.map((stat, statIndex) => {
                    const IconComponent = stat.icon;
                    const isPositive = stat.positive !== undefined ? stat.positive : true;
                    const customColor = stat.color || (isPositive ? 'text-green-600' : 'text-red-600');

                    return (
                      <div key={statIndex} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center mb-3">
                          <div className={`p-2 rounded-lg ${isPositive ? 'bg-green-100' : 'bg-red-100'}`}>
                            <IconComponent className={`w-5 h-5 ${customColor}`} />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                          <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                          {stat.change && (
                            <p className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                              {stat.change} (24h)
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}

          {/* Top/Worst Performers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Performers */}
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
                <div className="flex items-center">
                  <Crown className="w-6 h-6 mr-3" />
                  <div>
                    <h3 className="text-xl font-bold">🏆 Top Performers</h3>
                    <p className="text-green-100">Biggest winners today</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {stats.topPerformers.map((coin, index) => (
                    <Link
                      key={coin.id}
                      to={`/coin/${coin.id}`}
                      className="flex items-center justify-between p-4 rounded-xl hover:bg-green-50 transition-colors border border-green-100"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </span>
                        <img 
                          src={coin.image} 
                          alt={coin.name}
                          className="w-10 h-10 rounded-full"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+';
                          }}
                        />
                        <div>
                          <div className="font-semibold text-gray-900">{coin.name}</div>
                          <div className="text-sm text-gray-500 uppercase">{coin.symbol}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">
                          +{coin.price_change_percentage_24h.toFixed(2)}%
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatCurrency(coin.current_price)}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Worst Performers */}
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
                <div className="flex items-center">
                  <TrendingDown className="w-6 h-6 mr-3" />
                  <div>
                    <h3 className="text-xl font-bold">📉 Worst Performers</h3>
                    <p className="text-red-100">Biggest drops today</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {stats.worstPerformers.map((coin, index) => (
                    <Link
                      key={coin.id}
                      to={`/coin/${coin.id}`}
                      className="flex items-center justify-between p-4 rounded-xl hover:bg-red-50 transition-colors border border-red-100"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </span>
                        <img 
                          src={coin.image} 
                          alt={coin.name}
                          className="w-10 h-10 rounded-full"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+';
                          }}
                        />
                        <div>
                          <div className="font-semibold text-gray-900">{coin.name}</div>
                          <div className="text-sm text-gray-500 uppercase">{coin.symbol}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-red-600">
                          {coin.price_change_percentage_24h.toFixed(2)}%
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatCurrency(coin.current_price)}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Market Dominance Visualization */}
          <div className="bg-white rounded-2xl border shadow-sm p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">🎯 Market Dominance Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <div className="w-full h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center">
                    <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center">
                      <Crown className="w-8 h-8 text-orange-600" />
                    </div>
                  </div>
                </div>
                <h4 className="text-lg font-bold text-gray-900">Bitcoin</h4>
                <p className="text-3xl font-bold text-orange-600">{stats.btcDominance.toFixed(1)}%</p>
                <p className="text-gray-500">Market Dominance</p>
              </div>

              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                    <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center">
                      <Zap className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                </div>
                <h4 className="text-lg font-bold text-gray-900">Ethereum</h4>
                <p className="text-3xl font-bold text-blue-600">{stats.ethDominance.toFixed(1)}%</p>
                <p className="text-gray-500">Market Dominance</p>
              </div>

              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <div className="w-full h-full rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center">
                    <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center">
                      <PieChart className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>
                </div>
                <h4 className="text-lg font-bold text-gray-900">Others</h4>
                <p className="text-3xl font-bold text-purple-600">{stats.otherDominance.toFixed(1)}%</p>
                <p className="text-gray-500">Combined Share</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Statistics;