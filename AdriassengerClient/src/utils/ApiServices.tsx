import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { SERVER_URL } from '../config'
import { ApiResponse } from '../global'

const axiosConfig: AxiosRequestConfig = {
  baseURL: SERVER_URL,
  withCredentials: true,
}

const axiosInstance = axios.create(axiosConfig)

async function getRequest<T>(url: string) {
  const response: AxiosResponse<ApiResponse<T>> = await axiosInstance.get(url)

  return response.data
}

const postRequest = (url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET') => {}

const putRequest = (url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET') => {}

const deleteRequest = (url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET') => {}

export { axiosInstance, getRequest }
