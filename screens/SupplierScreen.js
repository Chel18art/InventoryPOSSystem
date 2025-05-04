import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  FlatList,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { getSuppliers } from '../utils/api'; // Make sure this endpoint is correct

const SupplierScreen = ({ navigation }) => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const slideAnim = useRef(new Animated.Value(-250)).current;

  const sidebarLinks = [
    { icon: 'tachometer-alt', label: 'Dashboard', screen: 'AdminDashboard' },
    { icon: 'boxes', label: 'Inventory', screen: 'Inventory_management' },
    { icon: 'chart-line', label: 'Sales Report', screen: 'Sales' },
    { icon: 'tags', label: 'Categories', screen: 'Categories' },
    { icon: 'users', label: 'User Management', screen: 'User_management' },
    { icon: 'users', label: 'Supplier', screen: 'SupplierScreen' },
    { icon: 'sign-out-alt', label: 'Logout', screen: '' },
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

  const fetchSuppliers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getSuppliers();
      setSuppliers(data);
    } catch (err) {
      console.error('API Error:', err?.response?.data || err.message);
      setError(
        err?.response?.data?.message || 'Failed to load suppliers. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const SidebarLink = ({ icon, label, screen }) => (
    <TouchableOpacity
      style={styles.sidebarLink}
      onPress={() => {
        toggleSidebar();
        navigation.navigate(screen);
      }}
    >
      <FontAwesome5 name={icon} size={18} color="#fff" style={styles.sidebarIcon} />
      <Text style={styles.sidebarText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Sidebar Modal */}
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
        <Text style={styles.headerTitle}>Suppliers</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.text}>List of Suppliers</Text>

        {loading && <Text>Loading...</Text>}
        {error && <Text style={{ color: 'red' }}>{error}</Text>}

        {!loading && !error && (
          <FlatList
          data={suppliers}
          keyExtractor={(item, index) => (item?.id ? item.id.toString() : index.toString())}
          renderItem={({ item }) => (
            <View style={styles.supplierCard}>
              <Text style={styles.supplierName}>{item.name}</Text>
              <Text style={styles.supplierDetails}>Contact Person: {item.contact_person}</Text>
              <Text style={styles.supplierDetails}>Phone: {item.phone}</Text>
              <Text style={styles.supplierDetails}>Email: {item.email}</Text>
              <Text style={styles.supplierDetails}>Address: {item.address}</Text>
              <Text style={styles.supplierDetails}>Company: {item.company}</Text>
            </View>
          )}
          
        />
        
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
    padding: 10,
  },
  text: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
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
  supplierCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 5,
    width: '100%',
  },
  supplierName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  supplierDetails: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
});

export default SupplierScreen;
