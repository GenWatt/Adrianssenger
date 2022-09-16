import { InputProps } from '@mui/material'

export type FormSchema = InputProps & { label: string; to?: string; rules?: Rules; name: string }
export type Rules = { required?: boolean; min?: number; max?: number; isEmail?: boolean }
export enum ValidationRuleType {
  REQUIRED = 'required',
  MIN = 'min',
  MAX = 'max',
  ISEMAIL = 'isEmail',
}
export interface BasicResponse {
  success: boolean
  message: string
}

export interface ApiResponse<T> extends BasicResponse {
  data: T
}

export interface User {
  username: string
  id: number
  email?: string
  isVeryfied: boolean
}

export interface UserWithToken extends User {
  token: string
  refreshToken: string
}

export interface ErrorResponse<T> extends BasicResponse {
  validateData?: T
}
