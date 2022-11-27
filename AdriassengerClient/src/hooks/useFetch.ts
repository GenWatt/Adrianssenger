import { useEffect, useState } from 'react'
import axios, { AxiosResponse, AxiosRequestConfig, AxiosError } from 'axios'
import { userState } from '../store/user'
import { useRecoilState } from 'recoil'
import { ApiErrors, ApiResponse, BasicResponse } from '../global'
import { useNavigate } from 'react-router-dom'
import { SERVER_URL } from '../config'
import { axiosInstance } from '../utils/ApiServices'
import useText from './useText'
import { useSnackbar } from 'notistack'

interface Tokens {
  accessToken: string
  refreshToken: string
}

let controller = new AbortController()

const axiosConfig: AxiosRequestConfig = {
  withCredentials: true,
  baseURL: SERVER_URL,
}

export default function useFetch() {
  const [isLoading, setLoading] = useState(false)
  const [user, setUser] = useRecoilState(userState)
  const navigate = useNavigate()
  const { joinMessages } = useText()
  const { enqueueSnackbar } = useSnackbar()

  const isError = <T = {}>(response: BasicResponse | ApiResponse<T>): response is ApiResponse<T> => {
    return 'data' in response
  }

  useEffect(() => {
    //Response interceptor for API calls
    const responseInterseptor = axiosInstance.interceptors.response.use(
      (response) => {
        return response
      },
      async (error) => {
        const originalRequest = error.config

        if (error.code === 'ERR_NETWORK') {
          return enqueueSnackbar('Can not connect to server', { variant: 'error' })
        }

        if (
          ((error.response.status && error.response.status === 401) || error.response.status === 403) &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true
          try {
            const tokens = await axios({ url: SERVER_URL + '/Account/Refresh', withCredentials: true, method: 'POST' })

            if (!tokens.data) return navigate('/login')

            if (!axios.isAxiosError(tokens)) {
              return axios(originalRequest)
            } else return navigate('/login')
          } catch (error) {
            navigate('/login')
            return enqueueSnackbar('Your authorization expired!', { variant: 'error' })
          }
        }
        return Promise.reject((error: any) => {
          console.log(error)
        })
      }
    )

    return () => {
      axiosInstance.interceptors.response.eject(responseInterseptor)
      // console.log('boty')
      // controller.abort()
    }
  }, [user])

  async function request<T>(
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: any,
    config: AxiosRequestConfig = {}
  ) {
    setLoading(true)
    config = { ...axiosConfig, ...config, method, url, data }
    const response: AxiosResponse<ApiResponse<T>> = await axiosInstance(config).finally(() => setLoading(false))
    return response.data
  }

  function getErrorMessage(error: unknown) {
    if (axios.isAxiosError(error)) {
      const errors = error as AxiosError<ApiErrors>

      if (errors.response && errors.response.data) {
        return joinMessages(errors.response.data.errors)
      }
      return 'Something goes wrong'
    }
    return 'Something goes wrong'
  }

  return { isLoading, controller, isError, request, getErrorMessage }
}
