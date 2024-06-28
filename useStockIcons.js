// useStockIcons.js
import { useState } from 'react';

const initialIcons = {
  AAPL: require('./assets/apple-icon.png'),
  GOOGL: require('./assets/google-icon.png'),
  MSFT: require('./assets/microsoft-icon.png'),
  AMZN: require('./assets/amazon-icon.png'),
  FB: require('./assets/facebook-icon.png'),
};

export const useStockIcons = () => {
  const [stockIcons, setStockIcons] = useState(initialIcons);

  const addStockIcon = (symbol, iconUri) => {
    setStockIcons(prevIcons => ({
      ...prevIcons,
      [symbol]: { uri: iconUri }
    }));
  };

  return { stockIcons, addStockIcon };
};