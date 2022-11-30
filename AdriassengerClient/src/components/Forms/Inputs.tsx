import { InputProps, FormControl, InputLabel, Input } from '@mui/material'
import React from 'react'
import FormErrors from './FormErrors'

type InputsProps = {
  label: string
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  errors?: any
  name: string
  type: string
} & InputProps

export default function Inputs({ label, handleChange, errors, name, type, ...input }: InputsProps) {
  return (
    <FormControl fullWidth margin="normal">
      <InputLabel>{label}</InputLabel>
      <Input type={type} onChange={handleChange} name={name} {...input}></Input>
      <FormErrors errors={errors} name={name} />
    </FormControl>
  )
}
