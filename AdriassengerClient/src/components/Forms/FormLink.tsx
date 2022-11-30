import { Link } from 'react-router-dom'

type FormLinkProps = {
  label: string
  to: string
}

export default function FormLink({ label, to }: FormLinkProps) {
  return (
    <Link style={{ paddingTop: '1rem', paddingBottom: '1rem' }} to={to}>
      {label}
    </Link>
  )
}
