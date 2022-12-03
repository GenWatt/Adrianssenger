import axios from 'axios'
import { useRecoilState } from 'recoil'
import { SERVER_ENDPOINT } from '../config'
import { userState } from '../store/user'

export default function useUser() {
  const [user, setUser] = useRecoilState(userState)

  const refresh = async () => {
    return await axios({
      url: SERVER_ENDPOINT + '/Account/Refresh',
      withCredentials: true,
      method: 'POST',
    })
  }

  return { user, refresh, setUser }
}
