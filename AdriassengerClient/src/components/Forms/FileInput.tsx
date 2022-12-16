import { FormControl, Input, InputProps, useTheme } from '@mui/material'
import React, { CSSProperties, useRef } from 'react'
import FileButton from '../UI/Buttons/FileButton'
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
        <FileButton style={{ marginTop: theme.spacing(1), marginBottom: theme.spacing(1) }}>
          {!preview ? label : <img style={{ width: '90%' }} src={preview}></img>}
        </FileButton>
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
