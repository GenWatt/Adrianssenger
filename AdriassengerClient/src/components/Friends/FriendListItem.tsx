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
import { useState } from 'react'
import RemoveFriend from '../UI/Dialogs/RemoveFriend'
import useFile from '../../hooks/useFile'

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
    unseenMessageBadge: {
      backgroundColor: theme.palette.secondary.main,
      width: theme.spacing(3),
      height: theme.spacing(3),
      borderRadius: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
    },
    newMessage: {
      animation: 'newMessage 2s ease infinite',
      '@keyframes newMessage': {
        '0%': {
          backgroundColor: theme.palette.secondary.main,
        },
        '100%': {
          backgroundColor: theme.palette.secondary.light,
        },
      },
    },
  }
})

export default function FriendListItem({ isSelect, className, friend, ...props }: ListItemProps & FriendListItemProps) {
  const { classes } = useStyles({ isSelect })
  const theme = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [friendToDelete, setFriendToDelete] = useState<Friend | null>(null)
  const { getStaticFile } = useFile()

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

    if (isSelect) className += classes.selected + ' '

    if (friend.unseenMessagesCount > 0) className += classes.newMessage + ' '
    return className
  }

  return (
    <ListItem className={getClass() + ` ${className}`} {...props}>
      {friendToDelete && <RemoveFriend isOpen={isOpen} onClose={handleClose} friend={friendToDelete} />}
      <Link className={classes.link} to={`/messages/${friend.id}`}>
        <Avatar src={getStaticFile(friend.avatarUrl)} />
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
      <Grid container justifyContent="flex-end" alignItems="center">
        {friend.unseenMessagesCount > 0 ? (
          <ListItemIcon>
            <div className={classes.unseenMessageBadge}>{friend.unseenMessagesCount}</div>
          </ListItemIcon>
        ) : null}
        <Tooltip title={`Delete ${friend.userName} from friends`}>
          <ListItemIcon className={classes.buttons} onClick={() => handleOpen(friend)}>
            <DeleteIcon />
          </ListItemIcon>
        </Tooltip>
      </Grid>
    </ListItem>
  )
}
