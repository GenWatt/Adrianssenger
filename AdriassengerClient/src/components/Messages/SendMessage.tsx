import { TextField, Grid, Button, useTheme } from '@mui/material'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Message } from '../../global'
import useFetch from '../../hooks/useFetch'
import { useSnackbar } from 'notistack'
import SendIcon from '@mui/icons-material/Send'

export default function SendMessage() {
  const theme = useTheme()
  const [message, setMessage] = useState('')
  const { request } = useFetch()
  const { id } = useParams<string>()
  const { enqueueSnackbar } = useSnackbar()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!id || !message) return

    const messageObj: Partial<Message> = { receiverId: +id, message }

    try {
      const res = await request<Message>('/Messages', 'POST', messageObj)
      console.log(res)
      setMessage('')
    } catch (error) {
      console.log(error)
      enqueueSnackbar('Problem with sending message', { variant: 'error' })
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
