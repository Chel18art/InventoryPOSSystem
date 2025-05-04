import React from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import SidebarLink from './SidebarLink';
import Icon from 'react-native-vector-icons/FontAwesome5';

const CustomDrawerContent = ({ navigation, onLogout }) => {
  return (
    <ScrollView style={styles.sidebar}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Inventory System</Text>
      </View>

      <SidebarLink icon="tachometer-alt" label="Dashboard" screen="AdminDashboard" navigate={navigation.navigate} />
      <SidebarLink icon="boxes" label="Total Items" screen="Inventory_management" navigate={navigation.navigate} />
      <SidebarLink icon="chart-line" label="Total Sales" screen="Sales" navigate={navigation.navigate} />
      <SidebarLink icon="tags" label="Total Categories" screen="Categories" navigate={navigation.navigate} />
      <SidebarLink icon="users" label="Total Users" screen="User_management" navigate={navigation.navigate} />

      {/* Logout button */}
      <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
        <Icon name="sign-out-alt" size={18} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    flex: 1,
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
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dc2626',
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default CustomDrawerContent;
