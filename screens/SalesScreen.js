import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';

import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

import { getSalesReport } from '../utils/api';

const SalesScreen = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const formatDate = (date) => date.toISOString().split('T')[0];

  const fetchSales = async (fromDate, toDate) => {
    setLoading(true);
    try {
      const data = await getSalesReport(null, formatDate(fromDate), formatDate(toDate));
      setSalesData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching sales data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDateRange = (period) => {
    const today = new Date();
    let fromDate, toDate;

    switch (period) {
      case 'today':
        fromDate = toDate = today;
        break;
      case 'week': {
        const startOfWeek = today.getDate() - today.getDay();
        fromDate = new Date(today.setDate(startOfWeek));
        toDate = new Date();
        break;
      }
      case 'month':
        fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
        toDate = new Date();
        break;
      case 'year':
        fromDate = new Date(today.getFullYear(), 0, 1);
        toDate = new Date();
        break;
      default:
        return [today, today];
    }

    return [fromDate, toDate];
  };

  const handlePeriodSelect = (period) => {
    const [from, to] = getDateRange(period);
    setFromDate(from);
    setToDate(to);
    fetchSales(from, to);
  };

  const downloadReport = async (format) => {
    if (format !== 'docx') return;
  
    const url = `http://192.168.87.113:8000/sales/download?start_date=${formatDate(fromDate)}&end_date=${formatDate(toDate)}&format=${format}`;
    const fileName = `sales_report_${formatDate(fromDate)}_to_${formatDate(toDate)}.${format}`;
    const fileUri = FileSystem.documentDirectory + fileName;
  
    try {
      const { granted } = await MediaLibrary.requestPermissionsAsync();
      if (!granted) {
        Alert.alert("Permission Denied", "Cannot save file without permission.");
        return;
      }
  
      const downloadResumable = FileSystem.createDownloadResumable(url, fileUri);
      const downloadResult = await downloadResumable.downloadAsync();
  
      if (!downloadResult || !downloadResult.uri) {
        throw new Error('File download failed or URI is invalid.');
      }
  
      const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
      await MediaLibrary.createAlbumAsync('Download', asset, false);
  
      Alert.alert("Download Complete", `Saved to Downloads as ${fileName}`);
    } catch (error) {
      console.error("Download failed:", error);
      Alert.alert(
        "Download Error",
        "Could not download the report. This may not work on simulators or in Expo Go on iOS. Try using a real device."
      );
    }
  };
  

  useEffect(() => {
    fetchSales(fromDate, toDate);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sales Report</Text>

      <View style={styles.buttonRow}>
        {['today', 'week', 'month', 'year'].map((period) => (
          <Pressable key={period} style={styles.periodButton} onPress={() => handlePeriodSelect(period)}>
            <Text style={styles.periodButtonText}>
              {{
                today: "Today",
                week: "This Week",
                month: "This Month",
                year: "This Year",
              }[period]}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.datePickers}>
        <Pressable style={styles.dateButton} onPress={() => setShowFromPicker(true)}>
          <Text style={styles.dateText}>From: {formatDate(fromDate)}</Text>
        </Pressable>
        <Pressable style={styles.dateButton} onPress={() => setShowToPicker(true)}>
          <Text style={styles.dateText}>To: {formatDate(toDate)}</Text>
        </Pressable>
        <Pressable style={styles.loadButton} onPress={() => fetchSales(fromDate, toDate)}>
          <Text style={styles.loadButtonText}>Load</Text>
        </Pressable>
      </View>

      {/* Download Button for DOCX only */}
      <View style={styles.downloadButtons}>
        <Pressable style={styles.loadButton} onPress={() => downloadReport('docx')}>
          <Text style={styles.loadButtonText}>Download DOCX</Text>
        </Pressable>
      </View>

      {showFromPicker && (
        <DateTimePicker
          value={fromDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowFromPicker(false);
            if (selectedDate) {
              setFromDate(selectedDate);
            }
          }}
        />
      )}

      {showToPicker && (
        <DateTimePicker
          value={toDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowToPicker(false);
            if (selectedDate) {
              setToDate(selectedDate);
            }
          }}
        />
      )}

      {(() => {
        if (loading) {
          return (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color="#008585" />
              <Text style={styles.loadingText}>Loading sales data...</Text>
            </View>
          );
        } else if (salesData.length === 0) {
          return (
            <View style={styles.centered}>
              <Text style={styles.noDataText}>No sales data available</Text>
            </View>
          );
        } else {
          return (
            <FlatList
              data={salesData}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <Text style={styles.itemText}>Date: {item.date}</Text>
                  <Text style={styles.itemText}>Total: ₱{item.total_price}</Text>
                </View>
              )}
            />
          );
        }
      })()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 10,
  },
  periodButton: {
    backgroundColor: '#008585',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 5,
  },
  periodButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  datePickers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  dateButton: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    color: '#333',
  },
  loadButton: {
    backgroundColor: '#004343',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  loadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  downloadButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    gap: 10,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  noDataText: {
    fontSize: 16,
    color: '#999',
  },
  item: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
});

export default SalesScreen;
