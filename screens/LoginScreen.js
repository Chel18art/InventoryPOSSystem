import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';

const LoginScreen = ({ navigation, onLogin }) => {  // Accept onLogin here
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    const apiUrl = 'http://192.168.92.114:8000/api/login/'; // Use your LAN IP for physical devices

    axios
      .post(apiUrl, { username, password })
      .then((response) => {
        const { token, role } = response.data;
        const normalizedRole = role.toLowerCase();

        if (normalizedRole === 'admin') {
          onLogin(); // ✅ This sets isLoggedIn = true, and THEN Dashboard is available
        } else if (normalizedRole === 'cashier') {
          // You can handle the cashier route separately if needed
          // For now just show an error if CashierDashboard is not implemented
          setError('Cashier dashboard not implemented');
        } else {
          setError('Invalid role');
        }
      })
      .catch((err) => {
        console.log(err);
        setError('Invalid credentials');
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f0f4f8',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
    color: '#4e73df',
  },
  input: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    borderColor: '#ddd',
    backgroundColor: 'white',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4e73df',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginTop: 15,
    textAlign: 'center',
    fontSize: 16,
  },
});

export default LoginScreen;
