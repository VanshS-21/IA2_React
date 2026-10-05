import type { BorrowStatus } from '../types/models';
export const formatDate = (value: string | null) => value ? new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value)) : '—';
export const isOverdue = (dueDate: string, returnDate: string | null) => !returnDate && new Date(dueDate) < new Date();
export const recordStatus = (status: BorrowStatus, dueDate: string, returnDate: string | null): BorrowStatus => isOverdue(dueDate, returnDate) ? 'overdue' : status;
export const overdueDays = (dueDate: string) => Math.max(1, Math.ceil((Date.now() - new Date(dueDate).getTime()) / 86_400_000));
