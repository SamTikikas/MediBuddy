import { useState, useEffect, useCallback } from 'react';
import { useQuery } from 'react-query';
import { coinGeckoApi } from '../services/coinGeckoApi';
import { sortCoins, filterCoins, debounce } from '../utils/helpers';
import React from 'react';

export const useCoinData = (options = {}) => {
  const { autoRefresh = false, refreshInterval = 60000, initialPageSize = 100 } = options;

  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    field: 'market_cap_rank',
    direction: 'asc'
  });
  const [page, setPage] = useState(1);
  const [allCoins, setAllCoins] = useState([]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const debouncedSetSearch = useCallback(
    debounce((term) => setDebouncedSearchTerm(term), 300),
    []
  );

  useEffect(() => {
    debouncedSetSearch(searchTerm);
  }, [searchTerm, debouncedSetSearch]);

  const {
    data: coins = [],
    isLoading: coinsLoading,
    error: coinsError,
    refetch: refetchCoins,
    isFetching: coinsFetching
  } = useQuery(
    ['coins', page, initialPageSize],
    async () => {
      console.log(`Fetching coins for page ${page}...`);
      const data = await coinGeckoApi.getMarketData({ 
        page, 
        per_page: initialPageSize 
      });
      console.log(`Fetched ${data.length} coins for page ${page}`);
      return data;
    },
    {
      refetchInterval: autoRefresh ? refreshInterval : false,
      staleTime: 2 * 60 * 1000,
      cacheTime: 5 * 60 * 1000,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      onSuccess: (data) => {
        console.log(`Successfully loaded ${data.length} coins`);
        if (page === 1) {
          setAllCoins(data);
        } else {
          setAllCoins(prev => {
            const newCoins = data.filter(coin => !prev.find(p => p.id === coin.id));
            return [...prev, ...newCoins];
          });
        }
      },
      onError: (error) => {
        console.error('Error loading coins:', error);
      }
    }
  );

  const {
    data: highlightData,
    isLoading: highlightsLoading,
    error: highlightsError,
    refetch: refetchHighlights
  } = useQuery(
    'highlights',
    async () => {
      console.log('Fetching highlights data...');
      const [topGainers, topLosers, highestVolume, trending, globalData] = await Promise.allSettled([
        coinGeckoApi.getTopGainers(15),
        coinGeckoApi.getTopLosers(15),
        coinGeckoApi.getHighestVolume(15),
        coinGeckoApi.getTrendingCoins(),
        coinGeckoApi.getGlobalData()
      ]);

      return {
        topGainers: topGainers.status === 'fulfilled' ? topGainers.value : [],
        topLosers: topLosers.status === 'fulfilled' ? topLosers.value : [],
        highestVolume: highestVolume.status === 'fulfilled' ? highestVolume.value : [],
        trending: trending.status === 'fulfilled' ? trending.value : [],
        globalData: globalData.status === 'fulfilled' ? globalData.value : null
      };
    },
    {
      refetchInterval: autoRefresh ? refreshInterval : false,
      staleTime: 2 * 60 * 1000,
      cacheTime: 5 * 60 * 1000,
      retry: 2,
      onSuccess: (data) => {
        console.log('Successfully loaded highlights:', {
          gainers: data.topGainers.length,
          losers: data.topLosers.length,
          volume: data.highestVolume.length,
          trending: data.trending.length
        });
      },
      onError: (error) => {
        console.error('Error loading highlights:', error);
      }
    }
  );

  const filteredCoins = React.useMemo(() => {
    let result = filterCoins(allCoins, debouncedSearchTerm);
    result = sortCoins(result, sortConfig);
    return result;
  }, [allCoins, debouncedSearchTerm, sortConfig]);

  const refreshData = useCallback(async () => {
    console.log('Refreshing all data...');
    await Promise.allSettled([refetchCoins(), refetchHighlights()]);
  }, [refetchCoins, refetchHighlights]);

  const loadMoreCoins = useCallback(() => {
    console.log(`Loading more coins (page ${page + 1})...`);
    setPage(prev => prev + 1);
  }, [page]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm]);

  return {
    coins: allCoins,
    filteredCoins,
    highlightData,
    loadingState: {
      isLoading: coinsLoading,
      isFetching: coinsFetching,
      error: coinsError?.message || null,
      isRefreshing: coinsFetching && !coinsLoading
    },
    highlightsLoading,
    highlightsError: highlightsError?.message || null,
    searchTerm,
    setSearchTerm,
    sortConfig,
    setSortConfig,
    page,
    refreshData,
    loadMoreCoins,
  };
};

export default useCoinData;