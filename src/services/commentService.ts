import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import { Comment } from '../types';

export const addComment = async (
  addressId: string,
  userId: string,
  userName: string,
  userPhotoURL: string | undefined,
  content: string,
  rating?: number,
  photoUris?: string[]
): Promise<string> => {
  const photos: string[] = [];

  if (photoUris && photoUris.length > 0) {
    for (const uri of photoUris) {
      const photoRef = ref(storage, `comments/${addressId}/${Date.now()}_${Math.random()}.jpg`);
      const response = await fetch(uri);
      const blob = await response.blob();
      await uploadBytes(photoRef, blob);
      const url = await getDownloadURL(photoRef);
      photos.push(url);
    }
  }

  const commentData = {
    addressId,
    userId,
    userName,
    userPhotoURL: userPhotoURL || null,
    content,
    rating: rating || null,
    photos,
    createdAt: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, 'comments'), commentData);
  return docRef.id;
};

export const getCommentsByAddress = async (addressId: string): Promise<Comment[]> => {
  const q = query(
    collection(db, 'comments'),
    where('addressId', '==', addressId)
  );

  const querySnapshot = await getDocs(q);
  const comments = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
  })) as Comment[];

  // Trier côté client
  return comments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};
