import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  StyleSheet,
  Animated,
  Modal,
} from 'react-native';
import { DataTable, Button, Card } from 'react-native-paper';
import { FontAwesome5 } from '@expo/vector-icons';
import Sidebar from '../components/Sidebar'; // Adjust the path if needed

const periods = ['today', 'week', 'month', 'year'];

const TotalSalesScreen = ({ navigation }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [totalSales, setTotalSales] = useState(0);
  const [salesData, setSalesData] = useState([]);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-250)).current;

  useEffect(() => {
    fetchSalesData(selectedPeriod);
  }, [selectedPeriod]);

  const fetchSalesData = async (period) => {
    try {
      const response = await fetch(`https://your-api.com/api/sales-report?period=${period}`);
      const data = await response.json();
      setTotalSales(data.total_sales);
      setSalesData(data.sales_data);
    } catch (error) {
      console.error('Failed to fetch sales data:', error);
    }
  };

  const handleDownload = (format) => {
    const url = `https://your-api.com/api/download-sales-report?period=${selectedPeriod}&format=${format}`;
    Linking.openURL(url);
  };

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

  return (
    <View style={styles.mainContainer}>
      {/* Sidebar Modal */}
      <Modal visible={isSidebarVisible} transparent animationType="none">
        <TouchableOpacity style={styles.overlay} onPress={toggleSidebar} />
        <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
          <SidebarLink icon="tachometer-alt" label="Dashboard" screen="AdminDashboard" />
          <SidebarLink icon="boxes" label="Inventory" screen="TotalItems" />
          <SidebarLink icon="plus-circle" label="Add Item" screen="AddItemScreen" />
          <SidebarLink icon="chart-line" label="Sales Report" screen="TotalSales" />
          <SidebarLink icon="tags" label="Categories" screen="TotalCategories" />
          <SidebarLink icon="users" label="User Management" screen="TotalUsers" />
          <SidebarLink icon="users" label="Supplier" screen="SupplierScreen" />
          <SidebarLink icon="sign-out-alt" label="Logout" screen="" />
        </Animated.View>
      </Modal>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleSidebar}>
          <FontAwesome5 name="bars" size={24} color="#4e73df" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sales Report</Text>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.container}>
        <Text style={styles.title}>
          Sales Report for {capitalize(selectedPeriod)}
        </Text>

        {/* Period Filter Buttons */}
        <View style={styles.periodButtons}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period}
              style={styles.periodBtn}
              onPress={() => setSelectedPeriod(period)}
            >
              <FontAwesome5 name={getIcon(period)} size={18} color="#fff" />
              <Text style={styles.btnText}>
                {period === 'today'
                  ? "Today's Sales"
                  : period === 'week'
                  ? "This Week's Sales"
                  : period === 'month'
                  ? "This Month's Sales"
                  : "Annual Sales"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Sales Data Card */}
        <Card style={styles.salesCard}>
          <Card.Title
            title={`${capitalize(selectedPeriod)} Sales`}
            titleStyle={styles.cardTitle}
          />
          <Card.Content>
            <Text style={styles.totalSales}>Total Sales: ₱{totalSales.toFixed(2)}</Text>
            {salesData.length > 0 ? (
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>Date</DataTable.Title>
                  <DataTable.Title>Item</DataTable.Title>
                  <DataTable.Title numeric>Price</DataTable.Title>
                  <DataTable.Title numeric>Qty</DataTable.Title>
                  <DataTable.Title numeric>Subtotal</DataTable.Title>
                </DataTable.Header>
                {salesData.map((sale, index) =>
                  sale.items.map((item, i) => (
                    <DataTable.Row key={`${index}-${i}`}>
                      <DataTable.Cell>{sale.date}</DataTable.Cell>
                      <DataTable.Cell>{item.item.name}</DataTable.Cell>
                      <DataTable.Cell numeric>₱{item.price.toFixed(2)}</DataTable.Cell>
                      <DataTable.Cell numeric>{item.quantity}</DataTable.Cell>
                      <DataTable.Cell numeric>₱{item.subtotal.toFixed(2)}</DataTable.Cell>
                    </DataTable.Row>
                  ))
                )}
              </DataTable>
            ) : (
              <Text style={{ marginTop: 20 }}>No sales data for the selected period.</Text>
            )}
          </Card.Content>
        </Card>

        {/* Download Buttons */}
        <View style={styles.downloadButtons}>
          <Button
            icon="file-pdf"
            mode="contained"
            buttonColor="#d32f2f"
            onPress={() => handleDownload('pdf')}
            style={styles.downloadBtn}
          >
            Download PDF
          </Button>
          <Button
            icon="file-word"
            mode="contained"
            buttonColor="#1976d2"
            onPress={() => handleDownload('docx')}
            style={styles.downloadBtn}
          >
            Download DOCX
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

// Helpers
const getIcon = (period) => {
  switch (period) {
    case 'today':
      return 'calendar-day';
    case 'week':
      return 'calendar-week';
    case 'month':
      return 'calendar-alt';
    case 'year':
      return 'calendar';
    default:
      return 'calendar';
  }
};

const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);

// Styles
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f2f4f5',
  },
  container: {
    padding: 20,
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  periodButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  periodBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#008585',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 5,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 15,
  },
  salesCard: {
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    color: '#333',
  },
  totalSales: {
    fontSize: 18,
    color: '#008585',
    marginBottom: 15,
    fontWeight: 'bold',
  },
  downloadButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 40,
  },
  downloadBtn: {
    margin: 10,
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
    elevation: 5,
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

export default TotalSalesScreen;
