// StockTicker.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Image, TextInput, Button, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { pickStockIcon } from './StockPickerLogic';
import { StockCardDisplay } from './StockCardDisplay';
import { useStockIcons } from './useStockIcons';

const initialStockData = [
  { symbol: 'AAPL', price: '150.25', change: '+1.2%' },
  { symbol: 'GOOGL', price: '2750.80', change: '-0.5%' },
  { symbol: 'MSFT', price: '305.10', change: '+0.8%' },
  { symbol: 'AMZN', price: '3300.45', change: '+0.3%' },
  { symbol: 'FB', price: '335.20', change: '-0.7%' },
];

const ITEM_WIDTH = 180;
const SCREEN_WIDTH = Dimensions.get('window').width;
const BUFFER_SIZE = Math.max(Math.ceil(SCREEN_WIDTH / ITEM_WIDTH) + 1, 10);

const StatCard = ({ title, value }) => (
  <View style={styles.statCard}>
    <Text style={styles.statTitle}>{title}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

/*const GameCard = ({ title, value }) => (
    <View style={styles.gameCard}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
*/
const GameCard = ({ title, players, rating, genre, thumbnail }) => (
    <View style={styles.gameCard}>
      <View style={styles.gameInfo}>
        <Text style={styles.gameTitle}>{title}</Text>
        <Image source={thumbnail} style={styles.gameThumbnail} />
        <Text style={styles.gameDetail}>Players: {players}</Text>
        <Text style={styles.gameDetail}>Rating: {rating}</Text>
        <Text style={styles.gameDetail}>Genre: {genre}</Text>
      </View>
    </View>
  );

const StatPanel = () => (
    <View style={styles.statPanelContainer}>
    <View style={styles.statPanelHeader}>
      <Text style={styles.statPanelTitle}>Performance</Text>
      <View style={styles.statPanelDivider} />
    </View>
    <View style={styles.statPanel}>
      <StatCard title="Interactions" value="1,234" />
      <StatCard title="Engagement Time" value="5.6 min" />
      <StatCard title="Users Reached" value="10,000" />
    </View>
    <View style={styles.statPanelHeader}>
        <Text style={styles.statPanelTitle}>Games</Text>
        <View style={styles.statPanelDivider} />
    </View>
    <View style={styles.gamePanel}>
    <GameCard
    title="Anarchy"
    players="80-100 daily"
    rating="4.7"
    genre="Strategy"
    thumbnail={require('./assets/anarchy.png')}
  />
  <GameCard
    title="SpaceRPG"
    players="1000-1500 daily"
    rating="4.5"
    genre="RPG"
    thumbnail={require('./assets/space.png')}
  />
  <GameCard
    title="Eutony"
    players="5000-7000 daily"
    rating="4.2"
    genre="Puzzle"
    thumbnail={require('./assets/eutony.png')}
  />
  </View>
</View>
);

const StockInputPanel = ({ onAddStock }) => {
  const [symbol, setSymbol] = useState('');
  const [price, setPrice] = useState('');
  const [change, setChange] = useState('');
  const [iconUri, setIconUri] = useState(null);

  const handleAddStock = () => {
    if (symbol && price && change) {
      onAddStock({
        symbol,
        price,
        change,
        iconUri,
      });
      setSymbol('');
      setPrice('');
      setChange('');
      setIconUri(null);
    }
  };

  const handlePickIcon = async () => {
    const result = await pickStockIcon();
    if (result) {
      setIconUri(result.uri);
      setSymbol(result.name.split('.')[0]); // Set symbol to file name without extension
      console.log("Icon picked:", result.name); // Add this line for debugging
    }
  };

  return (
    <View style={styles.panel}>
      <View style={styles.symbolContainer}>
        <TextInput
          style={styles.symbolInput}
          placeholder="Stock Symbol"
          value={symbol}
          onChangeText={setSymbol}
        />
        <TouchableOpacity onPress={handlePickIcon} style={styles.iconButton}>
          <AntDesign name="plus" size={24} color="black" />
        </TouchableOpacity>
      </View>
      {iconUri && <Text style={styles.iconSelected}>Icon selected: {symbol}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Change (e.g. +1.2%)"
        value={change}
        onChangeText={setChange}
      />
      <Button title="Add Stock" onPress={handleAddStock} />
    </View>
  );
};

const StockTicker = ({ stocks, stockIcons }) => {
  const [stockData, setStockData] = useState([]);
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const initializeStockData = () => {
      setStockData(Array(BUFFER_SIZE).fill(null).map((_, index) => ({
        ...stocks[index % stocks.length],
        key: index,
      })));
    };

    initializeStockData();

    const animate = () => {
      Animated.timing(scrollX, {
        toValue: -ITEM_WIDTH,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          scrollX.setValue(0);
          setStockData(prevData => {
            const newData = [...prevData];
            const firstItem = newData.shift();
            newData.push({
              ...stocks[firstItem.key % stocks.length],
              key: firstItem.key + BUFFER_SIZE,
            });
            return newData;
          });
          animate();
        }
      });
    };

    animate();

    return () => scrollX.stopAnimation();
  }, [stocks]);

  return (
    <View style={styles.tickerContainer}>
      <Animated.View
        style={[
          styles.tickerContent,
          {
            transform: [{ translateX: scrollX }],
          },
        ]}
      >
        {stockData.map((stock) => (
          <View key={stock.key} style={styles.stockItem}>
            <Image 
              source={stockIcons[stock.symbol] || null}
              style={styles.icon} 
              resizeMode="contain"
            />
            <View style={styles.textContainer}>
              <Text style={styles.symbol}>{stock.symbol}</Text>
              <Text style={styles.price}>{stock.price}</Text>
              <Text
                style={[
                  styles.change,
                  { color: stock.change.startsWith('+') ? 'green' : 'red' },
                ]}
              >
                {stock.change}
              </Text>
            </View>
          </View>
        ))}
      </Animated.View>
    </View>
  );
};

/*const StockTickerApp = () => {
  const [stocks, setStocks] = useState(initialStockData);
  const [tickerKey, setTickerKey] = useState(0);
  const { stockIcons, addStockIcon } = useStockIcons();

  const handleAddStock = (newStock) => {
    setStocks(prevStocks => [...prevStocks, newStock]);
    if (newStock.iconUri) {
      addStockIcon(newStock.symbol, newStock.iconUri);
    }
    setTickerKey(prevKey => prevKey + 1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftPanel}>
        <StockInputPanel onAddStock={handleAddStock} />
        <StockCardDisplay stocks={stocks} stockIcons={stockIcons} />
      </View>
      <StockTicker key={tickerKey} stocks={stocks} stockIcons={stockIcons} />
    </View>
  );
};*/

const StockTickerApp = () => {
    const [stocks, setStocks] = useState(initialStockData);
    const [tickerKey, setTickerKey] = useState(0);
    const { stockIcons, addStockIcon } = useStockIcons();
  
    const handleAddStock = (newStock) => {
      setStocks(prevStocks => [...prevStocks, newStock]);
      if (newStock.iconUri) {
        addStockIcon(newStock.symbol, newStock.iconUri);
      }
      setTickerKey(prevKey => prevKey + 1);
    };
  
    return (
      <View style={styles.container}>
        <View style={styles.leftPanel}>
          <StockInputPanel onAddStock={handleAddStock} />
          <StockCardDisplay stocks={stocks} stockIcons={stockIcons} />
        </View>
        <View style={styles.mainPanel}>
          <StockTicker key={tickerKey} stocks={stocks} stockIcons={stockIcons} />
          <StatPanel />
        </View>
      </View>
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  leftPanel: {
    width: 250,
    backgroundColor: '#f0f0f0',
  },
  panel: {
    padding: 20,
  },
  symbolContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  symbolInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  iconButton: {
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
  iconSelected: {
    marginBottom: 10,
    color: 'green',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  tickerContainer: {
    flex: 1,
    height: 70,
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  tickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    width: ITEM_WIDTH,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  textContainer: {
    flexDirection: 'column',
  },
  symbol: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  price: {
    color: '#fff',
    fontSize: 14,
  },
  change: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  mainPanel: {
    flex: 1,
    flexDirection: 'column',
  },
  tickerContainer: {
    height: 70,
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  statPanelContainer: {
    padding: 20,
  },
  statPanelHeader: {
    marginBottom: 15,
  },
  statPanelTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statPanelDivider: {
    height: 1,
    backgroundColor: '#ccc',
    marginBottom: 15,
  },
  statPanel: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  statCard: {
    backgroundColor: '#faa655',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '30%', // Adjust this value to control card width
  },
  statTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 18,
    color: '#007AFF',
  },
  gamePanel: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  gameCard: {
    backgroundColor: 'pink',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: 350,
    width: '30%', // Adjust this value to control card width
  },
  gameThumbnail: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginRight: 10,
  },
  gameInfo: {
    flex: 1,
    justifyContent: 'space-around',
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  gameDetail: {
    fontSize: 14,
    color: '#666',
  }
});

export default StockTickerApp;