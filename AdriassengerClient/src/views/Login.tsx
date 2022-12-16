import Form from '../components/Forms/Form'
import { FormSchema, UserHeaderData } from '../global'
import useFetch from '../hooks/useFetch'
import useForm from '../components/Forms/useFrom'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import useUser from '../hooks/useUser'

const schema: FormSchema[] = [
  { name: 'userName', id: 'userName', label: 'Username', rules: { required: true } },
  { type: 'password', name: 'password', id: 'password', label: 'Password', rules: { required: true } },
  { type: 'link', label: "Don't have an account? Create one!", to: '/register', name: 'link' },
]

export default function Login() {
  const { request, isLoading, getErrorMessage } = useFetch()
  const { convertFormDataToObject } = useForm()
  const { login } = useUser()
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      const loginData = convertFormDataToObject<{ userName: string; password: string }>(e.target as HTMLFormElement)
      const res = await request<UserHeaderData>('/Account/Login', 'POST', loginData)

      login(res.data)
      navigate('/')
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }
  return (
    <Form schema={schema} header="Login" onSubmit={handleSubmit} isLoading={isLoading} errorMessage={errorMessage} />
  )
}
