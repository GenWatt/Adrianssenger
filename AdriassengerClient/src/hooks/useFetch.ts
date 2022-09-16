import { useEffect, useState } from 'react'
import ApiServices from '../utils/ApiServices'
import axios, { AxiosResponse, AxiosRequestConfig, AxiosError } from 'axios'
import { userState } from '../store/user'
import { useRecoilState } from 'recoil'
import { ApiResponse, BasicResponse, UserWithToken } from '../global'
import { useNavigate } from 'react-router-dom'
import { SERVER_URL } from '../config'
import useLocalStorage from './useLocalStorage'

interface Tokens {
  accessToken: string
  refreshToken: string
}

let controller = new AbortController()

export default function useFetch() {
  const [isLoading, setLoading] = useState(false)
  const [user, setUser] = useRecoilState(userState)
  const { setObj } = useLocalStorage()
  const navigate = useNavigate()

  const createConfig = (url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', data?: any) => {
    const config: AxiosRequestConfig = {
      url,
      method,
      signal: controller.signal,
      baseURL: SERVER_URL,
    }

    if (data) config.data = data
    return config
  }

  const notError = <T = {}>(response: BasicResponse | ApiResponse<T>): response is ApiResponse<T> => {
    return 'data' in response
  }

  useEffect(() => {
    // Request interceptor for API calls
    const requestInterseptor = axios.interceptors.request.use(
      async (config) => {
        config.headers = { Authorization: `Bearer ${user.token}` }
        return config
      },
      (error) => {
        Promise.reject(error)
      }
    )

    // Response interceptor for API calls
    const responseInterseptor = axios.interceptors.response.use(
      (response) => {
        return response
      },
      async (error) => {
        const originalRequest = error.config
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true
          try {
            const tokens: AxiosResponse<ApiResponse<Tokens>> = await axios.post(SERVER_URL + '/Users/refresh', {
              accessToken: user.token,
              refreshToken: user.refreshToken,
            })

            console.log('token', tokens)
            if (!tokens.data) return navigate('/login')

            if (!axios.isAxiosError(tokens)) {
              const updatedUser: UserWithToken = {
                ...user,
                token: tokens.data.data.accessToken,
                refreshToken: tokens.data.data.refreshToken,
              }

              setUser(updatedUser)
              setObj<UserWithToken>('user', updatedUser)

              axios.defaults.headers.common['Authorization'] = 'Bearer ' + updatedUser.token
              return axios(originalRequest)
            } else return navigate('/login')
          } catch (error) {
            navigate('/login')
          }
        }
        return Promise.reject(error)
      }
    )

    return () => {
      axios.interceptors.request.eject(requestInterseptor)
      axios.interceptors.response.eject(responseInterseptor)
      // console.log('boty')
      // controller.abort()
    }
  }, [user])

  const callApi = async <T, K = {}>(url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', data?: any) => {
    let res: (K & BasicResponse) | T | null = null

    try {
      controller = new AbortController()
      setLoading(true)

      const config: AxiosRequestConfig = createConfig(url, method, data)
      const response: AxiosResponse<T> = await axios(config)

      res = response.data
      setLoading(false)

      return res
    } catch (error) {
      const errors = error as AxiosError<K & BasicResponse>

      setLoading(false)
      if (axios.isAxiosError(errors)) {
        if (errors.response) {
          res = errors.response?.data
          return res
        }
        return null
      }
    }
    return null
  }

  return { callApi, isLoading, controller, notError }
}
