import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const SidebarLink = ({ icon, label, screen, navigate, active }) => {
  return (
    <TouchableOpacity 
      style={[styles.link, active && styles.activeLink]} 
      onPress={() => navigate(screen)}
    >
      <FontAwesome5 name={icon} size={18} color={active ? "#fff" : "#4e73df"} style={styles.icon} />
      <Text style={[styles.label, active && styles.activeLabel]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 5,
    backgroundColor: 'transparent',
    transition: 'background-color 0.3s ease', // Smooth background transition (if supported)
  },
  activeLink: {
    backgroundColor: '#2e59d9', // Active link background color
  },
  icon: {
    marginRight: 15,
  },
  label: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600', // Slightly bold for better visibility
  },
  activeLabel: {
    color: '#fff', // Change text color when active
  },
});

export default SidebarLink;
