import { Grid, Theme, Typography, useTheme } from '@mui/material'
import { useState } from 'react'
import AddFriendDialog from '../../components/Friends/AddFriendDialog'
import useFriends from '../../components/Friends/useFriends'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme: Theme) => {
  return {
    root: {
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
  }
})

export default function HomePanel() {
  const [isOpen, setIsOpen] = useState(false)
  const { isLoading, friendStore } = useFriends()
  const theme = useTheme()
  const { classes } = useStyles()

  const handleShowAddFriendDialog = () => {
    setIsOpen(true)
  }

  const handleCloseAddFriendDialog = () => {
    setIsOpen(false)
  }

  return (
    <Grid width="100%" className={classes.root}>
      <AddFriendDialog open={isOpen} handleClose={handleCloseAddFriendDialog} />
      {!isLoading && friendStore.friends.length ? (
        <Typography variant="h5" textAlign="center">
          Select friend to chat
        </Typography>
      ) : null}
      {isLoading && (
        <Typography variant="h5" textAlign="center">
          Loading friends
        </Typography>
      )}
      {!isLoading && !friendStore.friends.length ? (
        <Typography variant="h5" textAlign="center">
          You don't have friends yet
          <Typography
            style={{ cursor: 'pointer' }}
            color={theme.palette.primary.main}
            onClick={handleShowAddFriendDialog}
          >
            Try to add new friend!
          </Typography>
        </Typography>
      ) : null}
    </Grid>
  )
}
