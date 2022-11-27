import { Typography } from '@mui/material'

type NotFoundProps = { children: React.ReactNode }

export default function NotFound({ children }: NotFoundProps) {
  return <Typography textAlign="center">{children}</Typography>
}
