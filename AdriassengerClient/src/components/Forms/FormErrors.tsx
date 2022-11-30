import { Typography } from '@mui/material'

type FormErrorsProps = {
  errors: any
  name: string
}

export default function FormErrors({ errors, name }: FormErrorsProps) {
  return (
    <>
      {errors && errors[name] && (
        <Typography color={'red'} variant="caption">
          {errors[name].map((error: string, index: number) => (
            <div key={index}>{error}</div>
          ))}
        </Typography>
      )}
    </>
  )
}
