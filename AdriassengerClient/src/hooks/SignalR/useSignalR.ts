import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'
import { useSnackbar } from 'notistack'
import { useCallback, useEffect, useState } from 'react'
import { SERVER_ENDPOINT } from '../../config'
import useUser from '../useUser'

let isDisconecting = false

export default function useSignalR() {
  const [connection, setConnection] = useState<HubConnection>()
  const { enqueueSnackbar } = useSnackbar()
  const { refresh, user } = useUser()

  const onClose = useCallback(
    (newConnection: HubConnection) => {
      if (isDisconecting) return
      isDisconecting = true

      refresh()
        .then(() => newConnection.start())
        .catch(() => enqueueSnackbar('Authorization expired', { variant: 'error' }))
        .finally(() => (isDisconecting = false))
    },
    [user.isLogIn]
  )

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(SERVER_ENDPOINT + '/Chat', { withCredentials: true })
      .withAutomaticReconnect()
      .build()

    newConnection.onreconnecting(() => {
      enqueueSnackbar('Tring to reconenct...')
    })

    newConnection.onclose(() => onClose(newConnection))

    newConnection.start().catch((err) => console.log(err))

    setConnection(newConnection)

    return () => {
      isDisconecting = false
      newConnection.stop()
    }
  }, [user.isLogIn])

  return { connection }
}
