import type { Book, Member, PopulatedBorrowRecord } from '../../types/models';
export const mockBooks: Book[] = [
  { _id: 'b1', title: 'The Left Hand of Darkness', author: 'Ursula K. Le Guin', isbn: '9780441478125', genre: 'Science Fiction', totalCopies: 1, availableCopies: 1 },
  { _id: 'b2', title: 'Pachinko', author: 'Min Jin Lee', isbn: '9781455563937', genre: 'Fiction', totalCopies: 4, availableCopies: 2 },
  { _id: 'b3', title: 'Braiding Sweetgrass', author: 'Robin Wall Kimmerer', isbn: '9781571313560', genre: 'Nature', totalCopies: 3, availableCopies: 0 },
  { _id: 'b4', title: 'The Design of Everyday Things', author: 'Don Norman', isbn: '9780465050659', genre: 'Design', totalCopies: 3, availableCopies: 3 },
  { _id: 'b5', title: 'Kindred', author: 'Octavia E. Butler', isbn: '9780807083697', genre: 'Science Fiction', totalCopies: 2, availableCopies: 1 },
  { _id: 'b6', title: 'The Night Circus', author: 'Erin Morgenstern', isbn: '9780307744432', genre: 'Fantasy', totalCopies: 2, availableCopies: 2 }
];
export const mockMembers: Member[] = [
  { _id: 'm1', name: 'Anika Shah', email: 'anika.shah@example.test', membershipId: 'MEM-0001A', joinedDate: '2025-08-10T00:00:00.000Z' },
  { _id: 'm2', name: 'Diego Santos', email: 'diego.santos@example.test', membershipId: 'MEM-0002A', joinedDate: '2025-08-15T00:00:00.000Z' },
  { _id: 'm3', name: 'Meera Patel', email: 'meera.patel@example.test', membershipId: 'MEM-0003A', joinedDate: '2025-09-01T00:00:00.000Z' }
];
export const mockRecords: PopulatedBorrowRecord[] = [{ _id: 'r1', book: mockBooks[1]!, member: mockMembers[0]!, issueDate: '2026-09-01T00:00:00.000Z', dueDate: '2026-09-15T00:00:00.000Z', returnDate: null, status: 'overdue' }];
