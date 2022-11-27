import Form from '../components/Form'
import { FormSchema, UserHeaderData } from '../global'
import useFetch from '../hooks/useFetch'
import useForm from '../hooks/useFrom'
import { userState } from '../store/user'
import { useRecoilState } from 'recoil'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

const schema: FormSchema[] = [
  { name: 'userName', id: 'userName', label: 'username', rules: { required: true } },
  { type: 'password', name: 'password', id: 'password', label: 'Password', rules: { required: true } },
  { type: 'link', label: "Don't have an account? Create one!", to: '/register', name: 'link' },
]

export default function Login() {
  const { request, isLoading, getErrorMessage } = useFetch()
  const { convertFormDataToObject } = useForm()
  const [user, setUser] = useRecoilState(userState)
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState('')
  const { setObj } = useLocalStorage()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      const loginData = convertFormDataToObject<{ userName: string; password: string }>(e.target as HTMLFormElement)
      const res = await request<UserHeaderData>('/Account/Login', 'POST', loginData)

      setUser(res.data)
      setObj<UserHeaderData>('user', res.data)
      navigate('/')
    } catch (error) {
      console.log(error)
      setErrorMessage(getErrorMessage(error))
    }
  }
  return (
    <Form schema={schema} header="Login" onSubmit={handleSubmit} isLoading={isLoading} errorMessage={errorMessage} />
  )
}
