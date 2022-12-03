import {
  ListItemProps,
  ListItem,
  Theme,
  Avatar,
  Grid,
  ListItemIcon,
  ListItemText,
  useTheme,
  Tooltip,
} from '@mui/material'
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
      borderRadius: theme.spacing(0.5),
      marginTop: theme.spacing(0.5),
      justifyContent: 'space-between',
      transition: 'background-color .3s ease',
      ['&:hover']: {
        backgroundColor: props.isSelect ? '' : theme.palette.primary.light,
      },
    },
    link: {
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      width: '100%',
    },
    selected: {
      backgroundColor: theme.palette.primary.dark,
    },
    buttons: {
      padding: theme.spacing(0.5),
      borderRadius: '50%',
      ['&:hover']: {
        backgroundColor: theme.palette.primary.dark,
      },
    },
  }
})

export default function FriendListItem({ isSelect, className, friend, ...props }: ListItemProps & FriendListItemProps) {
  const { deleteFriend } = useFriends()
  const { classes } = useStyles({ isSelect })
  const theme = useTheme()

  const getClass = () => {
    let className = `${classes.roots} `

    if (isSelect) className += classes.selected
    return className
  }

  return (
    <ListItem className={getClass() + ` ${className}`} {...props}>
      <Link className={classes.link} to={`/messages/${friend.id}`}>
        <Avatar src={friend.avatarUrl} />
        <Grid container p={1} direction="column" flexGrow={1}>
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
        </Grid>
      </Link>
      <Grid>
        <Tooltip title={`Delete ${friend.userName} from friends`}>
          <ListItemIcon className={classes.buttons} onClick={() => deleteFriend(friend.friendId)}>
            <DeleteIcon />
          </ListItemIcon>
        </Tooltip>
      </Grid>
    </ListItem>
  )
}
