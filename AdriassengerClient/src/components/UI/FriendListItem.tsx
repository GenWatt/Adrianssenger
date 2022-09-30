import { ListItemProps, ListItem, Theme, Avatar, Grid, ListItemIcon, ListItemText, useTheme } from '@mui/material'
import { makeStyles } from 'tss-react/mui'
import MailIcon from '@mui/icons-material/Mail'
import { Friend } from '../../global'

interface Props {
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
  }
})

export default function FriendListItem({ isSelect, className, friend, ...props }: ListItemProps & Props) {
  const { classes } = useStyles({ isSelect })
  const theme = useTheme()

  const getClass = () => {
    let className = `${classes.roots} `

    if (isSelect) className += classes.selected
    return className
  }

  return (
    <ListItem className={getClass() + ` ${className}`} {...props}>
      <Avatar src={friend.imgUrl} />
      <Grid width="80%" container p={1} direction="column">
        <ListItemText
          className="width-inherit"
          primary={friend.username}
          primaryTypographyProps={{ fontSize: theme.typography.h6.fontSize, className: 'ellipsis' }}
        />
        <ListItemText
          className="width-inherit"
          primaryTypographyProps={{ className: 'ellipsis' }}
          primary={friend.lastMessage}
        />
      </Grid>
      <ListItemIcon>
        <MailIcon />
      </ListItemIcon>
    </ListItem>
  )
}
