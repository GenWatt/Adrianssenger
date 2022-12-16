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

export interface ApiError {
  errorMessage: string
}

export interface ApiResponse<T, R = ApiError> extends BasicResponse {
  data: T
  errors: R[]
}

export interface UserHeaderData {
  userName: string
  id: number
  avatarUrl: string
  isLogIn: boolean
  isRefreshing: boolean
}

export interface User extends UserHeaderData {
  email?: string
}

export interface ErrorResponse<T> extends BasicResponse {
  validateData?: T
}

export interface Friend extends UserHeaderData {
  lastMessage: string
  friendId: number
  createAt: Date
  requestAccepted: boolean
  unseenMessagesCount: number
}

export interface SearchUser {
  id: number
  userName: string
}

export interface Message {
  id: number
  message: string
  senderId: number
  receiverId: number
  seen: boolean
  createdAt: Date
}

export enum NotificationTypes {
  SUCCESS,
  ERROR,
  WARNING,
  INFO,
}

export enum NotificationActions {
  READ,
  ACCEPTORNOT,
}

export enum NotificationActionType {
  FRIEND,
}

export interface NotificationState {
  id: number
  title: string
  content: string
  type: NotificationTypes
  createdAt: Date
  action: NotificationActions
  actionType: NotificationActionType
  userId: number
  actionId: number
  acceptUrl: string
  rejectUrl: string
}
