import { useState } from 'react'
import ApiServices from '../utils/ApiServices'
import axios, { AxiosResponse, AxiosRequestConfig, AxiosError } from 'axios'
import { userState } from '../store/user'
import { useRecoilState } from 'recoil'

export default function useFetch() {
  const [isLoading, setLoading] = useState(false)
  const [controller, setController] = useState(new AbortController())
  const [user, setUser] = useRecoilState(userState)

  const createConfig = (url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', data?: any) => {
    const config: AxiosRequestConfig = {
      url,
      method,
      signal: controller.signal,
      headers: {
        authorization: `Bearer ${user.token}`,
      },
    }

    if (data) config.data = data
    return config
  }

  const callApi = async <T>(url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', data?: any) => {
    let res: AxiosError | T | null = null

    try {
      setController(new AbortController())
      setLoading(true)

      const config: AxiosRequestConfig = createConfig(url, method, data)
      const response: AxiosResponse<T> = await ApiServices.axios(config)

      res = response.data
      return res
    } catch (error) {
      const errors = error as AxiosError | Error
      if (axios.isAxiosError(errors)) {
        res = errors
        return res
      }
    }
    setLoading(false)
    return null
  }

  return { callApi, isLoading, controller }
}
