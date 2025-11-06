import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../contexts/AuthContext';

// Auth Screens
import { LoginScreen } from '../screens/LoginScreen';
import { SignUpScreen } from '../screens/SignUpScreen';

// Main Screens
import { MapScreen } from '../screens/MapScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { AddAddressScreen } from '../screens/AddAddressScreen';
import { MyAddressesScreen } from '../screens/MyAddressesScreen';
import { PublicAddressesScreen } from '../screens/PublicAddressesScreen';
import { AddressDetailScreen } from '../screens/AddressDetailScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="SignUp"
      component={SignUpScreen}
      options={{ title: 'Inscription' }}
    />
  </Stack.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: '#007AFF',
      tabBarInactiveTintColor: 'gray',
    }}
  >
    <Tab.Screen
      name="Map"
      component={MapScreen}
      options={{
        title: 'Carte',
        tabBarLabel: 'Carte',
      }}
    />
    <Tab.Screen
      name="MyAddresses"
      component={MyAddressesScreen}
      options={{
        title: 'Mes adresses',
        tabBarLabel: 'Mes adresses',
      }}
    />
    <Tab.Screen
      name="PublicAddresses"
      component={PublicAddressesScreen}
      options={{
        title: 'Adresses publiques',
        tabBarLabel: 'Publiques',
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        title: 'Profil',
        tabBarLabel: 'Profil',
      }}
    />
  </Tab.Navigator>
);

const MainStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="MainTabs"
      component={MainTabs}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="AddAddress"
      component={AddAddressScreen}
      options={{ title: 'Ajouter une adresse' }}
    />
    <Stack.Screen
      name="AddressDetail"
      component={AddressDetailScreen}
      options={{ title: 'Détails de l\'adresse' }}
    />
    <Stack.Screen
      name="MyAddresses"
      component={MyAddressesScreen}
      options={{ title: 'Mes adresses' }}
    />
    <Stack.Screen
      name="PublicAddresses"
      component={PublicAddressesScreen}
      options={{ title: 'Adresses publiques' }}
    />
  </Stack.Navigator>
);

export const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // or a loading spinner
  }

  return (
    <NavigationContainer>
      {user ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};
