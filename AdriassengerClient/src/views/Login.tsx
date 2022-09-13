import Form from '../components/Form'
import { ApiResponse, FormSchema, UserWithToken } from '../global'
import useFetch from '../hooks/useFetch'
import useForm from '../hooks/useFrom'
import axios from 'axios'
import { userState } from '../store/user'
import { useRecoilState } from 'recoil'
import { useNavigate } from 'react-router-dom'

const schema: FormSchema[] = [
  { name: 'username', id: 'username', label: 'Username' },
  { name: 'password', id: 'password', label: 'Password' },
]

export default function Login() {
  const { callApi, isLoading } = useFetch()
  const { convertFormDataToObject } = useForm()
  const [user, setUser] = useRecoilState(userState)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const res = await callApi<ApiResponse<UserWithToken>>(
      '/Users/Login',
      'POST',
      convertFormDataToObject(e.target as HTMLFormElement)
    )

    if (axios.isAxiosError(res)) {
    } else {
      if (!res) return
      console.log(res)
      setUser(res.data)
      navigate('/')
    }
  }
  return <Form schema={schema} header="Login" onSubmit={handleSubmit} isLoading={isLoading} />
}
