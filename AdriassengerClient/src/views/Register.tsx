import Form from '../components/Form'
import { ApiResponse, FormSchema, User } from '../global'
import useFetch from '../hooks/useFetch'
import useForm from '../hooks/useFrom'
import { useNavigate } from 'react-router-dom'

const schema: FormSchema[] = [
  { type: 'text', name: 'username', id: 'username', label: 'Username', rules: { required: true, min: 3 } },
  { type: 'email', name: 'email', id: 'email', label: 'E-mail', rules: { required: true, isEmail: true } },
  { type: 'password', name: 'password', id: 'password', label: 'Password', rules: { required: true, min: 4 } },
  { type: 'link', label: 'Already have an account? Go log in!', to: '/login', name: 'link' },
]

export default function Register() {
  const { convertFormDataToObject } = useForm()
  const { callApi, isLoading, notError } = useFetch()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const res = await callApi<ApiResponse<User>>('/Users', 'POST', convertFormDataToObject(e.target as HTMLFormElement))

    if (!res) return

    if (notError(res)) {
      navigate('/login')
    }
  }
  return <Form schema={schema} header="Register" onSubmit={handleSubmit} isLoading={isLoading} />
}
