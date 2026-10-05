import type { Librarian, Member, PopulatedBorrowRecord } from './models';
export interface PageMeta { page: number; limit: number; total: number; totalPages: number; hasNext: boolean; hasPrev: boolean; member?: Member; }
export interface ApiSuccess<T> { success: true; data: T; meta?: PageMeta; }
export interface ApiErrorBody { success: false; error: { code: string; message: string; details?: Array<{ path: string; message: string }> }; }
export interface Paginated<T> { data: T[]; meta: PageMeta; }
export interface LoginRequest { email: string; password: string; }
export interface LoginResponse { token: string; librarian: Librarian; }
export interface IssueBookRequest { bookId: string; memberId: string; dueDate?: string; }
export interface BookQuery { page?: number; limit?: number; genre?: string; search?: string; sort?: string; }
export interface MemberQuery { page?: number; limit?: number; search?: string; }
export interface CreateMemberRequest { name: string; email: string; membershipId?: string; }
export interface IssueResponse { borrowRecord: PopulatedBorrowRecord; availableCopies: number; }
export interface ReturnResponse { borrowRecord: PopulatedBorrowRecord; wasLate: boolean; }
