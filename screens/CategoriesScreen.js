import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet, ScrollView, Modal, Animated } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const API_URL = 'http://192.168.87.113:8000/api/categories/'; // Replace with your actual backend URL

const CategoriesScreen = ({ navigation }) => {
  const [categoryName, setCategoryName] = useState('');
  const [categories, setCategories] = useState([]);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-250)).current;

  const sidebarLinks = [
    { icon: 'tachometer-alt', label: 'Dashboard', screen: 'AdminDashboard' },
    { icon: 'boxes', label: 'Inventory', screen: 'Inventory_management' },
    { icon: 'chart-line', label: 'Sales Report', screen: 'Sales' },
    { icon: 'tags', label: 'Categories', screen: 'Categories' },
    { icon: 'users', label: 'User Management', screen: 'User_management' },
    { icon: 'users', label: 'Supplier', screen: 'SupplierScreen' },
    { icon: 'sign-out-alt', label: 'Logout', screen: '' }
  ];

  const toggleSidebar = () => {
    if (!isSidebarVisible) {
      setSidebarVisible(true);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(slideAnim, {
        toValue: -250,
        useNativeDriver: true,
      }).start(() => setSidebarVisible(false));
    }
  };

  const SidebarLink = ({ icon, label, screen }) => (
    <TouchableOpacity
      style={styles.sidebarLink}
      onPress={() => {
        toggleSidebar();
        if (screen) navigation.navigate(screen);
      }}
    >
      <FontAwesome5 name={icon} size={18} color="#fff" style={styles.sidebarIcon} />
      <Text style={styles.sidebarText}>{label}</Text>
    </TouchableOpacity>
  );

  // ✅ Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ Add category via API
  const addCategory = async () => {
    if (!categoryName.trim()) return;
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: categoryName }),
      });

      if (response.ok) {
        setCategoryName('');
        fetchCategories(); // Refresh list
      } else {
        console.error('Failed to add category');
      }
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  // ✅ Delete category via API
  const deleteCategory = (id) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this category?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            const response = await fetch(`${API_URL}${id}/`, {
              method: 'DELETE',
            });

            if (response.ok) {
              fetchCategories(); // Refresh list
            } else {
              console.error('Failed to delete category');
            }
          } catch (error) {
            console.error('Error deleting category:', error);
          }
        },
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
    <View style={{ flex: 1 }}>
      {/* Sidebar */}
      <Modal visible={isSidebarVisible} transparent animationType="none">
        <TouchableOpacity style={styles.overlay} onPress={toggleSidebar} />
        <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
          {sidebarLinks.map((link, index) => (
            <SidebarLink key={index} {...link} />
          ))}
        </Animated.View>
      </Modal>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleSidebar}>
          <FontAwesome5 name="bars" size={24} color="#4e73df" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Categories</Text>
      </View>

      {/* Main Content */}
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
    </View>
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
  header: {
    marginTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4e73df',
    marginLeft: 15,
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
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 250,
    height: '100%',
    backgroundColor: '#4e73df',
    paddingTop: 60,
    paddingHorizontal: 20,
    zIndex: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: -4, height: 0 },
    shadowRadius: 6,
  },
  sidebarLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sidebarIcon: {
    marginRight: 15,
  },
  sidebarText: {
    color: '#fff',
    fontSize: 16,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 250,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
});

export default CategoriesScreen;
