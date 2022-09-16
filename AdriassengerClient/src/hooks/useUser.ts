import { useRecoilState } from 'recoil'
import { initialUserValue, userState } from '../store/user'

export default function useUser() {
  const [user, setUser] = useRecoilState(userState)

  const logout = () => {
    setUser(initialUserValue)
    localStorage.removeItem('user')
  }

  return { user, logout }
}
