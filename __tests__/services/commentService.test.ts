// Mock Firebase modules BEFORE imports
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  Timestamp: {
    now: jest.fn(),
  },
}));

jest.mock('firebase/storage', () => ({
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(),
}));

jest.mock('../../src/services/firebase', () => ({
  db: {},
  storage: {},
}));

// Mock fetch globally
global.fetch = jest.fn();

import {
  addComment,
  getCommentsByAddress,
} from '../../src/services/commentService';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

describe('CommentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addComment', () => {
    it('should create a comment without photos', async () => {
      const mockDocRef = { id: 'comment123' };
      (addDoc as jest.Mock).mockResolvedValue(mockDocRef);
      (collection as jest.Mock).mockReturnValue({});
      (Timestamp.now as jest.Mock).mockReturnValue({ seconds: 1234567890, nanoseconds: 0 });

      const commentId = await addComment(
        'address123',
        'user123',
        'John Doe',
        'https://example.com/photo.jpg',
        'Great place!',
        5
      );

      expect(commentId).toBe('comment123');
      expect(addDoc).toHaveBeenCalledWith(
        {},
        expect.objectContaining({
          addressId: 'address123',
          userId: 'user123',
          userName: 'John Doe',
          userPhotoURL: 'https://example.com/photo.jpg',
          content: 'Great place!',
          rating: 5,
          photos: [],
        })
      );
    });

    it('should create a comment with photos', async () => {
      const mockDocRef = { id: 'comment456' };
      const mockBlob = new Blob(['test'], { type: 'image/jpeg' });

      (addDoc as jest.Mock).mockResolvedValue(mockDocRef);
      (collection as jest.Mock).mockReturnValue({});
      (ref as jest.Mock).mockReturnValue({});
      (uploadBytes as jest.Mock).mockResolvedValue({});
      (getDownloadURL as jest.Mock)
        .mockResolvedValueOnce('https://example.com/photo1.jpg')
        .mockResolvedValueOnce('https://example.com/photo2.jpg');
      (global.fetch as jest.Mock).mockResolvedValue({
        blob: () => Promise.resolve(mockBlob),
      });
      (Timestamp.now as jest.Mock).mockReturnValue({ seconds: 1234567890, nanoseconds: 0 });

      const commentId = await addComment(
        'address123',
        'user123',
        'Jane Smith',
        undefined,
        'Amazing views!',
        4,
        ['file:///photo1.jpg', 'file:///photo2.jpg']
      );

      expect(commentId).toBe('comment456');
      expect(uploadBytes).toHaveBeenCalledTimes(2);
      expect(getDownloadURL).toHaveBeenCalledTimes(2);
      expect(addDoc).toHaveBeenCalledWith(
        {},
        expect.objectContaining({
          addressId: 'address123',
          content: 'Amazing views!',
          rating: 4,
          photos: ['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg'],
        })
      );
    });

    it('should handle missing optional fields', async () => {
      const mockDocRef = { id: 'comment789' };
      (addDoc as jest.Mock).mockResolvedValue(mockDocRef);
      (collection as jest.Mock).mockReturnValue({});
      (Timestamp.now as jest.Mock).mockReturnValue({ seconds: 1234567890, nanoseconds: 0 });

      const commentId = await addComment(
        'address123',
        'user123',
        'Anonymous',
        undefined,
        'Nice spot'
      );

      expect(commentId).toBe('comment789');
      expect(addDoc).toHaveBeenCalledWith(
        {},
        expect.objectContaining({
          userPhotoURL: null,
          rating: null,
          photos: [],
        })
      );
    });
  });

  describe('getCommentsByAddress', () => {
    it('should retrieve comments for an address', async () => {
      const mockComments = [
        {
          id: 'comment1',
          addressId: 'address123',
          userId: 'user1',
          userName: 'User One',
          userPhotoURL: 'https://example.com/user1.jpg',
          content: 'First comment',
          rating: 5,
          photos: [],
          createdAt: { toDate: () => new Date('2025-01-15') },
        },
        {
          id: 'comment2',
          addressId: 'address123',
          userId: 'user2',
          userName: 'User Two',
          userPhotoURL: null,
          content: 'Second comment',
          rating: 4,
          photos: ['https://example.com/photo.jpg'],
          createdAt: { toDate: () => new Date('2025-01-16') },
        },
      ];

      const mockQuerySnapshot = {
        docs: mockComments.map(comment => ({
          id: comment.id,
          data: () => comment,
        })),
      };

      (query as jest.Mock).mockReturnValue({});
      (collection as jest.Mock).mockReturnValue({});
      (where as jest.Mock).mockReturnValue({});
      (getDocs as jest.Mock).mockResolvedValue(mockQuerySnapshot);

      const comments = await getCommentsByAddress('address123');

      expect(comments).toHaveLength(2);
      expect(comments[0].id).toBe('comment2'); // More recent first
      expect(comments[1].id).toBe('comment1');
      expect(where).toHaveBeenCalledWith('addressId', '==', 'address123');
    });

    it('should return empty array when no comments exist', async () => {
      const mockQuerySnapshot = {
        docs: [],
      };

      (query as jest.Mock).mockReturnValue({});
      (collection as jest.Mock).mockReturnValue({});
      (where as jest.Mock).mockReturnValue({});
      (getDocs as jest.Mock).mockResolvedValue(mockQuerySnapshot);

      const comments = await getCommentsByAddress('address999');

      expect(comments).toEqual([]);
    });

    it('should sort comments by date descending', async () => {
      const mockComments = [
        {
          id: 'comment1',
          addressId: 'address123',
          content: 'Oldest',
          createdAt: { toDate: () => new Date('2025-01-10') },
        },
        {
          id: 'comment2',
          addressId: 'address123',
          content: 'Newest',
          createdAt: { toDate: () => new Date('2025-01-20') },
        },
        {
          id: 'comment3',
          addressId: 'address123',
          content: 'Middle',
          createdAt: { toDate: () => new Date('2025-01-15') },
        },
      ];

      const mockQuerySnapshot = {
        docs: mockComments.map(comment => ({
          id: comment.id,
          data: () => comment,
        })),
      };

      (query as jest.Mock).mockReturnValue({});
      (collection as jest.Mock).mockReturnValue({});
      (where as jest.Mock).mockReturnValue({});
      (getDocs as jest.Mock).mockResolvedValue(mockQuerySnapshot);

      const comments = await getCommentsByAddress('address123');

      expect(comments[0].id).toBe('comment2'); // Newest first
      expect(comments[1].id).toBe('comment3'); // Middle
      expect(comments[2].id).toBe('comment1'); // Oldest last
    });
  });
});
