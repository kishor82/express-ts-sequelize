import { ErrorCategory } from '../constants';
import { SortDirection } from '../helpers';

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };

export type ValidationFieldError = {
  field: string;
  message: string;
};

export type ValidSection = 'body' | 'query' | 'params';

export type ValidationErrors = Record<ValidSection, ValidationFieldError[]>;

export type SuccessRespose<T> = { status: 'success'; message?: string; data?: T };
export type ErrorResponse = { status: 'error'; message: string; category: Exclude<ErrorCategory, ErrorCategory.VALIDATION_ERROR>; error?: any };
export type ValidatinErrorResponse = { status: 'error'; message: string | ValidationErrors; category: ErrorCategory.VALIDATION_ERROR; error?: any };

export type ApiResponse<T> = SuccessRespose<T> | ErrorResponse | ValidatinErrorResponse;
type Distinct = 'true' | 'false';
export interface BaseReqQuery {
  pageNumber?: string;
  pageSize?: string;
  sortDirection?: SortDirection;
  sortField?: string;
  distinct?: Distinct;
}

export type IdReqParams = {
  id: string;
};

export type ListResponse<T> = {
  totalPages?: number;
  prevPage?: number;
  nextPage?: number;
  total: number;
  items: T[];
  pageNumber?: number;
  pageSize?: number;
};
