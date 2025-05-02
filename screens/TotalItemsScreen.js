import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Animated,
  ScrollView,
  FlatList,
  TextInput,
  Button,
  Image,
} from 'react-native';
import Sidebar from '../components/Sidebar';
import { getTotalItems } from '../utils/api';
import { Picker } from '@react-native-picker/picker'; // ✅ Correct




const TotalItemsScreen = ({ navigation }) => {
  const [items, setItems] = useState([]);  // Ensure items is initialized as an array
  const [loading, setLoading] = useState(true);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [entries, setEntries] = useState('10');
  const slideAnim = useRef(new Animated.Value(-250)).current;

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getTotalItems();  // Fetch the data from the API
        console.log('API Response:', data);  // Log the raw response to check the format

        // Check if data is an error status or number
        if (typeof data === 'number') {
          console.error(`Unexpected API response: ${data}`);
          setItems([]);  // Clear items on error
        } else if (Array.isArray(data)) {
          setItems(data);  // If data is an array, update the state
        } else if (data && data.items && Array.isArray(data.items)) {
          // If the response is an object with a 'items' key containing an array
          setItems(data.items);
        } else {
          console.error('Unexpected API response structure:', data);
          setItems([]);  // Fallback to empty array if structure is not as expected
        }
      } catch (error) {
        console.error('Error fetching items:', error);  // Log any errors that occur during the fetch
        setItems([]);  // Fallback to empty array in case of fetch error
      } finally {
        setLoading(false);  // Stop loading animation
      }
    };

    fetchItems();
  }, []);  // Empty dependency array ensures this runs once when the component mounts

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

  const SidebarLink = ({ label, screen }) => (
    <TouchableOpacity
      style={styles.sidebarLink}
      onPress={() => {
        toggleSidebar();
        navigation.navigate(screen);
      }}
    >
      <Text style={styles.sidebarText}>{label}</Text>
    </TouchableOpacity>
  );

  const filteredItems = Array.isArray(items)
    ? items
        .filter(item =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          (category ? item.category.id === category : true)
        )
        .slice(0, parseInt(entries))
    : [];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00796b" />
        <Text style={styles.loadingText}>Loading Inventory Items...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Modal visible={isSidebarVisible} transparent animationType="none">
        <TouchableOpacity style={styles.overlay} onPress={toggleSidebar} />
        <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
          <SidebarLink label="Dashboard" screen="AdminDashboard" />
          <SidebarLink label="Inventory" screen="TotalItems" />
          <SidebarLink label="Add Item" screen="AddItemScreen" />
          <SidebarLink label="Sales Report" screen="TotalSales" />
          <SidebarLink label="Categories" screen="TotalCategories" />
          <SidebarLink label="User Management" screen="TotalUsers" />
          <SidebarLink label="Logout" screen="LogoutScreen" />
        </Animated.View>
      </Modal>

      <View style={styles.header}>
        <TouchableOpacity onPress={toggleSidebar}>
          <Text style={styles.menuButton}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Inventory Items</Text>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.controlsContainer}>
          <View style={styles.entriesControl}>
            <Text>Show</Text>
            <Picker
              selectedValue={entries}
              style={styles.picker}
              onValueChange={(itemValue) => setEntries(itemValue)}
            >
              <Picker.Item label="10" value="10" />
              <Picker.Item label="25" value="25" />
              <Picker.Item label="50" value="50" />
              <Picker.Item label="100" value="100" />
            </Picker>
            <Text>entries</Text>
          </View>
          <View style={styles.searchForm}>
            <Text>Search:</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search item..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <Text>Category:</Text>
            <Picker
              selectedValue={category}
              style={styles.picker}
              onValueChange={(itemValue) => setCategory(itemValue)}
            >
              <Picker.Item label="All Categories" value="" />
              {/* Populate with real category options when integrating */}
            </Picker>
          </View>
        </View>

        <View style={styles.tableContainer}>
          <FlatList
            data={filteredItems}
            keyExtractor={(item, index) => index.toString()}
            ListHeaderComponent={() => (
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderCell}>#</Text>
                <Text style={styles.tableHeaderCell}>Image</Text>
                <Text style={styles.tableHeaderCell}>Name</Text>
                <Text style={styles.tableHeaderCell}>Category</Text>
                <Text style={styles.tableHeaderCell}>Description</Text>
                <Text style={styles.tableHeaderCell}>Qty</Text>
                <Text style={styles.tableHeaderCell}>Unit</Text>
                <Text style={styles.tableHeaderCell}>Price</Text>
                <Text style={styles.tableHeaderCell}>Supplier</Text>
              </View>
            )}
            renderItem={({ item, index }) => (
              <View
                style={[styles.tableRow, item.quantity < 10 && styles.lowStock]}
              >
                <Text style={styles.tableCell}>{index + 1}</Text>
                {item.image ? (
                  <Image source={{ uri: item.image }} style={styles.itemImage} />
                ) : (
                  <Text style={styles.tableCell}>No image</Text>
                )}
                <Text style={styles.tableCell}>{item.name}</Text>
                <Text style={styles.tableCell}>{item.category.name}</Text>
                <Text style={styles.tableCell}>{item.description}</Text>
                <Text style={styles.tableCell}>{item.quantity}</Text>
                <Text style={styles.tableCell}>{item.unit}</Text>
                <Text style={styles.tableCell}>{item.price}</Text>
                <Text style={styles.tableCell}>{item.supplier.name}</Text>
              </View>
            )}
          />
        </View>

        <Text style={styles.totalCount}>Total items in inventory: {filteredItems.length}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  header: {
    marginTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    elevation: 5,
  },
  menuButton: { fontSize: 30, color: '#00796b' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#00796b', marginLeft: 15 },
  contentContainer: { padding: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 20, fontSize: 18, color: '#00796b' },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 250,
    height: '100%',
    backgroundColor: '#00796b',
    paddingTop: 60,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  sidebarLink: { marginBottom: 20 },
  sidebarText: { color: '#fff', fontSize: 18 },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 250,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  controlsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 20, marginBottom: 20 },
  entriesControl: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  searchForm: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  searchInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, width: 120 },
  picker: { height: 40, width: 120 },
  tableContainer: { borderWidth: 1, borderColor: '#ddd', borderRadius: 6 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#00796b', padding: 10 },
  tableHeaderCell: { flex: 1, color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  tableRow: { flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  tableCell: { flex: 1, textAlign: 'center', color: '#333' },
  itemImage: { width: 40, height: 40, borderRadius: 4 },
  lowStock: { backgroundColor: '#ffeb3b' },
  totalCount: { marginTop: 20, fontSize: 16, color: '#333' },
});

export default TotalItemsScreen;
