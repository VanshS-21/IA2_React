export interface Book { _id: string; title: string; author: string; isbn: string; genre: string; totalCopies: number; availableCopies: number; createdAt?: string; updatedAt?: string; }
export interface Member { _id: string; name: string; email: string; membershipId: string; joinedDate: string; }
export interface Librarian { id: string; name: string; email: string; }
export type BorrowStatus = 'issued' | 'returned' | 'overdue';
export interface BorrowRecord { _id: string; book: Book | string; member: Member | string; issueDate: string; dueDate: string; returnDate: string | null; status: BorrowStatus; effectiveStatus?: BorrowStatus; }
export interface PopulatedBorrowRecord extends Omit<BorrowRecord, 'book' | 'member'> { book: Pick<Book, '_id' | 'title' | 'author' | 'isbn' | 'genre'>; member: Member; }
