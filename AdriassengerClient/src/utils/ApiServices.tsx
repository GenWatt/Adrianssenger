import axios, { AxiosRequestConfig } from 'axios'
import { SERVER_URL } from '../config'

const axiosConfig: AxiosRequestConfig = {
  baseURL: SERVER_URL,
  // withCredentials: true,
}

const axiosInstance = axios.create(axiosConfig)

export default {
  axios: axiosInstance,
}
