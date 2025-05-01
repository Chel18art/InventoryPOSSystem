import React, { useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import SidebarLink from './SidebarLink';

const Sidebar = ({ navigate, onLogout }) => {

  const [activeScreen, setActiveScreen] = useState('AdminDashboard');

  return (
    <ScrollView style={styles.sidebar}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Inventory System</Text>
      </View>
      <SidebarLink 
        icon="tachometer-alt" 
        label="Dashboard" 
        screen="AdminDashboard" 
        navigate={setActiveScreen} 
        active={activeScreen === 'AdminDashboard'} 
      />
      <SidebarLink 
        icon="boxes" 
        label="Total Items" 
        screen="TotalItems" 
        navigate={setActiveScreen} 
        active={activeScreen === 'TotalItems'} 
      />
      <SidebarLink 
        icon="chart-line" 
        label="Total Sales" 
        screen="TotalSales" 
        navigate={setActiveScreen} 
        active={activeScreen === 'TotalSales'} 
      />
      <SidebarLink 
        icon="tags" 
        label="Total Categories" 
        screen="TotalCategories" 
        navigate={setActiveScreen} 
        active={activeScreen === 'TotalCategories'} 
      />
      <SidebarLink 
        icon="users" 
        label="Total Users" 
        screen="TotalUsers" 
        navigate={setActiveScreen} 
        active={activeScreen === 'TotalUsers'} 
      />
      <SidebarLink 
        icon="sign-out-alt" 
        label="Logout" 
        screen="LoginScreen"  // This won’t be used, but required by props
        navigate={setActiveScreen} 
        active={false} 
        onLogout={onLogout}  // ✅ Pass onLogout handler
        />

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    flex: 1,
    width: 250,
    backgroundColor: '#4e73df',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default Sidebar;
