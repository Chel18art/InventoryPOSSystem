import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const CashierDashboard = () => {
  const [cart, setCart] = useState([]);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);

  const addToCart = () => {
    if (!itemName || quantity <= 0) {
      Alert.alert('Error', 'Please enter valid item name and quantity');
      return;
    }

    const newCartItem = {
      id: cart.length + 1,
      name: itemName,
      quantity: parseInt(quantity),
      price: 100, // example price, you can adjust as needed
    };

    setCart([...cart, newCartItem]);
    setItemName('');
    setQuantity('');
    updateTotalAmount();
  };

  const removeFromCart = (id) => {
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart);
    updateTotalAmount();
  };

  const updateTotalAmount = () => {
    let total = 0;
    cart.forEach(item => {
      total += item.price * item.quantity;
    });
    setTotalAmount(total);
  };

  const checkout = () => {
    if (cart.length === 0) {
      Alert.alert('Error', 'Your cart is empty. Please add items before proceeding to payment.');
      return;
    }
    Alert.alert('Checkout', `Total amount due: ₱${totalAmount.toFixed(2)}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>SST INVENTORY SYSTEM POS</Text>
        <Text style={styles.subTitle}>CASHIER DASHBOARD</Text>
      </View>

      <View style={styles.cartContainer}>
        <Text style={styles.cartTitle}>POS System - Cart View</Text>
        <Text style={styles.totalAmount}>Total Amount Due: ₱{totalAmount.toFixed(2)}</Text>

        <FlatList
          data={cart}
          renderItem={({ item }) => (
            <View style={styles.cartItem}>
              <Text>{item.name}</Text>
              <Text>{item.quantity}</Text>
              <Text>₱{item.price}</Text>
              <Text>₱{(item.price * item.quantity).toFixed(2)}</Text>
              <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                <Text style={styles.removeButton}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
        />

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Item Name"
            value={itemName}
            onChangeText={setItemName}
          />
          <TextInput
            style={styles.input}
            placeholder="Quantity"
            value={quantity}
            keyboardType="numeric"
            onChangeText={setQuantity}
          />
          <View style={styles.buttonsContainer}>
            <Button title="Add to Cart" onPress={addToCart} />
            <Button title="Checkout" onPress={checkout} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e2d55',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    
    backgroundColor: '#f5c150',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  cartContainer: {
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  cartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  totalAmount: {
    fontSize: 16,
    marginBottom: 20,
    color: '#00c853',
  },
  cartItem: {
    marginBottom: 15,
  },
  removeButton: {
    color: '#f44336',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  formContainer: {
    marginTop: 20,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  buttonsContainer: {
    marginTop: 20,
  },
});

export default CashierDashboard;
