import { TextField, Grid, Button, useTheme } from '@mui/material'
import axios, { AxiosError } from 'axios'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { ApiError, ApiErrors, ApiResponse, Message } from '../../global'
import useFetch from '../../hooks/useFetch'
import { useSnackbar } from 'notistack'
import useText from '../../hooks/useText'
import SendIcon from '@mui/icons-material/Send'

export default function SendMessage() {
  const theme = useTheme()
  const [message, setMessage] = useState('')
  const { request } = useFetch()
  const { id } = useParams<string>()
  const { joinMessages } = useText()
  const { enqueueSnackbar } = useSnackbar()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!id) return
    const messageObj: Partial<Message> = { receiverId: +id, message }
    try {
      await request<Message>('/Messages', 'POST', messageObj)
    } catch (error) {
      const errors = error as AxiosError<ApiErrors>
      if (axios.isAxiosError(error)) {
        console.log(errors)
        errors.response &&
          errors.response.data &&
          enqueueSnackbar(joinMessages(errors.response.data.errors), { variant: 'error' })
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)

  return (
    <Grid container borderTop={`${theme.spacing(0.1)} solid ${theme.palette.primary.light}`}>
      <form style={{ width: '100%', display: 'flex' }} onSubmit={handleSubmit}>
        <TextField
          value={message}
          onChange={handleChange}
          style={{
            flexGrow: 1,
            borderRadius: theme.spacing(0.5),
          }}
          variant="standard"
          label="Write message"
        />
        <Button aria-label="Send message" type="submit" variant="text">
          <SendIcon />
        </Button>
      </form>
    </Grid>
  )
}
