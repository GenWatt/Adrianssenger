import { useCallback, useEffect, useState } from 'react'
import axios, { AxiosResponse, AxiosRequestConfig, AxiosError } from 'axios'
import { ApiError, ApiResponse, BasicResponse } from '../global'
import { SERVER_ENDPOINT } from '../config'
import { axiosInstance } from '../utils/ApiServices'
import useText from './useText'
import { useSnackbar } from 'notistack'
import useUser from './useUser'
import useReset from './useReset'

let controller = new AbortController()
let isRefreshing = false
let requestsToRefresh: any = []

const axiosConfig: AxiosRequestConfig = {
  withCredentials: true,
  baseURL: SERVER_ENDPOINT,
}

export default function useFetch() {
  const [isLoading, setLoading] = useState(false)
  const { refresh, isUserLogIn } = useUser()
  const { joinMessages } = useText()
  const { enqueueSnackbar } = useSnackbar()
  const { resetAndNavigateToLoginPage } = useReset()

  const isError = <T = {}>(response: BasicResponse | ApiResponse<T>): response is ApiResponse<T> => {
    return 'data' in response
  }

  const responseInterseptorOnError = useCallback((error: any) => {
    const originalRequest = error.config

    if (error.code === 'ERR_NETWORK') {
      return enqueueSnackbar('Can not connect to server', { variant: 'error' })
    }

    console.log(isUserLogIn())

    if (error.response && error.response.status && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      if (!isRefreshing) {
        isRefreshing = true
        refresh()
          .then((data: any) => {
            if (axios.isAxiosError(data)) {
              resetAndNavigateToLoginPage()
            } else requestsToRefresh.forEach((cb: any) => cb())
          })
          .catch(() => {
            requestsToRefresh = []
            resetAndNavigateToLoginPage()
          })
          .finally(() => {
            requestsToRefresh = []
            isRefreshing = false
          })
      }

      return new Promise((resolve, reject) => {
        requestsToRefresh.push(() => {
          resolve(axios(originalRequest))
          reject(error)
        })
      })
    }
    return error
  }, [])

  useEffect(() => {
    //Response interceptor for API calls
    const responseInterseptor = axiosInstance.interceptors.response.use(
      (response) => response,
      responseInterseptorOnError
    )

    return () => {
      axiosInstance.interceptors.response.eject(responseInterseptor)
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
      const errors = error as AxiosError<ApiError[]>

      if (errors.response && errors.response.data) {
        return joinMessages(errors.response.data)
      }
    }
    return 'Something goes wrong'
  }

  return { isLoading, controller, isError, request, getErrorMessage }
}
