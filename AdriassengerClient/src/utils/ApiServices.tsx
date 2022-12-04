import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { SERVER_ENDPOINT } from '../config'
import { ApiResponse } from '../global'

const axiosConfig: AxiosRequestConfig = {
  baseURL: SERVER_ENDPOINT,
  withCredentials: true,
}

const axiosInstance = axios.create(axiosConfig)

async function getRequest<T>(url: string) {
  const response: AxiosResponse<ApiResponse<T>> = await axiosInstance.get(url)

  return response.data
}

export { axiosInstance, getRequest }
