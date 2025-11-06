export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
}

export interface Address {
  id: string;
  userId: string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  photoURL?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  addressId: string;
  userId: string;
  userName: string;
  userPhotoURL?: string;
  content: string;
  rating?: number;
  photos: string[];
  createdAt: Date;
}

export interface Location {
  latitude: number;
  longitude: number;
}
