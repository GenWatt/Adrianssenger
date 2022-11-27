import Form from '../components/Form'
import { FormSchema, User } from '../global'
import useFetch from '../hooks/useFetch'
import useForm from '../hooks/useFrom'
import { useNavigate } from 'react-router-dom'

const schema: FormSchema[] = [
  { type: 'text', name: 'userName', id: 'userName', label: 'userName', rules: { required: true, min: 3 } },
  { type: 'email', name: 'email', id: 'email', label: 'E-mail', rules: { required: true, isEmail: true } },
  { type: 'password', name: 'password', id: 'password', label: 'Password', rules: { required: true, min: 4 } },
  { type: 'link', label: 'Already have an account? Go log in!', to: '/login', name: 'link' },
]

export default function Register() {
  const { convertFormDataToObject } = useForm()
  const { request, isLoading } = useFetch()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      const res = await request<User>('/Account/Register', 'POST', convertFormDataToObject(e.target as HTMLFormElement))

      if (res.errors && res.errors.length) {
      } else navigate('/login')
    } catch (error) {
      console.log(error)
    }
  }
  return <Form schema={schema} header="Register" onSubmit={handleSubmit} isLoading={isLoading} />
}
