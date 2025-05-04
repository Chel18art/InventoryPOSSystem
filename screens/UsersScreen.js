import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  Animated,
  Image,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { getUsers } from '../utils/api';
import Sidebar from '../components/Sidebar'; // Assuming Sidebar is already created

const User_managementScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-250)).current;

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

  const fetchUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const renderUserItem = ({ item }) => (
    <View style={styles.userRow}>
      <Image source={{ uri: item.profile_picture }} style={styles.userAvatar} />
      <View style={styles.userDetails}>
        <Text style={styles.userName}>{item.username}</Text>
        <Text style={styles.userRole}>{item.account_type}</Text>
        <Text style={styles.userJoined}>Joined: {item.date_joined}</Text>
      </View>
      <TouchableOpacity style={styles.userActionButton} onPress={() => alert('User action')}>
        <FontAwesome5 name="ellipsis-v" size={18} color="#4e73df" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Sidebar */}
      <Modal visible={isSidebarVisible} transparent animationType="none">
        <TouchableOpacity style={styles.overlay} onPress={toggleSidebar} />
        <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
          <Sidebar />
        </Animated.View>
      </Modal>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleSidebar}>
          <FontAwesome5 name="bars" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>User Management</Text>
      </View>

      {/* User List Section */}
      <View style={styles.userListSection}>
        <Text style={styles.sectionTitle}>User List</Text>
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={<Text style={styles.noUsersText}>No users found.</Text>}
          renderItem={renderUserItem}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4e73df',
    height: 60,
    marginTop: 30,
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 15,
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
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  userListSection: {
    padding: 20,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  noUsersText: {
    textAlign: 'center',
    color: '#888',
    fontStyle: 'italic',
    marginTop: 20,
  },
  userRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 3,
    alignItems: 'center',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  userRole: {
    fontSize: 14,
    color: '#4e73df',
    marginTop: 5,
  },
  userJoined: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  userActionButton: {
    padding: 5,
    backgroundColor: '#f0f4f8',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default User_managementScreen;
