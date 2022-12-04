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
    return await axios({
      url: SERVER_ENDPOINT + '/Account/Refresh',
      withCredentials: true,
      method: 'POST',
    })
  }

  const updateUser = (user: UserHeaderData) => {
    setUser(user)
    setObj<UserHeaderData>('user', user)
  }

  return { user, refresh, setUser, updateUser }
}
