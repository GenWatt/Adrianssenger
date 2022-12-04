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
import DeleteIcon from '@mui/icons-material/Delete'
import { Friend } from '../../global'
import { Link } from 'react-router-dom'
import useFriends from './useFriends'
import { useState } from 'react'
import RemoveFriend from '../UI/Dialogs/RemoveFriend'

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
  const { classes } = useStyles({ isSelect })
  const theme = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [friendToDelete, setFriendToDelete] = useState<Friend | null>(null)

  const handleClose = () => {
    setFriendToDelete(null)
    setIsOpen(false)
  }

  const handleOpen = (friend: Friend) => {
    setFriendToDelete(friend)
    setIsOpen(true)
  }

  const getClass = () => {
    let className = `${classes.roots} `

    if (isSelect) className += classes.selected
    return className
  }

  return (
    <ListItem className={getClass() + ` ${className}`} {...props}>
      {friendToDelete && <RemoveFriend isOpen={isOpen} onClose={handleClose} friend={friendToDelete} />}
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
          <ListItemIcon className={classes.buttons} onClick={() => handleOpen(friend)}>
            <DeleteIcon />
          </ListItemIcon>
        </Tooltip>
      </Grid>
    </ListItem>
  )
}
