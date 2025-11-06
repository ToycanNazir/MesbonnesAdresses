import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../contexts/AuthContext';
import { getAddressById } from '../services/addressService';
import { getCommentsByAddress, addComment } from '../services/commentService';
import { Address, Comment } from '../types';

interface AddressDetailScreenProps {
  navigation: any;
  route: any;
}

export const AddressDetailScreen: React.FC<AddressDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { addressId } = route.params;
  const { user } = useAuth();

  const [address, setAddress] = useState<Address | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState(0);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [addressData, commentsData] = await Promise.all([
        getAddressById(addressId),
        getCommentsByAddress(addressId),
      ]);

      setAddress(addressData);
      setComments(commentsData);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger les données');
    } finally {
      setLoading(false);
    }
  };

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Accès à la galerie requis');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const uris = result.assets.map(asset => asset.uri);
      setSelectedPhotos(prev => [...prev, ...uris]);
    }
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un commentaire');
      return;
    }

    if (!user) {
      Alert.alert('Erreur', 'Vous devez être connecté');
      return;
    }

    setSubmitting(true);
    try {
      await addComment(
        addressId,
        user.id,
        user.displayName || user.email || 'Utilisateur',
        user.photoURL,
        commentText,
        rating > 0 ? rating : undefined,
        selectedPhotos.length > 0 ? selectedPhotos : undefined
      );

      setCommentText('');
      setRating(0);
      setSelectedPhotos([]);
      await loadData();
      Alert.alert('Succès', 'Commentaire ajouté');
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Impossible d\'ajouter le commentaire');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!address) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Adresse non trouvée</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {address.photoURL && (
        <Image source={{ uri: address.photoURL }} style={styles.headerImage} />
      )}

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{address.name}</Text>
          <View style={[styles.badge, address.isPublic ? styles.publicBadge : styles.privateBadge]}>
            <Text style={styles.badgeText}>{address.isPublic ? 'Public' : 'Privé'}</Text>
          </View>
        </View>

        {address.description && (
          <Text style={styles.description}>{address.description}</Text>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Commentaires ({comments.length})</Text>

          {comments.map((comment) => (
            <View key={comment.id} style={styles.commentCard}>
              <View style={styles.commentHeader}>
                {comment.userPhotoURL ? (
                  <Image source={{ uri: comment.userPhotoURL }} style={styles.commentAvatar} />
                ) : (
                  <View style={styles.commentAvatarPlaceholder}>
                    <Text style={styles.commentAvatarText}>
                      {comment.userName.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
                <View style={styles.commentInfo}>
                  <Text style={styles.commentAuthor}>{comment.userName}</Text>
                  <Text style={styles.commentDate}>
                    {comment.createdAt.toLocaleDateString()}
                  </Text>
                </View>
                {comment.rating && (
                  <Text style={styles.commentRating}>⭐ {comment.rating}/5</Text>
                )}
              </View>

              <Text style={styles.commentText}>{comment.content}</Text>

              {comment.photos.length > 0 && (
                <ScrollView horizontal style={styles.commentPhotos}>
                  {comment.photos.map((photo, index) => (
                    <Image
                      key={index}
                      source={{ uri: photo }}
                      style={styles.commentPhoto}
                    />
                  ))}
                </ScrollView>
              )}
            </View>
          ))}

          <View style={styles.addCommentSection}>
            <Text style={styles.sectionTitle}>Ajouter un commentaire</Text>

            <View style={styles.ratingContainer}>
              <Text style={styles.ratingLabel}>Note:</Text>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  style={styles.starButton}
                >
                  <Text style={styles.star}>{star <= rating ? '⭐' : '☆'}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.commentInput}
              placeholder="Votre commentaire..."
              value={commentText}
              onChangeText={setCommentText}
              multiline
              numberOfLines={4}
            />

            {selectedPhotos.length > 0 && (
              <ScrollView horizontal style={styles.selectedPhotos}>
                {selectedPhotos.map((photo, index) => (
                  <Image key={index} source={{ uri: photo }} style={styles.selectedPhoto} />
                ))}
              </ScrollView>
            )}

            <TouchableOpacity style={styles.photoPickerButton} onPress={pickImages}>
              <Text style={styles.photoPickerButtonText}>Ajouter des photos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitButton, submitting && styles.buttonDisabled]}
              onPress={handleSubmitComment}
              disabled={submitting}
            >
              <Text style={styles.submitButtonText}>
                {submitting ? 'Envoi...' : 'Publier le commentaire'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
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
  errorText: {
    fontSize: 18,
    color: '#666',
  },
  headerImage: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
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
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  commentCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commentAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  commentAvatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  commentInfo: {
    flex: 1,
  },
  commentAuthor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  commentDate: {
    fontSize: 12,
    color: '#999',
  },
  commentRating: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  commentText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  commentPhotos: {
    flexDirection: 'row',
  },
  commentPhoto: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
  },
  addCommentSection: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  ratingLabel: {
    fontSize: 16,
    marginRight: 10,
    color: '#333',
  },
  starButton: {
    padding: 5,
  },
  star: {
    fontSize: 24,
  },
  commentInput: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  selectedPhotos: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  selectedPhoto: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  photoPickerButton: {
    backgroundColor: '#666',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  photoPickerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
