import {
  DefaultHttpClient,
  HttpError,
  HttpRequest,
  HttpResponse,
  HubConnection,
  HubConnectionBuilder,
} from '@microsoft/signalr'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { SERVER_ENDPOINT } from '../../config'
import { isAuthenticate } from '../../store/user'
import useUser from '../useUser'
import useCustomClient from './useCustomClient'

export default function useSignalR() {
  const [connection, setConnection] = useState<HubConnection>()
  const isAuth = useRecoilValue(isAuthenticate)
  const { enqueueSnackbar } = useSnackbar()
  const { getClient } = useCustomClient()

  useEffect(() => {
    if (!isAuth) return

    const newConnection = new HubConnectionBuilder()
      .withUrl(SERVER_ENDPOINT + '/Chat', { withCredentials: true, httpClient: getClient() })
      .withAutomaticReconnect()
      .build()

    newConnection.onreconnecting(() => {
      enqueueSnackbar('Tring to reconenct...')
    })

    newConnection.start().catch((err) => console.log(err))

    setConnection(newConnection)

    return () => {
      newConnection.stop()
    }
  }, [isAuth])

  return { connection }
}
