export const sortCoins = (coins, sortConfig) => {
  return [...coins].sort((a, b) => {
    const { field, direction } = sortConfig;
    let aValue = a[field];
    let bValue = b[field];

    if (aValue === null || aValue === undefined) {
      aValue = direction === 'asc' ? Infinity : -Infinity;
    }
    if (bValue === null || bValue === undefined) {
      bValue = direction === 'asc' ? Infinity : -Infinity;
    }

    if (typeof aValue === 'string' && !isNaN(parseFloat(aValue))) {
      aValue = parseFloat(aValue);
    }
    if (typeof bValue === 'string' && !isNaN(parseFloat(bValue))) {
      bValue = parseFloat(bValue);
    }

    if (field === 'name' || field === 'symbol') {
      aValue = String(aValue).toLowerCase();
      bValue = String(bValue).toLowerCase();
    }

    let comparison = 0;
    if (aValue < bValue) comparison = -1;
    if (aValue > bValue) comparison = 1;

    return direction === 'asc' ? comparison : -comparison;
  });
};

export const filterCoins = (coins, searchTerm) => {
  if (!searchTerm || typeof searchTerm !== 'string') {
    return coins;
  }

  const lowercaseSearch = searchTerm.toLowerCase().trim();

  return coins.filter(coin => {
    const name = coin.name?.toLowerCase() || '';
    const symbol = coin.symbol?.toLowerCase() || '';
    const id = coin.id?.toLowerCase() || '';

    return name.includes(lowercaseSearch) || 
           symbol.includes(lowercaseSearch) || 
           id.includes(lowercaseSearch);
  });
};

export const getNextSortConfig = (currentConfig, newField) => {
  if (currentConfig.field === newField) {
    return {
      field: newField,
      direction: currentConfig.direction === 'asc' ? 'desc' : 'asc',
    };
  }

  const defaultDirections = {
    market_cap_rank: 'asc',
    name: 'asc',
    symbol: 'asc',
    current_price: 'desc',
    market_cap: 'desc',
    total_volume: 'desc',
    price_change_percentage_24h: 'desc',
  };

  return {
    field: newField,
    direction: defaultDirections[newField] || 'desc',
  };
};

export const debounce = (func, wait) => {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      func.apply(this, args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};