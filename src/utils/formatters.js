export const formatCurrency = (value, currency = 'USD', options = {}) => {
  if (value === null || value === undefined || isNaN(value)) {
    return 'N/A';
  }

  if (value < 0.000001 && value > 0) {
    return `<$0.000001`;
  }

  const defaultOptions = {
    style: 'currency',
    currency,
    minimumFractionDigits: value < 1 ? 6 : value < 10 ? 4 : 2,
    maximumFractionDigits: value < 1 ? 6 : value < 10 ? 4 : 2,
    ...options,
  };

  try {
    return new Intl.NumberFormat('en-US', defaultOptions).format(value);
  } catch (error) {
    return `$${value.toFixed(2)}`;
  }
};

export const formatPercentage = (value, decimals = 2) => {
  if (value === null || value === undefined || isNaN(value)) {
    return 'N/A';
  }

  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
};

export const formatMarketCap = (value) => {
  if (value === null || value === undefined || isNaN(value)) {
    return 'N/A';
  }

  const abs = Math.abs(value);

  if (abs >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;

  return formatCurrency(value);
};

export const formatVolume = (value) => {
  return formatMarketCap(value);
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (error) {
    return 'N/A';
  }
};