import {
  createAddress,
  getUserAddresses,
  getPublicAddresses,
  deleteAddress,
} from '../../src/services/addressService';

// Mock Firestore
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  getDocs: jest.fn(),
  deleteDoc: jest.fn(),
  doc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  Timestamp: {
    now: jest.fn(() => ({ toDate: () => new Date() })),
  },
}));

// Mock Storage
jest.mock('firebase/storage', () => ({
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(() => Promise.resolve('https://example.com/photo.jpg')),
}));

// Mock Firebase config
jest.mock('../../src/services/firebase', () => ({
  db: {},
  storage: {},
}));

describe('AddressService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createAddress', () => {
    it('should create an address without photo', async () => {
      const { addDoc } = require('firebase/firestore');
      addDoc.mockResolvedValue({ id: 'test-address-id' });

      const addressId = await createAddress(
        'user-id',
        'Test Address',
        48.8566,
        2.3522,
        true,
        'Test description'
      );

      expect(addressId).toBe('test-address-id');
      expect(addDoc).toHaveBeenCalled();
    });

    it('should create a private address', async () => {
      const { addDoc } = require('firebase/firestore');
      addDoc.mockResolvedValue({ id: 'private-address-id' });

      const addressId = await createAddress(
        'user-id',
        'Private Address',
        48.8566,
        2.3522,
        false
      );

      expect(addressId).toBe('private-address-id');
    });
  });

  describe('getUserAddresses', () => {
    it('should retrieve user addresses', async () => {
      const { getDocs } = require('firebase/firestore');
      const mockAddresses = [
        {
          id: '1',
          data: () => ({
            name: 'Address 1',
            userId: 'user-id',
            isPublic: true,
            latitude: 48.8566,
            longitude: 2.3522,
            createdAt: { toDate: () => new Date() },
            updatedAt: { toDate: () => new Date() },
          }),
        },
      ];

      getDocs.mockResolvedValue({
        docs: mockAddresses,
      });

      const addresses = await getUserAddresses('user-id');

      expect(addresses).toHaveLength(1);
      expect(addresses[0].name).toBe('Address 1');
    });
  });

  describe('getPublicAddresses', () => {
    it('should retrieve only public addresses', async () => {
      const { getDocs } = require('firebase/firestore');
      const mockPublicAddresses = [
        {
          id: '1',
          data: () => ({
            name: 'Public Address',
            userId: 'other-user',
            isPublic: true,
            latitude: 48.8566,
            longitude: 2.3522,
            createdAt: { toDate: () => new Date() },
            updatedAt: { toDate: () => new Date() },
          }),
        },
      ];

      getDocs.mockResolvedValue({
        docs: mockPublicAddresses,
      });

      const addresses = await getPublicAddresses();

      expect(addresses).toHaveLength(1);
      expect(addresses[0].isPublic).toBe(true);
    });
  });

  describe('deleteAddress', () => {
    it('should delete an address', async () => {
      const { deleteDoc } = require('firebase/firestore');
      deleteDoc.mockResolvedValue(undefined);

      await deleteAddress('address-id');

      expect(deleteDoc).toHaveBeenCalled();
    });
  });
});
