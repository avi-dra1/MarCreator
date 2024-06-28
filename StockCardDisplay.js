// StockCardDisplay.js
import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

const StockCard = ({ stock, stockIcons }) => (
  <View style={styles.card}>
    <Image 
      source={stockIcons[stock.symbol] || (stock.icon ? { uri: stock.icon } : null)}
      style={styles.cardIcon} 
      resizeMode="contain"
    />
    <View style={styles.cardTextContainer}>
      <Text style={styles.cardSymbol}>{stock.symbol}</Text>
      <Text style={styles.cardPrice}>{stock.price}</Text>
      <Text style={[styles.cardChange, { color: stock.change.startsWith('+') ? 'green' : 'red' }]}>
        {stock.change}
      </Text>
    </View>
  </View>
);

export const StockCardDisplay = ({ stocks, stockIcons }) => (
  <ScrollView style={styles.cardContainer}>
    {stocks.map((stock, index) => (
      <StockCard key={index} stock={stock} stockIcons={stockIcons} />
    ))}
  </ScrollView>
);

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: 'green',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  cardIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardSymbol: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardPrice: {
    fontSize: 14,
  },
  cardChange: {
    fontWeight: 'bold',
    fontSize: 12,
  },
});