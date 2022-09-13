import { InputProps } from '@mui/material'

export interface FormSchema extends InputProps {
  label: string
}

export interface ApiResponse<T> {
  success: boolean
  message: string
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
}
