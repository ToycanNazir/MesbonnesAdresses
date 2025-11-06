import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useAuth } from '../contexts/AuthContext';
import { Address } from '../types';
import { getUserAddresses, getPublicAddresses } from '../services/addressService';

interface MapScreenProps {
  navigation: any;
}

export const MapScreen: React.FC<MapScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('MapScreen: useEffect déclenché, user:', user?.id || 'null');
    requestLocationPermission();
  }, []);

  useEffect(() => {
    if (user) {
      console.log('MapScreen: Utilisateur détecté, chargement des adresses');
      loadAddresses();
    }
  }, [user]);

  const requestLocationPermission = async () => {
    try {
      console.log('MapScreen: Demande de permission de localisation...');
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log('MapScreen: Permission status:', status);

      if (status !== 'granted') {
        console.log('MapScreen: Permission refusée, utilisation position par défaut');
        // Position par défaut : votre adresse
        setLocation({
          coords: {
            latitude: 48.95152,
            longitude: 2.55522,
            altitude: null,
            accuracy: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null,
          },
          timestamp: Date.now(),
        } as Location.LocationObject);
        return;
      }

      console.log('MapScreen: Récupération de la position...');

      // Timeout après 10 secondes pour éviter de bloquer indéfiniment
      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout de géolocalisation')), 10000)
      );

      try {
        const currentLocation = await Promise.race([
          Location.getCurrentPositionAsync({}),
          timeout
        ]) as Location.LocationObject;

        console.log('MapScreen: Position obtenue:', currentLocation.coords.latitude, currentLocation.coords.longitude);
        setLocation(currentLocation);
        console.log('MapScreen: Location state updated');
      } catch (timeoutError) {
        console.warn('MapScreen: Timeout, utilisation position par défaut');
        setLocation({
          coords: {
            latitude: 48.95152,
            longitude: 2.55522,
            altitude: null,
            accuracy: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null,
          },
          timestamp: Date.now(),
        } as Location.LocationObject);
      }
    } catch (error) {
      console.error('MapScreen: Erreur de localisation:', error);
      // En cas d'erreur, utiliser position par défaut au lieu d'afficher une alerte
      console.log('MapScreen: Utilisation position par défaut après erreur');
      setLocation({
        coords: {
          latitude: 48.95152,
          longitude: 2.55522,
          altitude: null,
          accuracy: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      } as Location.LocationObject);
    }
  };

  const loadAddresses = async () => {
    try {
      setLoading(true);
      if (!user) {
        console.log('MapScreen: Pas d\'utilisateur connecté');
        return;
      }

      console.log('MapScreen: Chargement des adresses pour user:', user.id);
      const [userAddresses, publicAddresses] = await Promise.all([
        getUserAddresses(user.id),
        getPublicAddresses(),
      ]);

      console.log('MapScreen: Adresses utilisateur:', userAddresses.length);
      console.log('MapScreen: Adresses publiques:', publicAddresses.length);

      // Combiner les adresses en évitant les doublons
      const allAddresses = [...userAddresses];
      publicAddresses.forEach(pubAddr => {
        if (!allAddresses.find(addr => addr.id === pubAddr.id)) {
          allAddresses.push(pubAddr);
        }
      });

      console.log('MapScreen: Total adresses:', allAddresses.length);
      setAddresses(allAddresses);
    } catch (error) {
      console.error('MapScreen: Erreur de chargement des adresses:', error);
      Alert.alert('Erreur', 'Impossible de charger les adresses: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkerPress = (address: Address) => {
    navigation.navigate('AddressDetail', { addressId: address.id });
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Chargement du profil...</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Obtention de votre localisation...</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Chargement des adresses...</Text>
      </View>
    );
  }

  console.log('MapScreen: Rendu de la carte avec', addresses.length, 'adresses');
  console.log('MapScreen: Position de la carte:', location.coords.latitude, location.coords.longitude);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation
        showsMyLocationButton
        onMapReady={() => console.log('MapScreen: Map is ready!')}
      >
        {addresses.map((address) => (
          <Marker
            key={address.id}
            coordinate={{
              latitude: address.latitude,
              longitude: address.longitude,
            }}
            title={address.name}
            description={address.description}
            pinColor={address.userId === user?.id ? 'red' : 'blue'}
            onPress={() => handleMarkerPress(address)}
          />
        ))}
      </MapView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddAddress', { location })}
      >
        <Text style={styles.addButtonText}>+ Ajouter une adresse</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  map: {
    flex: 1,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
