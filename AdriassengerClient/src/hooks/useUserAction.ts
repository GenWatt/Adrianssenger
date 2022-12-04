import { useSnackbar } from 'notistack'
import useFetch from './useFetch'
import useReset from './useReset'

export default function useUserAction() {
  const { enqueueSnackbar } = useSnackbar()
  const { request } = useFetch()
  const { resetAndNavigateToLoginPage } = useReset()

  const logout = async () => {
    try {
      await request('/Account/Logout')
    } catch (error) {
      enqueueSnackbar('Something goes wrong with log out', { variant: 'error' })
    }

    resetAndNavigateToLoginPage()
  }

  return { logout }
}
