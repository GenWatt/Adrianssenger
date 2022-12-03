import { useEffect, useState } from 'react'
import axios, { AxiosResponse, AxiosRequestConfig, AxiosError } from 'axios'
import { ApiErrors, ApiResponse, BasicResponse } from '../global'
import { SERVER_ENDPOINT } from '../config'
import { axiosInstance } from '../utils/ApiServices'
import useText from './useText'
import { useSnackbar } from 'notistack'
import useUser from './useUser'
import useReset from './useReset'

let controller = new AbortController()

const axiosConfig: AxiosRequestConfig = {
  withCredentials: true,
  baseURL: SERVER_ENDPOINT,
}

export default function useFetch() {
  const [isLoading, setLoading] = useState(false)
  const { refresh } = useUser()
  const { joinMessages } = useText()
  const { enqueueSnackbar } = useSnackbar()
  const { resetAndNavigateToLoginPage } = useReset()

  const isError = <T = {}>(response: BasicResponse | ApiResponse<T>): response is ApiResponse<T> => {
    return 'data' in response
  }

  useEffect(() => {
    //Response interceptor for API calls
    const responseInterseptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config

        if (error.code === 'ERR_NETWORK') {
          return enqueueSnackbar('Can not connect to server', { variant: 'error' })
        }

        if (
          error.response &&
          ((error.response.status && error.response.status === 401) || error.response.status === 403) &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true
          try {
            const tokens = await refresh()

            if (!tokens.data) return

            if (!axios.isAxiosError(tokens)) {
              return axios(originalRequest)
            } else return resetAndNavigateToLoginPage()
          } catch (error) {
            resetAndNavigateToLoginPage()
            return enqueueSnackbar('Your authorization expired!', { variant: 'error' })
          }
        }
        return error
      }
    )

    return () => {
      axiosInstance.interceptors.response.eject(responseInterseptor)
      // console.log('boty')
      // controller.abort()
    }
  }, [])

  async function request<T>(
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: any,
    config: AxiosRequestConfig = {}
  ) {
    setLoading(true)
    config = { ...axiosConfig, ...config, method, url, data }
    const res: AxiosResponse<ApiResponse<T>> = await axiosInstance(config).finally(() => setLoading(false))

    if (axios.isAxiosError(res)) {
      throw res
    }

    return res.data
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
