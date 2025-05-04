import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';

const menuItems = [
  { icon: 'tachometer-alt', label: 'Dashboard', screen: 'AdminDashboard' },
  { icon: 'boxes', label: 'Inventory', screen: 'Inventory_management' },
  { icon: 'chart-line', label: 'Sales Report', screen: 'Sales' },
  { icon: 'tags', label: 'Categories', screen: 'Categories' },
  { icon: 'users', label: 'User Management', screen: 'User_management' },
  { icon: 'users', label: 'Supplier', screen: 'SupplierScreen' },
  { icon: 'sign-out-alt', label: 'Logout', screen: 'Login' }
];

const Sidebar = () => {
  const navigation = useNavigation();

  const handlePress = (screen) => {
    if (screen === 'logout') {
      navigation.navigate('Login');
    } else {
      navigation.navigate(screen);
    }
  };

  return (
    <View style={styles.sidebar}>
      {menuItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.sidebarItem}
          onPress={() => handlePress(item.screen)}
        >
          <Icon name={item.icon} size={22} color="#fff" />
          <Text style={styles.sidebarLabel}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: 260,
    backgroundColor: 'transparent', // transparent so gradient works
    paddingVertical: 20,
    paddingLeft: 15,
    paddingRight: 10,
    justifyContent: 'flex-start',
    flexDirection: 'column',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    background: 'linear-gradient(to bottom, #4e8ef7, #007bb5)', // gradient background
    borderRadius: 10,  // rounded corners for smooth edges
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#007bb5', // Slightly lighter than the background
    borderWidth: 1,
    borderColor: '#006b95',
  },
  sidebarLabel: {
    color: '#fff',
    marginLeft: 15,
    fontSize: 18,
    fontWeight: '600',
  },
});

export default Sidebar;
