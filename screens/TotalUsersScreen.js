import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
  Animated,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const TotalUsersScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    username: '',
    account_type: 'cashier',
    password1: '',
    password2: '',
  });

  const [users, setUsers] = useState([]); // Replace with data from API
  const [userIdCounter, setUserIdCounter] = useState(1); // For dummy ID

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
    { icon: 'sign-out-alt', label: 'Logout', screen: '' }
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

  // Helper function to validate passwords
  const arePasswordsMatching = () => {
    if (form.password1 !== form.password2) {
      Alert.alert('Error', 'Passwords do not match.');
      return false;
    }
    return true;
  };

  // Create user and add to user list
  const handleCreateUser = () => {
    if (!form.username || !form.password1 || !form.password2) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }
    
    if (arePasswordsMatching()) {
      const newUser = {
        id: userIdCounter,
        username: form.username,
        account_type: form.account_type,
        date_joined: new Date().toLocaleString(),
      };

      setUsers([...users, newUser]);
      setUserIdCounter(userIdCounter + 1);
      setForm({ username: '', account_type: 'cashier', password1: '', password2: '' });
    }
  };

  // Handle user deletion
  const handleDeleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Sidebar */}
      <Modal visible={isSidebarVisible} transparent animationType="none">
        <TouchableOpacity style={styles.overlay} onPress={toggleSidebar} />
        <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
          {sidebarLinks.map((link, index) => (
            <SidebarLink key={index} {...link} />
          ))}
        </Animated.View>
      </Modal>

      {/* Sidebar Toggle Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleSidebar}>
          <FontAwesome5 name="bars" size={24} color="#4e73df" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>User Management</Text>
      </View>

      {/* User Creation Form */}
      <View style={styles.formSection}>
        <Text style={styles.heading}>Create New User</Text>

        <View style={styles.formGroup}>
          <Text>Username</Text>
          <TextInput
            style={styles.input}
            value={form.username}
            onChangeText={(text) => setForm({ ...form, username: text })}
            placeholder="Enter username"
          />
        </View>

        <View style={styles.formGroup}>
          <Text>Account Type</Text>
          <TextInput
            style={styles.input}
            value={form.account_type}
            onChangeText={(text) => setForm({ ...form, account_type: text })}
            placeholder="admin or cashier"
          />
        </View>

        <View style={styles.formGroup}>
          <Text>Password</Text>
          <TextInput
            style={styles.input}
            value={form.password1}
            onChangeText={(text) => setForm({ ...form, password1: text })}
            secureTextEntry
          />
        </View>

        <View style={styles.formGroup}>
          <Text>Confirm Password</Text>
          <TextInput
            style={styles.input}
            value={form.password2}
            onChangeText={(text) => setForm({ ...form, password2: text })}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.createButton} onPress={handleCreateUser}>
          <Text style={styles.buttonText}>Create User</Text>
        </TouchableOpacity>
      </View>

      {/* User List */}
      <View style={styles.userListSection}>
        <Text style={styles.subHeading}>User List</Text>

        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={<Text style={styles.noUsers}>No users found.</Text>}
          renderItem={({ item }) => (
            <View style={styles.userRow}>
              <Text style={styles.cell}>{item.username}</Text>
              <Text style={styles.cell}>{item.account_type}</Text>
              <Text style={styles.cell}>{item.date_joined}</Text>
              <TouchableOpacity
                onPress={() => handleDeleteUser(item.id)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
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
  formSection: {
    marginBottom: 40,
  },
  heading: {
    fontSize: 22,
    fontWeight: '600',
    color: '#2d2d2d',
    textAlign: 'center',
    marginBottom: 20,
  },
  subHeading: {
    fontSize: 20,
    fontWeight: '500',
    color: '#2d2d2d',
    marginBottom: 15,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  createButton: {
    backgroundColor: '#008b8b',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  userListSection: {
    marginTop: 20,
  },
  userRow: {
    flexDirection: 'column',
    backgroundColor: '#fff8e1',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e2e2',
    padding: 14,
    marginBottom: 10,
    borderRadius: 8,
  },
  cell: {
    fontSize: 16,
    marginBottom: 5,
  },
  deleteButton: {
    marginTop: 5,
    backgroundColor: '#e53935',
    padding: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  noUsers: {
    textAlign: 'center',
    color: '#888',
    fontStyle: 'italic',
    marginTop: 10,
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

export default TotalUsersScreen;
