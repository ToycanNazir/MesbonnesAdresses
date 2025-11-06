import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import { Address } from '../types';

export const createAddress = async (
  userId: string,
  name: string,
  latitude: number,
  longitude: number,
  isPublic: boolean,
  description?: string,
  photoUri?: string
): Promise<string> => {
  let photoURL: string | undefined;

  if (photoUri) {
    const photoRef = ref(storage, `addresses/${userId}/${Date.now()}.jpg`);
    const response = await fetch(photoUri);
    const blob = await response.blob();
    await uploadBytes(photoRef, blob);
    photoURL = await getDownloadURL(photoRef);
  }

  const addressData = {
    userId,
    name,
    description: description || null,
    latitude,
    longitude,
    photoURL: photoURL || null,
    isPublic,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, 'addresses'), addressData);
  return docRef.id;
};

export const updateAddress = async (
  addressId: string,
  updates: Partial<Omit<Address, 'id' | 'userId' | 'createdAt'>>
): Promise<void> => {
  const addressRef = doc(db, 'addresses', addressId);
  await updateDoc(addressRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
};

export const deleteAddress = async (addressId: string): Promise<void> => {
  const addressRef = doc(db, 'addresses', addressId);
  await deleteDoc(addressRef);
};

export const getUserAddresses = async (userId: string): Promise<Address[]> => {
  const q = query(
    collection(db, 'addresses'),
    where('userId', '==', userId)
  );

  const querySnapshot = await getDocs(q);
  const addresses = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
    updatedAt: doc.data().updatedAt.toDate(),
  })) as Address[];

  // Trier côté client
  return addresses.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const getPublicAddresses = async (): Promise<Address[]> => {
  const q = query(
    collection(db, 'addresses'),
    where('isPublic', '==', true)
  );

  const querySnapshot = await getDocs(q);
  const addresses = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
    updatedAt: doc.data().updatedAt.toDate(),
  })) as Address[];

  // Trier côté client
  return addresses.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const getAddressById = async (addressId: string): Promise<Address | null> => {
  const addressRef = doc(db, 'addresses', addressId);
  const addressDoc = await getDoc(addressRef);

  if (!addressDoc.exists()) {
    return null;
  }

  return {
    id: addressDoc.id,
    ...addressDoc.data(),
    createdAt: addressDoc.data().createdAt.toDate(),
    updatedAt: addressDoc.data().updatedAt.toDate(),
  } as Address;
};
