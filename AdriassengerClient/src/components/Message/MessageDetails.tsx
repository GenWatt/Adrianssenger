import { Grid, Typography } from '@mui/material'
import { Message } from '../../global'
import useUser from '../../hooks/useUser'
import SeenOrNotSeen from './SeenOrNotSeen'
import useText from '../../hooks/useText'

export default function MessageDetails({ message }: { message: Message }) {
  const { getDateString } = useText()
  const { user } = useUser()
  return (
    <Grid>
      <SeenOrNotSeen seen={message.seen} />
      <Typography style={{ alignSelf: message.senderId === user.id ? 'flex-start' : 'flex-end' }} variant="caption">
        {getDateString(message.createdAt)}
      </Typography>
    </Grid>
  )
}
