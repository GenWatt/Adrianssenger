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

export interface UserHeaderData {
  username: string
  id: number
  imgUrl: string
}

export interface User extends UserHeaderData {
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

export interface Friend extends UserHeaderData {
  lastMessage: string
  friendId: number
  createAt: Date
}

export interface SearchUser {
  id: number
  username: string
}
