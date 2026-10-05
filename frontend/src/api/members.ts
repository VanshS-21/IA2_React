import { api, paginated, request } from './client'; import { mockCreateMember, mockMembersList } from './mock'; import type { Member } from '../types/models'; import type { CreateMemberRequest, MemberQuery, Paginated } from '../types/api';
const mock = import.meta.env.VITE_USE_MOCK === 'true';
export const fetchMembers = (query: MemberQuery): Promise<Paginated<Member>> => mock ? mockMembersList(query) : paginated<Member>(api.get('/members', { params: query }));
export const createMember = (input: CreateMemberRequest): Promise<Member> => mock ? mockCreateMember(input) : request(api.post('/members', input));
