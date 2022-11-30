import Form from '../components/Forms/Form'
import { FormSchema, User } from '../global'
import useFetch from '../hooks/useFetch'
import useForm from '../components/Forms/useFrom'
import { useNavigate } from 'react-router-dom'

const schema: FormSchema[] = [
  { type: 'text', name: 'userName', id: 'userName', label: 'Username', rules: { required: true, min: 3 } },
  { type: 'email', name: 'email', id: 'email', label: 'E-mail', rules: { required: true, isEmail: true } },
  { type: 'password', name: 'password', id: 'password', label: 'Password', rules: { required: true, min: 4 } },
  { type: 'file', name: 'profilePicture', id: 'profilePicture', label: 'Profile picture' },
  { type: 'link', label: 'Already have an account? Go log in!', to: '/login', name: 'link' },
]

export default function Register() {
  const { convertFormDataToObject } = useForm()
  const { request, isLoading, getErrorMessage } = useFetch()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      await request<User>('/Account/Register', 'POST', convertFormDataToObject(e.target as HTMLFormElement))

      navigate('/login')
    } catch (error) {
      getErrorMessage(error)
    }
  }
  return <Form schema={schema} header="Register" onSubmit={handleSubmit} isLoading={isLoading} />
}
