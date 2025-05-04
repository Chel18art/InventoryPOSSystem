import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

// Screens
import LoginScreen from './screens/LoginScreen';
import AdminDashboard from './screens/AdminDashboard';
import Inventory_management from './screens/Inventory_managementScreen';
import Sales from './screens/SalesScreen';
import Categories from './screens/CategoriesScreen';
import User_management from './screens/UsersScreen';
import SupplierScreen from './screens/SupplierScreen';

// Drawer
import CustomDrawerContent from './components/CustomDrawerContent';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Drawer Navigator for app screens
const DrawerNavigator = ({ onLogout }) => (
  <Drawer.Navigator
    initialRouteName="AdminDashboard"
    drawerContent={(props) => <CustomDrawerContent {...props} onLogout={onLogout} />}
    screenOptions={{ headerShown: false }}
  >
    <Drawer.Screen name="AdminDashboard" component={AdminDashboard} />
    <Drawer.Screen name="Inventory_management" component={Inventory_management} />
    <Drawer.Screen name="Sales" component={Sales} />
    <Drawer.Screen name="Categories" component={Categories} />
    <Drawer.Screen name="User_management" component={User_management} />
    <Drawer.Screen name="SupplierScreen" component={SupplierScreen} />
  </Drawer.Navigator>
);

// Main App Navigator
const AppNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <Stack.Screen name="LoginScreen">
            {(props) => <LoginScreen {...props} onLogin={() => setIsLoggedIn(true)} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Dashboard">
            {(props) => <DrawerNavigator {...props} onLogout={() => setIsLoggedIn(false)} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
