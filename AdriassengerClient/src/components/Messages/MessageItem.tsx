import { Grid, Theme, Typography } from '@mui/material'
import { Message } from '../../global'
import useUser from '../../hooks/useUser'
import { makeStyles } from 'tss-react/mui'
import useText from '../../hooks/useText'

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
  const { getDateString } = useText()

  return (
    <div className={classes.item} data-message-id={message.id}>
      <li className={classes.message}>{message.message}</li>
      <Grid>
        {message.seen ? (
          <Typography variant="caption">Seen </Typography>
        ) : (
          <Typography variant="caption">Not seen </Typography>
        )}
        <Typography style={{ alignSelf: message.senderId === user.id ? 'flex-start' : 'flex-end' }} variant="caption">
          {getDateString(message.createdAt)}
        </Typography>
      </Grid>
    </div>
  )
}

export default MessageItem
