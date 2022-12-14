import { Typography, Grid, Button, Alert } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { FormSchema } from '../../global'
import useFile from '../../hooks/useFile'
import FileInput from './FileInput'
import FormLink from './FormLink'
import Inputs from './Inputs'
import useForm from './useFrom'

interface FormProps {
  schema: readonly FormSchema[]
  header?: string
  buttonText?: string
  isLoading?: boolean
  errorMessage?: string
  showPreview?: boolean
  onFileChange?: (preview: string) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  fullWidth?: boolean
}

export default function Form({
  schema,
  header,
  buttonText,
  onSubmit,
  isLoading,
  errorMessage,
  onFileChange,
  showPreview = true,
  fullWidth,
}: FormProps) {
  type RegisterValues = typeof schema[number]['name']

  const { validate, errors, convertFormDataToObject, isError, resetError } = useForm<RegisterValues>()
  const { getFileObjectUrl } = useFile()
  const [imagePreview, setImagePreview] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    validate(convertFormDataToObject(e.target as HTMLFormElement), schema)
    if (isError.current) return e.preventDefault()
    onSubmit && onSubmit(e)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    resetError(e.target.name)
  }

  const fileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      const preview = getFileObjectUrl(e.target.files[0])
      showPreview && setImagePreview(preview)
      onFileChange && onFileChange(preview)
    }
  }

  useEffect(() => () => setImagePreview(''), [])

  function getInput({ label, to, rules, name, type, ...input }: FormSchema) {
    if (to) {
      return <FormLink label={label} to={to} />
    }

    if (type === 'file')
      return (
        <FileInput
          controllStyles={{ alignItems: 'center', width: '100%' }}
          label={label}
          handleChange={fileInputChange}
          name={name}
          errors={errors}
          preview={imagePreview}
          {...input}
        />
      )

    return (
      <Inputs type={type ?? 'text'} label={label} handleChange={handleChange} name={name} errors={errors} {...input} />
    )
  }

  return (
    <Grid container display="flex" justifyContent="center" p={5}>
      <Grid item xs={12} sm={fullWidth ? 12 : 6} md={fullWidth ? 12 : 4} p={1}>
        {header && (
          <header>
            <Typography textTransform="uppercase" textAlign="center" variant="h3">
              {header}
            </Typography>
          </header>
        )}
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        <form onSubmit={handleSubmit}>
          <Grid container display="flex" alignItems="center" direction="column">
            {schema.map((props, index) => (
              <React.Fragment key={index}>{getInput(props)}</React.Fragment>
            ))}
            <Button disabled={isLoading} type="submit" variant="contained">
              {buttonText || 'Submit'}
            </Button>
          </Grid>
        </form>
      </Grid>
    </Grid>
  )
}
