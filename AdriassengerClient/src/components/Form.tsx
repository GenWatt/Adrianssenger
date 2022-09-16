import { FormControl, Input, Typography, Paper, Grid, InputLabel, Button, Alert } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import { FormSchema } from '../global'
import useForm from '../hooks/useFrom'

interface Props {
  schema: readonly FormSchema[]
  header?: string
  buttonText?: string
  isLoading?: boolean
  errorMessage?: string
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

export default function Form({ schema, header, buttonText, onSubmit, isLoading, errorMessage }: Props) {
  type RegisterValues = typeof schema[number]['name']

  const { validate, errors, convertFormDataToObject, isError, resetError } = useForm<RegisterValues>()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    validate(convertFormDataToObject(e.target as HTMLFormElement), schema)
    if (isError.current) return e.preventDefault()
    onSubmit && onSubmit(e)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    resetError(e.target.name)
  }

  return (
    <Grid container display="flex" justifyContent="center" pt={20}>
      <Paper variant="elevation">
        <Grid minWidth={400} p={1}>
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
              {schema.map(({ label, to, rules, name, ...input }, index) => (
                <React.Fragment key={index}>
                  {to ? (
                    <Link style={{ paddingTop: '1rem', paddingBottom: '1rem' }} to={to}>
                      {label}
                    </Link>
                  ) : (
                    <FormControl fullWidth margin="normal">
                      <InputLabel>{label}</InputLabel>
                      <Input onChange={handleChange} name={name} {...input}></Input>
                      {errors[name] && (
                        <Typography color={'red'} variant="caption">
                          {errors[name].map((error, index) => (
                            <div key={index}>{error}</div>
                          ))}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                </React.Fragment>
              ))}
              <Button disabled={isLoading} type="submit" variant="contained">
                {buttonText || 'Submit'}
              </Button>
            </Grid>
          </form>
        </Grid>
      </Paper>
    </Grid>
  )
}
