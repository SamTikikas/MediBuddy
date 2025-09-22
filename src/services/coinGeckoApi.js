import axios from 'axios';

class CoinGeckoApiService {
  constructor() {
    this.baseURL = 'https://api.coingecko.com/api/v3';
    this.cache = new Map();

    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 15000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    this.api.interceptors.request.use(
      (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response) => {
        console.log(`API Response: ${response.status} - ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('API Error:', error.message);
        return Promise.reject(this.handleApiError(error));
      }
    );
  }

  handleApiError(error) {
    const apiError = {
      message: 'Something went wrong. Please try again.',
      status: error.response?.status,
      code: error.code
    };

    if (!error.response) {
      apiError.message = 'Network error. Please check your connection.';
    } else if (error.response.status === 429) {
      apiError.message = 'Rate limit exceeded. Please wait a moment.';
    } else if (error.response.status === 404) {
      apiError.message = 'Data not found.';
    } else if (error.response.status >= 500) {
      apiError.message = 'Server error. Please try again later.';
    }

    return apiError;
  }

  async makeRequestWithRetry(url, params = {}, retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await this.api.get(url, { params });
        return response.data;
      } catch (error) {
        if (i === retries - 1) throw error;

        if (error.response?.status === 429) {
          console.log(`Rate limited, waiting ${delay * (i + 1)}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
        } else if (error.response?.status >= 500) {
          console.log(`Server error, retrying ${i + 1}/${retries}...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          throw error;
        }
      }
    }
  }

  async getMarketData(params = {}) {
    const defaultParams = {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: 100,
      page: 1,
      sparkline: false,
      price_change_percentage: '24h,7d,30d',
      ...params
    };

    const cacheKey = `market_data_${JSON.stringify(defaultParams)}`;

    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < 2 * 60 * 1000) {
        console.log('Using cached market data');
        return cached.data;
      }
      this.cache.delete(cacheKey);
    }

    try {
      console.log('Fetching market data:', defaultParams);
      const data = await this.makeRequestWithRetry('/coins/markets', defaultParams);

      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      console.log(`Successfully fetched ${data.length} coins`);
      return data;
    } catch (error) {
      console.error('Failed to fetch market data:', error);
      throw error;
    }
  }

  async getCoinById(id) {
    try {
      const data = await this.makeRequestWithRetry(`/coins/${id}`, {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
        sparkline: false
      });
      return data;
    } catch (error) {
      console.error(`Failed to fetch coin ${id}:`, error);
      throw error;
    }
  }

  async getTrendingCoins() {
    try {
      const response = await this.makeRequestWithRetry('/search/trending');
      return response.coins ? response.coins.map(coin => coin.item) : [];
    } catch (error) {
      console.error('Failed to fetch trending coins:', error);
      return [];
    }
  }

  async getGlobalData() {
    try {
      const data = await this.makeRequestWithRetry('/global');
      return data.data;
    } catch (error) {
      console.error('Failed to fetch global data:', error);
      return null;
    }
  }

  async getTopGainers(limit = 15) {
    try {
      const coins = await this.getMarketData({ per_page: 100 });
      return coins
        .filter(coin => coin.price_change_percentage_24h > 0)
        .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
        .slice(0, limit);
    } catch (error) {
      console.error('Failed to fetch top gainers:', error);
      return [];
    }
  }

  async getTopLosers(limit = 15) {
    try {
      const coins = await this.getMarketData({ per_page: 100 });
      return coins
        .filter(coin => coin.price_change_percentage_24h < 0)
        .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
        .slice(0, limit);
    } catch (error) {
      console.error('Failed to fetch top losers:', error);
      return [];
    }
  }

  async getHighestVolume(limit = 15) {
    try {
      return this.getMarketData({ order: 'volume_desc', per_page: limit });
    } catch (error) {
      console.error('Failed to fetch highest volume:', error);
      return [];
    }
  }
}

export const coinGeckoApi = new CoinGeckoApiService();
export default coinGeckoApi;