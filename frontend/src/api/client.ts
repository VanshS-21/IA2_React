import axios from 'axios';
import type { ApiSuccess, PageMeta, Paginated } from '../types/api';
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });
api.interceptors.request.use((config) => { const token = localStorage.getItem('shelflife_token'); if (token) config.headers.Authorization = `Bearer ${token}`; return config; });
api.interceptors.response.use((response) => response, (error: unknown) => { if (axios.isAxiosError(error) && error.response?.status === 401) { localStorage.removeItem('shelflife_token'); localStorage.removeItem('shelflife_librarian'); if (location.pathname !== '/login') location.assign('/login'); } return Promise.reject(error); });
export async function request<T>(call: Promise<{ data: ApiSuccess<T> }>): Promise<T> { const response = await call; return response.data.data; }
export async function paginated<T>(call: Promise<{ data: ApiSuccess<T[]> }>): Promise<Paginated<T>> { const response = await call; const meta = response.data.meta; if (!meta) throw new Error('The API did not return pagination metadata'); return { data: response.data.data, meta: meta as PageMeta }; }
