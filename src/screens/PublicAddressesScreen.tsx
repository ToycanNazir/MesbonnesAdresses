import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { getPublicAddresses } from '../services/addressService';
import { Address } from '../types';

interface PublicAddressesScreenProps {
  navigation: any;
}

export const PublicAddressesScreen: React.FC<PublicAddressesScreenProps> = ({
  navigation,
}) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const data = await getPublicAddresses();
      setAddresses(data);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger les adresses publiques');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadAddresses();
  };

  const renderAddress = ({ item }: { item: Address }) => (
    <TouchableOpacity
      style={styles.addressCard}
      onPress={() => navigation.navigate('AddressDetail', { addressId: item.id })}
    >
      {item.photoURL && (
        <Image source={{ uri: item.photoURL }} style={styles.addressImage} />
      )}
      <View style={styles.addressInfo}>
        <Text style={styles.addressName}>{item.name}</Text>
        {item.description && (
          <Text style={styles.addressDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => navigation.navigate('AddressDetail', { addressId: item.id })}
        >
          <Text style={styles.viewButtonText}>Voir les détails</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {addresses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aucune adresse publique disponible</Text>
        </View>
      ) : (
        <FlatList
          data={addresses}
          renderItem={renderAddress}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
  },
  listContainer: {
    padding: 15,
  },
  addressCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addressImage: {
    width: '100%',
    height: 150,
  },
  addressInfo: {
    padding: 15,
  },
  addressName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  addressDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  viewButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
