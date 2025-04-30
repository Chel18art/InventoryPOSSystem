import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { addItem } from '../utils/api';
import Header from '../components/Header';

const AddItemScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    name: '',
    category: '',
    description: '',
    quantity: '',
    price: '',
    supplier: '',
    unit: '',
    image: null,
  });

  const [previewUri, setPreviewUri] = useState(null);

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const image = result.assets[0];
      setForm({ ...form, image });
      setPreviewUri(image.uri);
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'image' && value) {
          formData.append('image', {
            uri: value.uri,
            name: 'item.jpg',
            type: 'image/jpeg',
          });
        } else {
          formData.append(key, String(value));
        }
      });

      const response = await addItem(formData);
      if (response) {
        alert('Item added successfully!');
        setForm({
          name: '',
          category: '',
          description: '',
          quantity: '',
          price: '',
          supplier: '',
          unit: '',
          image: null,
        });
        setPreviewUri(null);
      }
    } catch (error) {
      console.error('Add item error:', error);
      alert('Failed to add item.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Header onMenuPress={() => navigation.toggleDrawer?.()} />

      <Text style={styles.title}>Add New Item</Text>

      {/* Name and Category */}
      <View style={styles.row}>
        <View style={styles.inputGroup}>
          <Text>Name</Text>
          <TextInput
            style={styles.input}
            value={form.name}
            onChangeText={(val) => handleInputChange('name', val)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text>Category</Text>
          <Picker
            selectedValue={form.category}
            style={styles.input}
            onValueChange={(val) => handleInputChange('category', val)}>
            <Picker.Item label="Select Category" value="" />
            <Picker.Item label="Food" value="food" />
            <Picker.Item label="Drinks" value="drinks" />
          </Picker>
        </View>
      </View>

      {/* Description */}
      <View style={styles.inputGroup}>
        <Text>Description</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          multiline
          value={form.description}
          onChangeText={(val) => handleInputChange('description', val)}
        />
      </View>

      {/* Quantity and Price */}
      <View style={styles.row}>
        <View style={styles.inputGroup}>
          <Text>Quantity</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={form.quantity}
            onChangeText={(val) => handleInputChange('quantity', val)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text>Price</Text>
          <TextInput
            style={styles.input}
            keyboardType="decimal-pad"
            value={form.price}
            onChangeText={(val) => handleInputChange('price', val)}
          />
        </View>
      </View>

      {/* Supplier */}
      <View style={styles.inputGroup}>
        <Text>Supplier</Text>
        <TextInput
          style={styles.input}
          value={form.supplier}
          onChangeText={(val) => handleInputChange('supplier', val)}
        />
      </View>

      {/* Unit */}
      <View style={styles.inputGroup}>
        <Text>Unit</Text>
        <TextInput
          style={styles.input}
          value={form.unit}
          onChangeText={(val) => handleInputChange('unit', val)}
        />
      </View>

      {/* Image Upload */}
      <View style={styles.inputGroup}>
        <Text>Upload Image (Optional)</Text>
        <Button title="Pick Image" onPress={pickImage} />
        {previewUri && (
          <Image source={{ uri: previewUri }} style={styles.imagePreview} />
        )}
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Add Item</Text>
      </TouchableOpacity>

      {/* Live Preview */}
      <View style={styles.preview}>
        <Text style={styles.previewTitle}>Live Preview</Text>
        <Text><Text style={styles.bold}>Name:</Text> {form.name || '-'}</Text>
        <Text><Text style={styles.bold}>Category:</Text> {form.category || '-'}</Text>
        <Text><Text style={styles.bold}>Quantity:</Text> {form.quantity || '-'}</Text>
        <Text><Text style={styles.bold}>Price:</Text> ${form.price || '-'}</Text>
        <Text><Text style={styles.bold}>Unit:</Text> {form.unit || '-'}</Text>
        <Text><Text style={styles.bold}>Supplier:</Text> {form.supplier || '-'}</Text>
        {previewUri && <Image source={{ uri: previewUri }} style={styles.imagePreview} />}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  inputGroup: {
    flex: 1,
    minWidth: 150,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginTop: 5,
  },
  button: {
    backgroundColor: '#00796b',
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  imagePreview: {
    marginTop: 10,
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  preview: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  previewTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default AddItemScreen;
