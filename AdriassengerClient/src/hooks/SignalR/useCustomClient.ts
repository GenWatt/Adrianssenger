import { DefaultHttpClient, HttpError, HttpRequest, HttpResponse } from '@microsoft/signalr'
import useUser from '../useUser'

export default function useCustomClient() {
  const { refresh } = useUser()

  const getClient = () => {
    class CustomHttpClient extends DefaultHttpClient {
      constructor() {
        super(console) // the base class wants a signalR.ILogger
      }
      public async send(request: HttpRequest): Promise<HttpResponse> {
        try {
          const response = await super.send(request)
          return response
        } catch (err) {
          if (err instanceof HttpError) {
            const error = err as signalR.HttpError
            if (error.statusCode == 401) {
              //token expired - trying a refresh via refresh token
              await refresh()
            }
          } else {
            throw err
          }
        }
        //re try the request
        return super.send(request)
      }
    }

    return new CustomHttpClient()
  }

  return { getClient }
}
