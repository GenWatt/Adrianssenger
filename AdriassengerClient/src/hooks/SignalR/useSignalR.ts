import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { SERVER_URL } from '../../config'
import { isAuthenticate } from '../../store/user'

export default function useSignalR() {
  const [connection, setConnection] = useState<HubConnection>()
  const isAuth = useRecoilValue(isAuthenticate)

  useEffect(() => {
    if (!isAuth) return
    const newConnection = new HubConnectionBuilder().withUrl(SERVER_URL + '/Chat').build()

    newConnection.start().catch((err) => console.log(err))

    setConnection(newConnection)
  }, [isAuth])

  return { connection }
}
