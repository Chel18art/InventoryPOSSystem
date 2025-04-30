import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  Animated,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { getDashboardStats } from '../utils/api';

const AdminDashboardScreen = ({ navigation }) => {
  const [stats, setStats] = useState({
    total_items: null,
    total_sales: null,
    total_categories: null,
    total_users: null,
  });
  const [loading, setLoading] = useState(true);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-250)).current;

  const sidebarLinks = [
    { icon: 'tachometer-alt', label: 'Dashboard', screen: 'AdminDashboard' },
    { icon: 'boxes', label: 'Inventory', screen: 'TotalItems' },
    { icon: 'plus-circle', label: 'Add Item', screen: 'AddItemScreen' },
    { icon: 'chart-line', label: 'Sales Report', screen: 'TotalSales' },
    { icon: 'tags', label: 'Categories', screen: 'TotalCategories' },
    { icon: 'users', label: 'User Management', screen: 'TotalUsers' },
    { icon: 'users', label: 'Supplier', screen: 'SupplierScreen' },
    { icon: 'sign-out-alt', label: 'Logout', screen: 'LogoutScreen' }
  ];

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getDashboardStats();
      setStats(data);
      setLoading(false);
    };
    fetchStats();
  }, []);

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
        navigation.navigate(screen);
      }}
    >
      <FontAwesome5 name={icon} size={18} color="#fff" style={styles.sidebarIcon} />
      <Text style={styles.sidebarText}>{label}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4e73df" />
        <Text style={styles.loadingText}>Loading Dashboard...</Text>
      </View>
    );
  }

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
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
      </View>

      {/* Dashboard Body */}
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Overview</Text>

        <View style={styles.statsGrid}>
          <TouchableOpacity
            style={[styles.statCard, styles.gradientPurple]}
            onPress={() => navigation.navigate('TotalItems')}
          >
            <FontAwesome5 name="box" size={30} color="#fff" style={styles.icon} />
            <Text style={styles.cardTitle}>Total Items</Text>
            <Text style={styles.cardValue}>{stats.total_items}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.statCard, styles.gradientGreen]}
            onPress={() => navigation.navigate('TotalSales')}
          >
            <FontAwesome5 name="dollar-sign" size={30} color="#fff" style={styles.icon} />
            <Text style={styles.cardTitle}>Total Sales</Text>
            <Text style={styles.cardValue}>${stats.total_sales}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.statCard, styles.gradientOrange]}
            onPress={() => navigation.navigate('TotalCategories')}
          >
            <FontAwesome5 name="tags" size={30} color="#fff" style={styles.icon} />
            <Text style={styles.cardTitle}>Total Categories</Text>
            <Text style={styles.cardValue}>{stats.total_categories}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.statCard, styles.gradientLime]}
            onPress={() => navigation.navigate('TotalUsers')}
          >
            <FontAwesome5 name="users" size={30} color="#fff" style={styles.icon} />
            <Text style={styles.cardTitle}>Total Users</Text>
            <Text style={styles.cardValue}>{stats.total_users}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f4f8',
  },
  header: {
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#4e73df',
    marginBottom: 30,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  icon: {
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 5,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  gradientPurple: {
    backgroundColor: '#7e57c2',
  },
  gradientGreen: {
    backgroundColor: '#00c853',
  },
  gradientOrange: {
    backgroundColor: '#ff6f00',
  },
  gradientLime: {
    backgroundColor: '#76ff03',
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

export default AdminDashboardScreen;
