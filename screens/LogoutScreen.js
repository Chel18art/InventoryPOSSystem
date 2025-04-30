// screens/LogoutScreen.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LogoutScreen = ({ navigation }) => {
  useEffect(() => {
    // Replace this with actual logout logic like clearing tokens, etc.
    setTimeout(() => {
      navigation.replace('Login'); // navigate to login screen
    }, 1000);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Logging out...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, color: '#555' },
});

export default LogoutScreen;
