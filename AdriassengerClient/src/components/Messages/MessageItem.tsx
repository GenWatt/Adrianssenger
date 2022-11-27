import { Typography, useTheme } from '@mui/material'
import { Message } from '../../global'
import useUser from '../../hooks/useUser'

type MessageItemProps = { message: Message }

export default function MessageItem({ message }: MessageItemProps) {
  const { user } = useUser()
  const theme = useTheme()

  return (
    <>
      <li
        style={{
          alignSelf: message.senderId === user.id ? 'flex-start' : 'flex-end',
          backgroundColor: theme.palette.primary.light,
          padding: theme.spacing(1),
          marginTop: theme.spacing(0.5),
          marginLeft: message.senderId !== user.id ? theme.spacing(3) : 0,
          marginRight: message.senderId === user.id ? theme.spacing(3) : 0,
          borderRadius: theme.spacing(0.1),
        }}
      >
        {message.message}
      </li>
      <Typography style={{ alignSelf: message.senderId === user.id ? 'flex-start' : 'flex-end' }} variant="caption">
        {new Date(message.createdAt).toLocaleString()}
      </Typography>
    </>
  )
}
