import { ListItemProps, ListItem, Theme, Avatar, Grid, ListItemIcon, ListItemText, useTheme } from '@mui/material'
import { makeStyles } from 'tss-react/mui'
import MailIcon from '@mui/icons-material/Mail'
import DeleteIcon from '@mui/icons-material/Delete'
import { Friend } from '../../global'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import useFriends from './useFriends'

interface FriendListItemProps {
  isSelect?: boolean
  friend: Friend
}

const useStyles = makeStyles<{ isSelect?: boolean }>()((theme: Theme, props) => {
  return {
    roots: {
      backgroundColor: theme.palette.primary.main,
      borderRadius: theme.spacing(0.5),
      marginTop: theme.spacing(0.5),
      transition: 'background-color .3s ease',
      ['&:hover']: {
        backgroundColor: props.isSelect ? '' : theme.palette.primary.light,
      },
    },
    selected: {
      backgroundColor: theme.palette.primary.dark,
    },
    buttons: {
      padding: theme.spacing(0.5),
      borderRadius: '50%',
      ['&:hover']: {
        backgroundColor: theme.palette.secondary.light,
      },
    },
  }
})

export default function FriendListItem({ isSelect, className, friend, ...props }: ListItemProps & FriendListItemProps) {
  const { deleteFriend } = useFriends()
  const { classes } = useStyles({ isSelect })
  const theme = useTheme()
  const navigate = useNavigate()

  const getClass = () => {
    let className = `${classes.roots} `

    if (isSelect) className += classes.selected
    return className
  }

  return (
    <ListItem className={getClass() + ` ${className}`} {...props}>
      <Avatar src={friend.avatarUrl} />
      <Grid container p={1} direction="column" flexGrow={1}>
        <Link to={`/messages/${friend.id}`}>
          <ListItemText
            className="width-inherit"
            primary={friend.userName}
            primaryTypographyProps={{ fontSize: theme.typography.h6.fontSize, className: 'ellipsis' }}
          />
          <ListItemText
            className="width-inherit"
            primaryTypographyProps={{ className: 'ellipsis' }}
            primary={friend.lastMessage}
          />
        </Link>
      </Grid>
      <ListItemIcon className={classes.buttons} onClick={() => navigate('/messages/' + friend.id)}>
        <MailIcon />
      </ListItemIcon>
      <ListItemIcon className={classes.buttons} onClick={() => deleteFriend(friend.friendId)}>
        <DeleteIcon />
      </ListItemIcon>
    </ListItem>
  )
}
