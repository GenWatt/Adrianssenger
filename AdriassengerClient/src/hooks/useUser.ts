import { useSnackbar } from 'notistack'
import { useNavigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { initialUserValue, userState } from '../store/user'
import useFetch from './useFetch'

export default function useUser() {
  const [user, setUser] = useRecoilState(userState)
  const { request } = useFetch()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const logout = async () => {
    try {
      await request('/Account/Logout')
      setUser(initialUserValue)
      navigate('/login')
    } catch (error) {
      enqueueSnackbar('Something goes wrong with log out', { variant: 'error' })
    }
  }

  return { user, logout }
}
