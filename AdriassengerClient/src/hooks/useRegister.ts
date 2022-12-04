import { useState } from 'react'
import { User } from '../global'
import useFetch from './useFetch'

export default function useRegister() {
  const { request, getErrorMessage, isLoading } = useFetch()
  const [errorMessage, setErrorMessage] = useState('')

  const register = async (form: HTMLFormElement) => {
    try {
      await request<User>('/Account/Register', 'POST', new FormData(form))
      return { success: true }
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
      return { success: false }
    }
  }

  return { register, errorMessage, isLoading }
}
