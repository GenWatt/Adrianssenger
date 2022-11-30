import { Button, FormControl, Grid, Input, InputProps } from '@mui/material'
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

  const focusOnInput = () => {
    if (inputRef.current) {
      inputRef.current.querySelector(`#${id}`)?.click()
    }
  }

  return (
    <FormControl style={controllStyles}>
      <label htmlFor={id} onClick={focusOnInput}>
        <Button variant="contained">{label}</Button>
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
      {preview && (
        <Grid mt={1} container justifyContent="center">
          <img style={{ width: '15vw' }} src={preview} alt="preview" />
        </Grid>
      )}
      <FormErrors errors={errors} name={name} />
    </FormControl>
  )
}
