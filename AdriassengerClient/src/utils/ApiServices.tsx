import axios, { AxiosRequestConfig } from 'axios'
import { SERVER_URL } from '../config'

const axiosConfig: AxiosRequestConfig = {
  baseURL: SERVER_URL,
}

const axiosInstance = axios.create(axiosConfig)

export default {
  axios: axiosInstance,
}
