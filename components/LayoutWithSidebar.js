import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Sidebar from './Sidebar';

import AdminDashboard from '../screens/AdminDashboard';
import Inventory_managementScreen from '../screens/Inventory_managementScreen';
import SalesScreen from '../screens/SalesScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import User_managementScreen from '../screens/UsersScreen';

const LayoutWithSidebar = () => {
  const [activeScreen, setActiveScreen] = useState('AdminDashboard');

  // Function to render the selected screen
  const renderScreen = () => {
    switch (activeScreen) {
      case 'AdminDashboard':
        return <AdminDashboard />;
      case 'Inventory_management':
        return <Inventory_managementScreen />;
      case 'Sales':
        return <SalesScreen />;
      case 'Categories':
        return <CategoriesScreen />;
      case 'User_management':
        return <User_managementScreen />;
      default:
        return <AdminDashboard />; // fallback to default screen
    }
  };

  return (
    <View style={styles.container}>
      {/* Sidebar Component: Passing the navigation function */}
      <Sidebar navigate={setActiveScreen} />
      <View style={styles.content}>
        {/* Render the active screen */}
        {renderScreen()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row', // Sidebar and content will be side by side
  },
  content: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f6f9',
  },
});

export default LayoutWithSidebar;
