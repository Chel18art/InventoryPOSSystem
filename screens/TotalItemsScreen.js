import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { getTotalItems } from '../utils/api';  // Make sure to create an API call for fetching the total items


const TotalItemsScreen = () => {
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      const data = await getTotalItems();  // Your API call here
      setItems(data);
      setLoading(false);
    };
    fetchItems();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4e73df" />
        <Text style={styles.loadingText}>Loading Total Items...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Total Items</Text>
      <Text style={styles.content}>Total number of items: {items}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4e73df',
    marginBottom: 20,
  },
  content: {
    fontSize: 18,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: '#4e73df',
  },
});

export default TotalItemsScreen;
