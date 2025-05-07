import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const menuItems = [
  { icon: 'speedometer-outline', label: 'Dashboard', screen: 'AdminDashboard' },
  { icon: 'cube-outline', label: 'Inventory', screen: 'Inventory_management' },
  { icon: 'bar-chart-outline', label: 'Sales Report', screen: 'Sales' },
  { icon: 'list-outline', label: 'Categories', screen: 'Categories' },
  { icon: 'person-circle-outline', label: 'User Management', screen: 'User_management' },
  { icon: 'people-outline', label: 'Supplier', screen: 'SupplierScreen' },
  { icon: 'log-out-outline', label: 'Logout', screen: 'Login' },
];

const Sidebar = () => {
  const navigation = useNavigation();

  const handlePress = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <LinearGradient
      colors={['#4e8ef7', '#007bb5']}
      style={styles.sidebarContainer}
    >
      <ScrollView contentContainerStyle={styles.sidebar}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.sidebarItem}
            onPress={() => handlePress(item.screen)}
          >
            <Ionicons name={item.icon} size={22} color="#fff" />
            <Text style={styles.sidebarLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  sidebarContainer: {
    flex: 1,
    paddingTop: 50,
  },
  sidebar: {
    paddingHorizontal: 15,
    paddingBottom: 30,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: 'rgba(0, 123, 181, 0.8)',
    borderWidth: 1,
    borderColor: '#006b95',
  },
  sidebarLabel: {
    color: '#fff',
    marginLeft: 15,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Sidebar;
