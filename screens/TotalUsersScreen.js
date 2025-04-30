import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';

const TotalUsersScreen = () => {
  const [form, setForm] = useState({
    username: '',
    account_type: 'cashier',
    password1: '',
    password2: '',
  });

  const [users, setUsers] = useState([]); // Replace with data from API
  const [userIdCounter, setUserIdCounter] = useState(1); // For dummy ID

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleCreateUser = () => {
    if (form.password1 !== form.password2) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    const newUser = {
      id: userIdCounter,
      username: form.username,
      account_type: form.account_type,
      date_joined: new Date().toLocaleString(),
    };
    setUsers([...users, newUser]);
    setUserIdCounter(userIdCounter + 1);
    setForm({ username: '', account_type: 'cashier', password1: '', password2: '' });
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formSection}>
        <Text style={styles.heading}>User Management</Text>

        <View style={styles.formGroup}>
          <Text>Username</Text>
          <TextInput
            style={styles.input}
            value={form.username}
            onChangeText={(text) => handleInputChange('username', text)}
            placeholder="Enter username"
          />
        </View>

        <View style={styles.formGroup}>
          <Text>Account Type</Text>
          <TextInput
            style={styles.input}
            value={form.account_type}
            onChangeText={(text) => handleInputChange('account_type', text)}
            placeholder="admin or cashier"
          />
        </View>

        <View style={styles.formGroup}>
          <Text>Password</Text>
          <TextInput
            style={styles.input}
            value={form.password1}
            onChangeText={(text) => handleInputChange('password1', text)}
            secureTextEntry
          />
        </View>

        <View style={styles.formGroup}>
          <Text>Confirm Password</Text>
          <TextInput
            style={styles.input}
            value={form.password2}
            onChangeText={(text) => handleInputChange('password2', text)}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.createButton} onPress={handleCreateUser}>
          <Text style={styles.buttonText}>Create User</Text>
        </TouchableOpacity>
      </View>

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
});

export default TotalUsersScreen;
