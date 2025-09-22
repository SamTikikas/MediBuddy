import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, TrendingUp, TrendingDown, Globe, Twitter, Github, Copy, Check } from 'lucide-react';
import { useQuery } from 'react-query';
import { coinGeckoApi } from '../services/coinGeckoApi';
import { formatCurrency, formatMarketCap, formatPercentage, formatDate } from '../utils/formatters';
import { PageLoading } from '../components/common/Loading';
import { ErrorDisplay } from '../components/common/ErrorBoundary';
import Header from '../components/layout/Header';

const CoinDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = React.useState(false);

  const {
    data: coin,
    isLoading,
    error,
    refetch
  } = useQuery(
    ['coin-detail', id],
    () => coinGeckoApi.getCoinById(id),
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
      retry: 3,
    }
  );

  const handleRefresh = async () => {
    await refetch();
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return <PageLoading text={`Loading ${id} details...`} />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onRefresh={handleRefresh} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
          <ErrorDisplay
            error={error.message || 'Failed to load coin details'}
            onRetry={refetch}
          />
        </div>
      </div>
    );
  }

  if (!coin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onRefresh={handleRefresh} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-12 border">
            <div className="text-6xl mb-6">🪙</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Coin not found</h2>
            <p className="text-gray-600 mb-8">The requested cryptocurrency could not be found.</p>
            <Link to="/" className="btn-primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const priceChange24h = coin.market_data?.price_change_percentage_24h || 0;
  const isPositive = priceChange24h > 0;
  const currentPrice = coin.market_data?.current_price?.usd;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onRefresh={handleRefresh} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <div className="space-y-8">
          {/* Coin Header */}
          <div className="bg-white rounded-2xl border shadow-sm p-8">
            <div className="flex flex-col md:flex-row md:items-center space-y-6 md:space-y-0 md:space-x-6">
              <img 
                src={coin.image?.large || coin.image?.small} 
                alt={coin.name}
                className="w-20 h-20 rounded-full border-4 border-gray-100 shadow-lg mx-auto md:mx-0"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+';
                }}
              />

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4">
                  <h1 className="text-4xl font-bold text-gray-900">{coin.name}</h1>
                  <span className="text-2xl text-gray-500 uppercase font-bold">{coin.symbol}</span>
                  {coin.market_cap_rank && (
                    <span className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-bold px-4 py-2 rounded-full">
                      Rank #{coin.market_cap_rank}
                    </span>
                  )}
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-2 md:space-y-0">
                  <span className="text-4xl font-bold text-gray-900">
                    {formatCurrency(currentPrice)}
                  </span>
                  <div className={`inline-flex items-center px-4 py-2 rounded-full font-semibold ${
                    isPositive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {isPositive ? <TrendingUp className="w-5 h-5 mr-1" /> : <TrendingDown className="w-5 h-5 mr-1" />}
                    <span className="text-lg">
                      {formatPercentage(priceChange24h)} (24h)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contract Address */}
            {coin.contract_address && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Contract Address</h3>
                    <p className="text-sm font-mono text-gray-900 break-all">{coin.contract_address}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(coin.contract_address)}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Links */}
            <div className="mt-8 pt-8 border-t border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Official Links</h3>
              <div className="flex flex-wrap gap-4">
                {coin.links?.homepage?.[0] && (
                  <a
                    href={coin.links.homepage[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Official Website
                  </a>
                )}

                {coin.links?.twitter_screen_name && (
                  <a
                    href={`https://twitter.com/${coin.links.twitter_screen_name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Twitter className="w-4 h-4 mr-2" />
                    Twitter
                  </a>
                )}

                {coin.links?.repos_url?.github?.[0] && (
                  <a
                    href={coin.links.repos_url.github[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    GitHub
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Market Data */}
          <div className="bg-white rounded-2xl border shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Market Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  label: 'Market Capitalization',
                  value: formatMarketCap(coin.market_data?.market_cap?.usd),
                  icon: '💰'
                },
                {
                  label: '24h Trading Volume',
                  value: formatMarketCap(coin.market_data?.total_volume?.usd),
                  icon: '📊'
                },
                {
                  label: 'Circulating Supply',
                  value: coin.market_data?.circulating_supply?.toLocaleString() || 'N/A',
                  icon: '🔄'
                },
                {
                  label: 'Total Supply',
                  value: coin.market_data?.total_supply?.toLocaleString() || 'N/A',
                  icon: '📦'
                },
                {
                  label: 'All-Time High',
                  value: formatCurrency(coin.market_data?.ath?.usd),
                  subtitle: coin.market_data?.ath_date?.usd ? formatDate(coin.market_data.ath_date.usd) : '',
                  icon: '📈'
                },
                {
                  label: 'All-Time Low',
                  value: formatCurrency(coin.market_data?.atl?.usd),
                  subtitle: coin.market_data?.atl_date?.usd ? formatDate(coin.market_data.atl_date.usd) : '',
                  icon: '📉'
                }
              ].map((stat, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6 border hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">{stat.icon}</span>
                    <h3 className="text-sm font-medium text-gray-600">{stat.label}</h3>
                  </div>
                  <p className="text-xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  {stat.subtitle && (
                    <p className="text-sm text-gray-500">{stat.subtitle}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          {coin.description?.en && (
            <div className="bg-white rounded-2xl border shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About {coin.name}</h2>
              <div 
                className="prose max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: coin.description.en.split('. ').slice(0, 5).join('. ') + '.' 
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoinDetail;