import { Navigate } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { UserHeaderData } from '../global'
import useLocalStorage from '../hooks/useLocalStorage'
import { isAuthenticate, userState } from '../store/user'

export default function ProtectedRoute({ children }: any) {
  const isAuth = useRecoilValue(isAuthenticate)
  const [user, setUser] = useRecoilState(userState)
  const { getObj } = useLocalStorage()

  if (!isAuth) {
    const savedUser = getObj<UserHeaderData>('user')
    savedUser && setUser(savedUser)
  }

  if (isAuth) return children

  return <Navigate to="/login" replace />
}
