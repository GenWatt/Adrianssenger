import { SearchUser } from '../global'
import useFetch from './useFetch'

export default function useUsers() {
  const { request } = useFetch()

  const searchForFriends = async (text: string) => {
    const response = await request<SearchUser[]>('/Users/Search?searchText=' + text)

    return response.data
  }

  return { searchForFriends }
}
