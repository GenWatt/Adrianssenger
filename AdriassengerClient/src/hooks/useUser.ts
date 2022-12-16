import axios from 'axios'
import { useRecoilState } from 'recoil'
import { SERVER_ENDPOINT } from '../config'
import { UserHeaderData } from '../global'
import { userState } from '../store/user'
import useLocalStorage from './useLocalStorage'

export default function useUser() {
  const [user, setUser] = useRecoilState(userState)
  const { setObj } = useLocalStorage()

  const refresh = async () => {
    setUser((prev) => ({ ...prev, isRefreshing: true }))
    const res = await axios({
      url: SERVER_ENDPOINT + '/Account/Refresh',
      withCredentials: true,
      method: 'POST',
    })

    setUser((prev) => ({ ...prev, isRefreshing: false }))
    return res
  }

  const isRefreshing = () => user.isRefreshing

  const login = (user: UserHeaderData) => {
    setUser((prev) => ({ ...prev, ...user, isLogIn: true }))
    setObj<UserHeaderData>('user', user)
  }

  const loadUser = (user: UserHeaderData) => setUser((prev) => ({ ...prev, ...user }))

  const updateUser = (user: UserHeaderData) => {
    setObj<UserHeaderData>('user', user)
    loadUser(user)
  }

  const isUserLogIn = () => {
    return user.isLogIn
  }

  return { user, refresh, setUser, login, isUserLogIn, isRefreshing, loadUser, updateUser }
}
