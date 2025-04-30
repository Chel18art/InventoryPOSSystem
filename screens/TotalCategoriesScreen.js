import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet, ScrollView } from 'react-native';

const TotalCategoriesScreen = () => {
  const [categoryName, setCategoryName] = useState('');
  const [categories, setCategories] = useState([]);
  const [idCounter, setIdCounter] = useState(1); // Simulate unique IDs

  const addCategory = () => {
    if (!categoryName.trim()) return;
    const newCategory = {
      id: idCounter,
      name: categoryName,
    };
    setCategories([newCategory, ...categories]);
    setIdCounter(idCounter + 1);
    setCategoryName('');
  };

  const deleteCategory = (id) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this category?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: () => setCategories(categories.filter(cat => cat.id !== id)),
        style: 'destructive',
      },
    ]);
  };

  const renderCategory = ({ item }) => (
    <View style={styles.row}>
      <Text style={[styles.cell, { flex: 1, textAlign: 'left' }]}>{item.name}</Text>
      <TouchableOpacity onPress={() => deleteCategory(item.id)} style={styles.deleteButton}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Manage Categories</Text>

      {/* Add New Category */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Add New Category</Text>
        <View style={styles.form}>
          <TextInput
            placeholder="Enter new category"
            value={categoryName}
            onChangeText={setCategoryName}
            style={styles.input}
          />
          <TouchableOpacity onPress={addCategory} style={styles.addButton}>
            <Text style={styles.addText}>Add Category</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Category List */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Category List</Text>
        {categories.length === 0 ? (
          <Text style={styles.emptyMessage}>No categories yet.</Text>
        ) : (
          <View style={styles.table}>
            <View style={[styles.row, styles.headerRow]}>
              <Text style={[styles.cell, { flex: 1, textAlign: 'left', color: '#fff' }]}>Category Name</Text>
              <Text style={[styles.cell, { color: '#fff' }]}>Actions</Text>
            </View>
            <FlatList
              data={categories}
              renderItem={renderCategory}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: '#fefefe',
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#2c3e50',
      marginBottom: 30,
    },
    card: {
      padding: 20,
      backgroundColor: '#fff',
      marginBottom: 30,
      borderRadius: 8,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 6,
      elevation: 4,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 15,
      color: '#333',
    },
    form: {
      flexDirection: 'row',
      gap: 10,
      flexWrap: 'wrap',
    },
    input: {
      flex: 1,
      padding: 12,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 8,
      fontSize: 16,
    },
    addButton: {
      backgroundColor: '#008585',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
    },
    addText: {
      color: '#fff',
      fontWeight: '600',
    },
    table: {
      marginTop: 10,
      borderWidth: 2,
      borderColor: '#00796b',
      borderRadius: 8,
      overflow: 'hidden',
    },
    row: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: '#ccc',
      paddingVertical: 12,
      paddingHorizontal: 10,
      backgroundColor: '#fafafa',
    },
    headerRow: {
      backgroundColor: '#00796b',
    },
    cell: {
      flex: 1,
      fontSize: 16,
      textAlign: 'center',
    },
    deleteButton: {
      backgroundColor: '#e74c3c',
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 6,
    },
    deleteText: {
      color: '#fff',
      fontWeight: '600',
    },
    emptyMessage: {
      textAlign: 'center',
      fontStyle: 'italic',
      color: '#888',
      marginTop: 20,
    },
  });
  

export default TotalCategoriesScreen;
