import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TextInput, StyleSheet,
  ActivityIndicator, Button, TouchableOpacity,
  Image, ScrollView, Modal, Dimensions,
  Animated, TouchableWithoutFeedback
} from 'react-native';
import { getInventoryItems } from '../utils/api';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import Sidebar from '../components/Sidebar';

const ITEMS_PER_PAGE = 10;

const InventoryManagementScreen = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [visibleItems, setVisibleItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const navigation = useNavigation();

  const screenWidth = Dimensions.get('window').width;
  const isSmallScreen = screenWidth < 768;

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [sidebarAnim] = useState(new Animated.Value(-250));

  const toggleSidebar = () => {
    if (!sidebarVisible) {
      setSidebarVisible(true);
      Animated.timing(sidebarAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(sidebarAnim, {
        toValue: -250,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setSidebarVisible(false);
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const itemData = await getInventoryItems();
        setItems(itemData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    filterAndSortItems();
  }, [items, searchQuery, sortField, sortOrder]);

  useEffect(() => {
    paginateItems();
  }, [filteredItems, currentPage]);

  const filterAndSortItems = () => {
    let updated = [...items];
    if (searchQuery) {
      updated = updated.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    updated.sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === 'string') {
        return sortOrder === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      } else {
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }
    });
    setFilteredItems(updated);
    setCurrentPage(1);
  };

  const paginateItems = () => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    setVisibleItems(filteredItems.slice(start, end));
  };

  const handleNext = () => {
    if (currentPage < Math.ceil(filteredItems.length / ITEMS_PER_PAGE)) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('StockCard', { itemId: item.id })}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.cardDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemText}>Category: {item.category}</Text>
        <Text style={styles.itemText}>Description: {item.description}</Text>
        <Text style={styles.itemText}>Quantity: {item.quantity} {item.unit}</Text>
        <Text style={styles.itemText}>Price: ${item.price}</Text>
        <Text style={styles.itemText}>Supplier: {item.supplier}</Text>

        <View style={styles.stockCardButton}>
          <Icon name="id-card" size={18} color="#fff" />
          <Text style={styles.buttonText}> Stock Card</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const totalItems = items.length;
  const totalStock = items.reduce((acc, item) => acc + item.quantity, 0);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Loading inventory...</Text>
      </View>
    );
  }

  return (
    <View style={styles.rootContainer}>
      {!isSmallScreen && <Sidebar />}

      {isSmallScreen && (
        <>
          <TouchableOpacity onPress={toggleSidebar} style={styles.hamburger}>
            <Icon name="bars" size={24} color="#333" />
          </TouchableOpacity>

          {sidebarVisible && (
            <Modal transparent animationType="none" visible={sidebarVisible}>
              <TouchableWithoutFeedback onPress={toggleSidebar}>
                <View style={styles.modalOverlay}>
                  <TouchableWithoutFeedback>
                    <Animated.View style={[styles.sidebarModal, { transform: [{ translateX: sidebarAnim }] }]}>
                      <Sidebar />
                    </Animated.View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          )}
        </>
      )}

      <ScrollView style={styles.container}>
        <Text style={styles.title}>Inventory Management</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Search items..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <View style={styles.totalSummary}>
          <Text style={styles.summaryText}>📦 Total Items: {totalItems}</Text>
          <Text style={styles.summaryText}>📊 Total Stock: {totalStock}</Text>
        </View>

        <View style={styles.sortRow}>
          <Text style={styles.sortLabel}>Sort by:</Text>
          <Picker
            selectedValue={sortField}
            onValueChange={value => setSortField(value)}
            style={styles.sortPicker}
          >
            <Picker.Item label="Name" value="name" />
            <Picker.Item label="Price" value="price" />
            <Picker.Item label="Quantity" value="quantity" />
          </Picker>
          <TouchableOpacity onPress={toggleSortOrder}>
            <Text style={styles.sortOrderButton}>
              {sortOrder === 'asc' ? '▲ Asc' : '▼ Desc'}
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={visibleItems}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />

        <View style={styles.paginationRow}>
          <Button title="Previous" onPress={handlePrevious} disabled={currentPage === 1} />
          <Text style={styles.pageNumber}>Page {currentPage}</Text>
          <Button
            title="Next"
            onPress={handleNext}
            disabled={currentPage >= Math.ceil(filteredItems.length / ITEMS_PER_PAGE)}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: { flex: 1, flexDirection: 'row' },
  container: {
    flex: 1,
    backgroundColor: '#f5f8ff',
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  searchInput: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  totalSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    backgroundColor: '#e8f0fe',
    padding: 10,
    borderRadius: 8,
  },
  summaryText: { fontSize: 14, fontWeight: '500' },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sortLabel: { marginRight: 8, fontSize: 15 },
  sortPicker: { height: 40, flex: 1 },
  sortOrderButton: {
    marginLeft: 10,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#aaa',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 10,
  },
  cardDetails: { flex: 1, justifyContent: 'space-between' },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  itemText: {
    fontSize: 13,
    color: '#555',
    marginBottom: 2,
  },
  stockCardButton: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#007BFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  buttonText: { color: '#fff', fontSize: 13 },
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
    alignItems: 'center',
  },
  pageNumber: { fontSize: 16, fontWeight: '500' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContainer: { paddingBottom: 30 },

  hamburger: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 999,
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    flexDirection: 'row',
  },
  sidebarModal: {
    width: 250,
    height: '100%',
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingHorizontal: 10,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 1000,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

export default InventoryManagementScreen;
