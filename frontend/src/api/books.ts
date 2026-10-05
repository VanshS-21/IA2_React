import { api, paginated, request } from './client'; import { mockBooksList, mockGenres } from './mock'; import type { Book } from '../types/models'; import type { BookQuery, Paginated } from '../types/api';
const mock = import.meta.env.VITE_USE_MOCK === 'true';
export const fetchBooks = (query: BookQuery): Promise<Paginated<Book>> => mock ? mockBooksList(query) : paginated<Book>(api.get('/books', { params: query }));
export const fetchGenres = (): Promise<string[]> => mock ? mockGenres() : request(api.get('/books/genres'));
