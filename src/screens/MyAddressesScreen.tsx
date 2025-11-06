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
import { useAuth } from '../contexts/AuthContext';
import { getUserAddresses, deleteAddress } from '../services/addressService';
import { Address } from '../types';

interface MyAddressesScreenProps {
  navigation: any;
}

export const MyAddressesScreen: React.FC<MyAddressesScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await getUserAddresses(user.id);
      setAddresses(data);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger les adresses');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadAddresses();
  };

  const handleDelete = (addressId: string, addressName: string) => {
    Alert.alert(
      'Supprimer l\'adresse',
      `Êtes-vous sûr de vouloir supprimer "${addressName}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAddress(addressId);
              setAddresses(prev => prev.filter(addr => addr.id !== addressId));
              Alert.alert('Succès', 'Adresse supprimée');
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de supprimer l\'adresse');
            }
          },
        },
      ]
    );
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
        <View style={styles.addressHeader}>
          <Text style={styles.addressName}>{item.name}</Text>
          <View style={[styles.badge, item.isPublic ? styles.publicBadge : styles.privateBadge]}>
            <Text style={styles.badgeText}>{item.isPublic ? 'Public' : 'Privé'}</Text>
          </View>
        </View>
        {item.description && (
          <Text style={styles.addressDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id, item.name)}
        >
          <Text style={styles.deleteButtonText}>Supprimer</Text>
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
          <Text style={styles.emptyText}>Aucune adresse enregistrée</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddAddress')}
          >
            <Text style={styles.addButtonText}>Ajouter une adresse</Text>
          </TouchableOpacity>
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
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  addressName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  publicBadge: {
    backgroundColor: '#4CAF50',
  },
  privateBadge: {
    backgroundColor: '#FF9800',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  addressDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
