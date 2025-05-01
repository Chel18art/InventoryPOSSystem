import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Sidebar from './Sidebar';

import AdminDashboard from '../screens/AdminDashboard';
import TotalItemsScreen from '../screens/TotalItemsScreen';
import TotalSalesScreen from '../screens/TotalSalesScreen';
import TotalCategoriesScreen from '../screens/TotalCategoriesScreen';
import TotalUsersScreen from '../screens/TotalUsersScreen';
import CashierDashboard from '../screens/CashierDashboard'; // Optional

const LayoutWithSidebar = () => {
  const [activeScreen, setActiveScreen] = useState('AdminDashboard');

  // Function to render the selected screen
  const renderScreen = () => {
    switch (activeScreen) {
      case 'AdminDashboard':
        return <AdminDashboard />;
      case 'TotalItems':
        return <TotalItemsScreen />;
      case 'TotalSales':
        return <TotalSalesScreen />;
      case 'TotalCategories':
        return <TotalCategoriesScreen />;
      case 'TotalUsers':
        return <TotalUsersScreen />;
      case 'CashierDashboard':
        return <CashierDashboard />;
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
