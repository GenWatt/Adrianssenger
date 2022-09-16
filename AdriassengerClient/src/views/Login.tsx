import Form from '../components/Form'
import { ApiResponse, FormSchema, UserWithToken } from '../global'
import useFetch from '../hooks/useFetch'
import useForm from '../hooks/useFrom'
import { userState } from '../store/user'
import { useRecoilState } from 'recoil'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

const schema: FormSchema[] = [
  { name: 'username', id: 'username', label: 'Username' },
  { type: 'password', name: 'password', id: 'password', label: 'Password' },
  { type: 'link', label: "Don't have an account? Create one!", to: '/register', name: 'link' },
]

export default function Login() {
  const { callApi, isLoading, notError } = useFetch()
  const { convertFormDataToObject } = useForm()
  const [user, setUser] = useRecoilState(userState)
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState('')
  const { setObj } = useLocalStorage()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const res = await callApi<ApiResponse<UserWithToken>>(
      '/Users/Login',
      'POST',
      convertFormDataToObject(e.target as HTMLFormElement)
    )

    if (!res) return

    if (!notError(res)) {
      setErrorMessage(res.message)
    } else {
      setUser(res.data)
      setObj<UserWithToken>('user', res.data)
      navigate('/')
    }
  }
  return (
    <Form schema={schema} header="Login" onSubmit={handleSubmit} isLoading={isLoading} errorMessage={errorMessage} />
  )
}
