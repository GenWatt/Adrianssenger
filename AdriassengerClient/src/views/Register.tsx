import Form from '../components/Form'
import { FormSchema, User } from '../global'
import useFetch from '../hooks/useFetch'
import useForm from '../hooks/useFrom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const schema: FormSchema[] = [
  { type: 'text', name: 'username', id: 'username', label: 'Username' },
  { type: 'email', name: 'email', id: 'email', label: 'E-mail' },
  { type: 'password', name: 'password', id: 'password', label: 'Password' },
]

export default function Register() {
  const { convertFormDataToObject } = useForm()
  const { callApi, isLoading } = useFetch()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const res = await callApi<User>('/Users', 'POST', convertFormDataToObject(e.target as HTMLFormElement))

    if (axios.isAxiosError(res)) {
    } else {
      if (res) {
        navigate('/login')
      }
    }
  }
  return <Form schema={schema} header="Register" onSubmit={handleSubmit} isLoading={isLoading} />
}
