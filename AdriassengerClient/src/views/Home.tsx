import { Grid } from '@mui/material'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import LeftPanel from '../components/UserPanel/LeftPanel'
import useFetch from '../hooks/useFetch'
import { isAuthenticate, userState } from '../store/user'

export default function Home() {
  const [user, setUser] = useRecoilState(userState)
  const isAuth = useRecoilValue(isAuthenticate)
  const { callApi, controller } = useFetch()
  const navigate = useNavigate()

  const users = async () => {}

  useEffect(() => {
    if (!isAuth) return navigate('/login')

    return () => {
      //   console.log('abort')
      //   controller.abort()
    }
  }, [])

  return (
    <Grid>
      <LeftPanel />
    </Grid>
  )
}
