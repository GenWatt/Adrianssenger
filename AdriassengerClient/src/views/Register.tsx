import Form from '../components/Forms/Form'
import { FormSchema } from '../global'
import { useNavigate } from 'react-router-dom'
import useRegister from '../hooks/useRegister'

const schema: FormSchema[] = [
  { type: 'text', name: 'userName', id: 'userName', label: 'Username', rules: { required: true, min: 3 } },
  { type: 'email', name: 'email', id: 'email', label: 'E-mail', rules: { required: true, isEmail: true } },
  { type: 'password', name: 'password', id: 'password', label: 'Password', rules: { required: true, min: 4 } },
  { type: 'file', name: 'profilePicture', id: 'profilePicture', label: 'Choose Profile picture' },
  { type: 'link', label: 'Already have an account? Go log in!', to: '/login', name: 'link' },
]

export default function Register() {
  const navigate = useNavigate()
  const { register, errorMessage, isLoading } = useRegister()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const res = await register(e.target as HTMLFormElement)

    if (res.success) {
      navigate('/login')
    }
  }

  return (
    <Form schema={schema} header="Register" onSubmit={handleSubmit} isLoading={isLoading} errorMessage={errorMessage} />
  )
}
