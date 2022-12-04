import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { SERVER_ENDPOINT } from '../../config'
import { isAuthenticate } from '../../store/user'
import useUser from '../useUser'

export default function useSignalR() {
  const [connection, setConnection] = useState<HubConnection>()
  const isAuth = useRecoilValue(isAuthenticate)
  const { enqueueSnackbar } = useSnackbar()
  const { refresh } = useUser()

  useEffect(() => {
    if (!isAuth) return
    let isDisconecting = false

    const newConnection = new HubConnectionBuilder()
      .withUrl(SERVER_ENDPOINT + '/Chat', { withCredentials: true })
      .withAutomaticReconnect()
      .build()

    newConnection.onreconnecting(() => {
      enqueueSnackbar('Tring to reconenct...')
    })

    newConnection.onclose(async () => {
      if (isDisconecting) return
      isDisconecting = true
      await refresh()
        .then(() => newConnection.start())
        .finally(() => (isDisconecting = false))
    })

    newConnection.start().catch((err) => console.log(err))

    setConnection(newConnection)

    return () => {
      newConnection.stop()
    }
  }, [isAuth])

  return { connection }
}
