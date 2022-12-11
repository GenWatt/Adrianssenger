import { Button, FormControl, Grid, Input, InputProps, useTheme } from '@mui/material'
import React, { CSSProperties, useRef } from 'react'
import FormErrors from './FormErrors'

type FileInputProps = {
  label: string
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  errors?: any
  name: string
  controllStyles?: CSSProperties
  preview?: string
} & InputProps

export default function FileInput({
  id,
  name,
  errors,
  handleChange,
  label,
  preview,
  controllStyles = {},
  ...input
}: FileInputProps) {
  const inputRef = useRef<any | null>()
  const theme = useTheme()

  const focusOnInput = () => {
    if (inputRef.current) {
      inputRef.current.querySelector(`#${id}`)?.click()
    }
  }

  return (
    <FormControl style={controllStyles}>
      <label htmlFor={id} onClick={focusOnInput}>
        {preview && (
          <Grid my={1} container justifyContent="center">
            <img style={{ width: theme.spacing(20) }} src={preview} alt="preview" />
          </Grid>
        )}
        <Button style={{ marginTop: theme.spacing(1), marginBottom: theme.spacing(1) }} variant="contained">
          {label}
        </Button>
        <Input
          ref={inputRef}
          style={{ display: 'none' }}
          type="file"
          id={id}
          name={name}
          onChange={handleChange}
          {...input}
        />
      </label>
      <FormErrors errors={errors} name={name} />
    </FormControl>
  )
}
