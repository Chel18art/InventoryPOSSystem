import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { DataTable, Button, Card } from 'react-native-paper';
import { FontAwesome5 } from '@expo/vector-icons';

const periods = ['today', 'week', 'month', 'year'];

const TotalSalesScreen = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [totalSales, setTotalSales] = useState(0);
  const [salesData, setSalesData] = useState([]);

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

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Sales Report for {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}</Text>

      <View style={styles.periodButtons}>
        {periods.map((period) => (
          <TouchableOpacity
            key={period}
            style={styles.periodBtn}
            onPress={() => setSelectedPeriod(period)}
          >
            <FontAwesome5 name={getIcon(period)} size={18} color="#fff" />
            <Text style={styles.btnText}>
              {period === 'today' ? "Today's Sales" :
               period === 'week' ? "This Week's Sales" :
               period === 'month' ? "This Month's Sales" : "Annual Sales"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Card style={styles.salesCard}>
        <Card.Title title={`${capitalize(selectedPeriod)} Sales`} titleStyle={styles.cardTitle} />
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
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2f4f5',
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
    gap: 10,
    marginBottom: 20,
  },
  periodBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#008585',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    margin: 5,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 16,
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
    gap: 20,
    flexWrap: 'wrap',
    marginBottom: 40,
  },
  downloadBtn: {
    margin: 10,
  },
});

export default TotalSalesScreen;
