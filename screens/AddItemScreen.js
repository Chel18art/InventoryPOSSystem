    import React, { useState, useRef } from 'react';
    import {
    View,
    Text,
    TextInput,
    Button,
    Image,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Animated,
    } from 'react-native';
    import * as ImagePicker from 'expo-image-picker';
    import { Picker } from '@react-native-picker/picker';
    import { addItem } from '../utils/api';
    import { FontAwesome5 } from '@expo/vector-icons';

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
        { icon: 'sign-out-alt', label: 'Logout', screen: '' },
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
        <View style={styles.wrapper}>
        {/* Sidebar */}
        <Modal visible={isSidebarVisible} transparent animationType="none">
            <TouchableOpacity style={styles.overlay} onPress={toggleSidebar} />
            <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
            {sidebarLinks.map((link, index) => (
                <SidebarLink key={index} {...link} />
            ))}
            </Animated.View>
        </Modal>

        {/* Header */}
        <View style={styles.header}>
            <TouchableOpacity onPress={toggleSidebar}>
            <FontAwesome5 name="bars" size={24} color="#4e73df" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add New Item</Text>
        </View>

        {/* Form Content */}
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
            {/* Form Fields */}
            <View style={styles.row}>
                <View style={styles.inputGroup}>
                <Text style={styles.label}>Name</Text>
                <TextInput style={styles.input} value={form.name} onChangeText={(val) => handleInputChange('name', val)} />
                </View>
                <View style={styles.inputGroup}>
                <Text style={styles.label}>Category</Text>
                <Picker selectedValue={form.category} style={styles.input} onValueChange={(val) => handleInputChange('category', val)}>
                    <Picker.Item label="Select Category" value="" />
                    <Picker.Item label="Food" value="food" />
                    <Picker.Item label="Drinks" value="drinks" />
                </Picker>
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                style={[styles.input, { height: 80 }]}
                multiline
                value={form.description}
                onChangeText={(val) => handleInputChange('description', val)}
                />
            </View>

            <View style={styles.row}>
                <View style={styles.inputGroup}>
                <Text style={styles.label}>Quantity</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={form.quantity}
                    onChangeText={(val) => handleInputChange('quantity', val)}
                />
                </View>

                <View style={styles.inputGroup}>
                <Text style={styles.label}>Price</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="decimal-pad"
                    value={form.price}
                    onChangeText={(val) => handleInputChange('price', val)}
                />
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Supplier</Text>
                <TextInput style={styles.input} value={form.supplier} onChangeText={(val) => handleInputChange('supplier', val)} />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Unit</Text>
                <TextInput style={styles.input} value={form.unit} onChangeText={(val) => handleInputChange('unit', val)} />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Upload Image (Optional)</Text>
                <Button title="Pick Image" onPress={pickImage} />
                {previewUri && <Image source={{ uri: previewUri }} style={styles.imagePreview} />}
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Add Item</Text>
            </TouchableOpacity>
            </View>

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
        </View>
    );
    };

    const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#f1f5f9',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        elevation: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4e73df',
        marginLeft: 15,
    },
    container: {
        padding: 20,
    },
    card: {
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 12,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    inputGroup: {
        flex: 1,
        minWidth: 160,
        marginBottom: 15,
    },
    label: {
        fontWeight: '600',
        marginBottom: 5,
        color: '#374151',
    },
    input: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#2563eb',
        padding: 14,
        borderRadius: 10,
        marginTop: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    imagePreview: {
        marginTop: 10,
        width: '100%',
        height: 200,
        borderRadius: 10,
        borderColor: '#d1d5db',
        borderWidth: 1,
    },
    preview: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        borderColor: '#e5e7eb',
        borderWidth: 1,
    },
    previewTitle: {
        fontWeight: 'bold',
        marginBottom: 10,
        fontSize: 16,
        color: '#1f2937',
    },
    bold: {
        fontWeight: '600',
        color: '#111827',
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

    export default AddItemScreen;
