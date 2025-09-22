import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Star, BarChart3, ArrowRight, RefreshCw, Loader2 } from 'lucide-react';
import CoinsList from '../components/coins/CoinsList';
import MarketOverview from '../components/dashboard/MarketOverview';
import { PageLoading } from '../components/common/Loading';
import { ErrorDisplay } from '../components/common/ErrorBoundary';
import { useCoinData } from '../hooks/useCoinData';
import Header from '../components/layout/Header';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const {
    coins,
    filteredCoins,
    highlightData,
    loadingState,
    highlightsLoading,
    highlightsError,
    searchTerm,
    setSearchTerm,
    sortConfig,
    setSortConfig,
    refreshData,
    loadMoreCoins,
  } = useCoinData({
    autoRefresh: true,
    refreshInterval: 60000,
    initialPageSize: 100
  });

  useEffect(() => {
    if (!loadingState.isLoading && isInitialLoad) {
      setIsInitialLoad(false);
      if (coins.length > 0) {
        toast.success(`Loaded ${coins.length} cryptocurrencies`, {
          icon: '🚀',
        });
      }
    }
  }, [loadingState.isLoading, isInitialLoad, coins.length]);

  const marketStats = React.useMemo(() => {
    if (!coins.length) return null;

    const totalMarketCap = coins.reduce((sum, coin) => sum + (coin.market_cap || 0), 0);
    const total24hVolume = coins.reduce((sum, coin) => sum + (coin.total_volume || 0), 0);
    const btcCoin = coins.find(coin => coin.symbol.toLowerCase() === 'btc');
    const ethCoin = coins.find(coin => coin.symbol.toLowerCase() === 'eth');

    const btcDominance = btcCoin && totalMarketCap > 0 
      ? (btcCoin.market_cap / totalMarketCap) * 100 
      : 0;
    const ethDominance = ethCoin && totalMarketCap > 0 
      ? (ethCoin.market_cap / totalMarketCap) * 100 
      : 0;

    const marketCapChange = coins.reduce((sum, coin) => sum + (coin.market_cap_change_24h || 0), 0);
    const marketCapChangePercent = totalMarketCap > 0 ? (marketCapChange / (totalMarketCap - marketCapChange)) * 100 : 0;

    const gainersCount = coins.filter(coin => coin.price_change_percentage_24h > 0).length;
    const losersCount = coins.filter(coin => coin.price_change_percentage_24h < 0).length;

    return {
      totalMarketCap,
      total24hVolume,
      btcDominance,
      ethDominance,
      activeMarkets: coins.length,
      marketCapChange,
      marketCapChangePercent,
      gainersCount,
      losersCount,
      sentimentRatio: gainersCount / (gainersCount + losersCount) * 100
    };
  }, [coins]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleRefresh = async () => {
    try {
      toast.promise(
        refreshData(),
        {
          loading: 'Refreshing market data...',
          success: `Updated ${coins.length} cryptocurrencies`,
          error: 'Failed to refresh data'
        }
      );
    } catch (error) {
      console.error('Refresh error:', error);
    }
  };

  const handleSortChange = (newSortConfig) => {
    setSortConfig(newSortConfig);
  };

  const handleCoinClick = (coin) => {
    navigate(`/coin/${coin.id}`);
  };

  const handleLoadMore = () => {
    loadMoreCoins();
    toast.success('Loading more cryptocurrencies...', { icon: '📈' });
  };

  if (isInitialLoad && loadingState.isLoading) {
    return <PageLoading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header 
        onSearch={handleSearch}
        onRefresh={handleRefresh}
        isRefreshing={loadingState.isRefreshing}
        searchTerm={searchTerm}
        totalCoins={coins.length}
        marketStats={marketStats}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loadingState.error && (
          <div className="mb-6">
            <ErrorDisplay
              error={loadingState.error}
              onRetry={handleRefresh}
              onDismiss={() => {}}
            />
          </div>
        )}

        <MarketOverview 
          coins={coins}
          highlightData={highlightData}
          loading={highlightsLoading}
        />

        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <h2 className="text-3xl font-bold mb-3">Explore Crypto Markets</h2>
                <p className="text-blue-100 text-lg leading-relaxed max-w-lg">
                  Discover trending cryptocurrencies, market highlights, and comprehensive analytics
                  across the top 100 cryptocurrencies by market capitalization
                </p>
                {marketStats && (
                  <div className="mt-4 flex flex-wrap gap-4 text-sm">
                    <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full backdrop-blur-sm">
                      📈 {marketStats.gainersCount} gainers
                    </div>
                    <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full backdrop-blur-sm">
                      📉 {marketStats.losersCount} losers
                    </div>
                    <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full backdrop-blur-sm">
                      🎯 {marketStats.sentimentRatio.toFixed(1)}% positive
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/highlights"
                  className="group inline-flex items-center px-6 py-4 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl transition-all duration-200 backdrop-blur-sm shadow-lg hover:shadow-xl"
                >
                  <Star className="w-6 h-6 mr-3" />
                  <div className="text-left">
                    <div className="font-bold text-lg">Market Highlights</div>
                    <div className="text-blue-100 text-sm">Top gainers, losers & trending</div>
                  </div>
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/statistics"
                  className="group inline-flex items-center px-6 py-4 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl transition-all duration-200 backdrop-blur-sm shadow-lg hover:shadow-xl"
                >
                  <BarChart3 className="w-6 h-6 mr-3" />
                  <div className="text-left">
                    <div className="font-bold text-lg">Market Statistics</div>
                    <div className="text-blue-100 text-sm">25+ detailed analytics</div>
                  </div>
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-2xl shadow-sm border p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-4 lg:mb-0">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Top 100 Cryptocurrency Market
                </h2>
                <div className="flex items-center space-x-4 text-gray-600">
                  {filteredCoins.length > 0 && (
                    <>
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                        Showing {filteredCoins.length} {filteredCoins.length === 1 ? 'cryptocurrency' : 'cryptocurrencies'}
                      </span>
                      {searchTerm && (
                        <span className="text-blue-600 font-medium">
                          • Results for "{searchTerm}"
                        </span>
                      )}
                    </>
                  )}
                  {loadingState.isFetching && (
                    <div className="flex items-center text-blue-600">
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      <span className="text-sm font-medium">Updating...</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium"
                  >
                    Clear Search
                  </button>
                )}
                <button
                  onClick={handleRefresh}
                  disabled={loadingState.isFetching}
                  className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loadingState.isFetching ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>
          </div>

          <CoinsList
            coins={filteredCoins}
            loading={loadingState.isLoading && !isInitialLoad}
            error={loadingState.error}
            sortConfig={sortConfig}
            onSortChange={handleSortChange}
            onCoinClick={handleCoinClick}
          />

          {!searchTerm && filteredCoins.length > 0 && filteredCoins.length >= 100 && (
            <div className="flex justify-center pt-8">
              <button
                onClick={handleLoadMore}
                disabled={loadingState.isLoading}
                className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {loadingState.isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    Loading more cryptocurrencies...
                  </>
                ) : (
                  <>
                    <BarChart3 className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                    Load More Cryptocurrencies
                    <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          )}

          {searchTerm && filteredCoins.length === 0 && !loadingState.isLoading && (
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl shadow-sm p-12 max-w-md mx-auto">
                <div className="text-6xl mb-6">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No cryptocurrencies found</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  No cryptocurrencies match "<span className="font-semibold text-blue-600">{searchTerm}</span>". 
                  Try searching with a different term or browse all available coins.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => setSearchTerm('')}
                    className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Show All Cryptocurrencies
                  </button>
                  <Link
                    to="/highlights"
                    className="w-full inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Browse Market Highlights
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;