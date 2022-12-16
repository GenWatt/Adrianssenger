import { Theme } from '@mui/material'
import { Message } from '../../global'
import useUser from '../../hooks/useUser'
import { makeStyles } from 'tss-react/mui'
import { useState } from 'react'
import MessageDetails from './MessageDetails'

type MessageItemProps = { message: Message }

const useStyles = makeStyles<{ message: Message; userId: number }>()((theme: Theme, { message, userId }) => {
  return {
    item: {
      alignSelf: message.senderId === userId ? 'flex-start' : 'flex-end',
      marginTop: theme.spacing(0.5),
      marginLeft: message.senderId !== userId ? theme.spacing(3) : 0,
      marginRight: message.senderId === userId ? theme.spacing(3) : 0,
      borderRadius: theme.spacing(0.1),
      width: 'fit-content',
    },
    message: {
      backgroundColor: message.senderId === userId ? theme.palette.primary.light : theme.palette.grey[200],
      padding: theme.spacing(1),
      width: 'fit-content',
      animation: message.senderId !== userId && !message.seen ? 'unSeenMessage 2s ease infinite' : '',
      '@keyframes unSeenMessage': {
        '0%': {
          backgroundColor: theme.palette.grey[200],
        },
        '100%': {
          backgroundColor: theme.palette.grey[500],
        },
      },
    },
  }
})

function MessageItem({ message }: MessageItemProps) {
  const { user } = useUser()
  const { classes } = useStyles({ message, userId: user.id })
  const [isShowDetails, setShowDetails] = useState(false)

  const handleShowDetails = () => {
    setShowDetails(!isShowDetails)
  }

  return (
    <div onClick={handleShowDetails} className={classes.item} data-message-id={message.id}>
      <li className={classes.message}>{message.message}</li>
      {isShowDetails && <MessageDetails message={message} />}
    </div>
  )
}

export default MessageItem
