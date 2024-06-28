import React from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import StockTicker from './StockTicker';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StockTicker />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});