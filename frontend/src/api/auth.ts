import { api, request } from './client'; import { mockLogin } from './mock'; import type { LoginRequest, LoginResponse } from '../types/api';
const mock = import.meta.env.VITE_USE_MOCK === 'true';
export const login = (input: LoginRequest): Promise<LoginResponse> => mock ? mockLogin(input) : request(api.post('/auth/login', input));
