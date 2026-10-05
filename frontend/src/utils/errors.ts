import axios from 'axios';
import type { ApiErrorBody } from '../types/api';
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) return error.response?.data?.error?.message ?? error.message ?? 'Network request failed';
  if (error instanceof Error) return error.message;
  return 'Something went wrong. Please try again.';
}
