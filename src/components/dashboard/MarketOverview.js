import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Activity, Globe, Users, Zap, Target } from 'lucide-react';
import { formatMarketCap, formatPercentage } from '../../utils/formatters';

const MarketOverview = ({ coins, highlightData, loading }) => {
  const stats = React.useMemo(() => {
    if (!coins.length || loading) return null;

    const totalMarketCap = coins.reduce((sum, coin) => sum + (coin.market_cap || 0), 0);
    const total24hVolume = coins.reduce((sum, coin) => sum + (coin.total_volume || 0), 0);
    const gainers = coins.filter(coin => coin.price_change_percentage_24h > 0).length;
    const losers = coins.filter(coin => coin.price_change_percentage_24h < 0).length;
    const neutral = coins.filter(coin => coin.price_change_percentage_24h === 0).length;

    const marketCapChange = coins.reduce((sum, coin) => sum + (coin.market_cap_change_24h || 0), 0);
    const marketCapChangePercent = totalMarketCap > 0 ? (marketCapChange / (totalMarketCap - marketCapChange)) * 100 : 0;

    const avgPriceChange = coins.reduce((sum, coin) => sum + (coin.price_change_percentage_24h || 0), 0) / coins.length;

    const globalData = highlightData?.globalData;

    return {
      totalMarketCap,
      total24hVolume,
      marketCapChange,
      marketCapChangePercent,
      gainers,
      losers,
      neutral,
      totalCoins: coins.length,
      avgPriceChange,
      globalMarketCap: globalData?.total_market_cap?.usd || totalMarketCap,
      globalVolume: globalData?.total_volume_24h?.usd || total24hVolume,
      btcDominance: globalData?.market_cap_percentage?.btc || 0,
      ethDominance: globalData?.market_cap_percentage?.eth || 0,
      activeMarkets: globalData?.markets || 0
    };
  }, [coins, highlightData, loading]);

  if (loading || !stats) {
    return (
      <div className="mb-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Market Overview</h2>
          <p className="text-gray-600">Loading real-time cryptocurrency market statistics...</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-8 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const overviewCards = [
    {
      title: 'Global Market Cap',
      value: formatMarketCap(stats.globalMarketCap),
      change: formatPercentage(stats.marketCapChangePercent),
      changeValue: formatMarketCap(stats.marketCapChange),
      isPositive: stats.marketCapChangePercent > 0,
      icon: DollarSign,
      color: 'blue',
      description: 'Total cryptocurrency market capitalization'
    },
    {
      title: '24h Trading Volume',
      value: formatMarketCap(stats.globalVolume),
      subtitle: 'Across all markets',
      icon: Activity,
      color: 'green',
      description: 'Total trading volume in the last 24 hours'
    },
    {
      title: 'Market Sentiment',
      value: `${stats.gainers}/${stats.losers}`,
      subtitle: `${((stats.gainers / stats.totalCoins) * 100).toFixed(1)}% positive`,
      icon: stats.gainers > stats.losers ? TrendingUp : TrendingDown,
      color: stats.gainers > stats.losers ? 'green' : 'red',
      description: 'Gainers vs Losers ratio'
    },
    {
      title: 'Active Cryptocurrencies',
      value: stats.totalCoins.toLocaleString(),
      subtitle: 'Currently tracked',
      icon: Globe,
      color: 'purple',
      description: 'Number of cryptocurrencies being monitored'
    },
    {
      title: 'Bitcoin Dominance',
      value: `${stats.btcDominance.toFixed(1)}%`,
      subtitle: 'BTC market share',
      icon: Target,
      color: 'orange',
      description: 'Bitcoin\'s share of total market cap'
    },
    {
      title: 'Ethereum Dominance',
      value: `${stats.ethDominance.toFixed(1)}%`,
      subtitle: 'ETH market share',
      icon: Zap,
      color: 'indigo',
      description: 'Ethereum\'s share of total market cap'
    },
    {
      title: 'Average Change',
      value: formatPercentage(stats.avgPriceChange),
      subtitle: '24h average',
      icon: stats.avgPriceChange > 0 ? TrendingUp : TrendingDown,
      color: stats.avgPriceChange > 0 ? 'green' : 'red',
      description: 'Average price change across all coins'
    },
    {
      title: 'Active Markets',
      value: stats.activeMarkets ? stats.activeMarkets.toLocaleString() : 'N/A',
      subtitle: 'Trading pairs',
      icon: Users,
      color: 'teal',
      description: 'Number of active trading markets'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'bg-blue-100' },
      green: { bg: 'bg-green-50', text: 'text-green-600', icon: 'bg-green-100' },
      red: { bg: 'bg-red-50', text: 'text-red-600', icon: 'bg-red-100' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-600', icon: 'bg-purple-100' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-600', icon: 'bg-orange-100' },
      indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', icon: 'bg-indigo-100' },
      teal: { bg: 'bg-teal-50', text: 'text-teal-600', icon: 'bg-teal-100' }
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="mb-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Market Overview</h2>
        <p className="text-gray-600 text-lg">
          Comprehensive real-time cryptocurrency market statistics and insights
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
        {overviewCards.map((card, index) => {
          const colorClasses = getColorClasses(card.color);
          const IconComponent = card.icon;

          return (
            <div 
              key={index} 
              className={`bg-white rounded-2xl p-6 shadow-sm border hover:shadow-lg transition-all duration-200 ${colorClasses.bg} border-opacity-50 flex flex-col justify-between min-h-[180px]`}
              title={card.description}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${colorClasses.icon}`}>
                  <IconComponent className={`w-6 h-6 ${colorClasses.text}`} />
                </div>
                {card.change && (
                  <div className={`flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    card.isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {card.isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {card.change}
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 leading-tight">{card.value}</p>
                {card.subtitle && (
                  <p className="text-sm text-gray-500 font-medium">{card.subtitle}</p>
                )}
                {card.changeValue && (
                  <p className={`text-sm font-semibold ${card.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {card.isPositive ? '+' : ''}{card.changeValue} (24h)
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Market Insights</h3>
            <p className="text-gray-600">
              {stats.gainers > stats.losers ? '🟢 ' : '🔴 '}
              Market showing {stats.gainers > stats.losers ? 'bullish' : 'bearish'} sentiment with{' '}
              <span className="font-semibold">{((stats.gainers / stats.totalCoins) * 100).toFixed(1)}%</span>{' '}
              of tracked cryptocurrencies in the green
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {formatMarketCap(stats.globalMarketCap)}
            </div>
            <div className="text-sm text-gray-500">Total Market Cap</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketOverview;