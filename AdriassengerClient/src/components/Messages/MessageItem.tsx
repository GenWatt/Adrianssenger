import { Theme, Typography } from '@mui/material'
import { Message } from '../../global'
import useUser from '../../hooks/useUser'
import { makeStyles } from 'tss-react/mui'
import useText from '../../hooks/useText'

type MessageItemProps = { message: Message }

const useStyles = makeStyles<{ senderId: number; userId: number }>()((theme: Theme, props) => {
  return {
    item: {
      position: 'absolute',
      alignSelf: props.senderId === props.userId ? 'flex-start' : 'flex-end',
      backgroundColor: theme.palette.primary.light,
      padding: theme.spacing(1),
      marginTop: theme.spacing(0.5),
      marginLeft: props.senderId !== props.userId ? theme.spacing(3) : 0,
      marginRight: props.senderId === props.userId ? theme.spacing(3) : 0,
      borderRadius: theme.spacing(0.1),
    },
  }
})

export default function MessageItem({ message }: MessageItemProps) {
  const { user } = useUser()
  const { classes } = useStyles({ senderId: message.senderId, userId: user.id })
  const { getDateString } = useText()

  return (
    <>
      <li className={classes.item}>{message.message}</li>
      <Typography style={{ alignSelf: message.senderId === user.id ? 'flex-start' : 'flex-end' }} variant="caption">
        {getDateString(message.createdAt)}
      </Typography>
    </>
  )
}
