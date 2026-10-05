import { api, paginated, request } from "./client";
import { mockBorrowRecords, mockHistory, mockIssue, mockReturn } from "./mock";
import type { PopulatedBorrowRecord } from "../types/models";
import type {
  BorrowQuery,
  IssueBookRequest,
  IssueResponse,
  Paginated,
  ReturnResponse,
} from "../types/api";
const mock = import.meta.env.VITE_USE_MOCK === "true";
export const issueBook = (input: IssueBookRequest): Promise<IssueResponse> =>
  mock ? mockIssue(input) : request(api.post("/borrow", input));
export const fetchBorrowRecords = (
  query: BorrowQuery,
): Promise<Paginated<PopulatedBorrowRecord>> =>
  mock
    ? mockBorrowRecords(query)
    : paginated<PopulatedBorrowRecord>(api.get("/borrow", { params: query }));
export const fetchMemberHistory = (
  id: string,
): Promise<Paginated<PopulatedBorrowRecord>> =>
  mock
    ? mockHistory(id)
    : paginated<PopulatedBorrowRecord>(api.get(`/members/${id}/history`));
export const returnBook = (id: string): Promise<ReturnResponse> =>
  mock ? mockReturn(id) : request(api.post(`/borrow/return/${id}`));
