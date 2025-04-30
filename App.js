import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './screens/LoginScreen';
import LayoutWithSidebar from './components/LayoutWithSidebar';
import AdminDashboard from './screens/AdminDashboard';
import CashierDashboard from './screens/CashierDashboard';
import TotalItemsScreen from './screens/TotalItemsScreen';
import TotalSalesScreen from './screens/TotalSalesScreen';
import TotalCategoriesScreen from './screens/TotalCategoriesScreen';
import TotalUsersScreen from './screens/TotalUsersScreen';
import AddItemScreen from './screens/AddItemScreen';
import LogoutScreen from './screens/LogoutScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="LogoutScreen" component={LogoutScreen} />
        <Stack.Screen name="Main" component={LayoutWithSidebar} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        <Stack.Screen name="CashierDashboard" component={CashierDashboard} />
        <Stack.Screen name="TotalItems" component={TotalItemsScreen} />
        <Stack.Screen name="TotalSales" component={TotalSalesScreen} />
        <Stack.Screen name="TotalCategories" component={TotalCategoriesScreen} />
        <Stack.Screen name="TotalUsers" component={TotalUsersScreen} />
        <Stack.Screen name="AddItemScreen" component={AddItemScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
