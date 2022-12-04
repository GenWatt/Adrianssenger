import { Dialog, DialogContent, DialogTitle, Grid, TextField, DialogActions, DialogProps } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import React, { useState } from 'react'
import useFetch from '../../hooks/useFetch'
import { SearchUser } from '../../global'
import { useSnackbar } from 'notistack'
import useFriends from './useFriends'
import useUsers from '../../hooks/useUsers'
import Loader from '../UI/Loaders/Loader'
import UserList from '../UserPanel/UserList'
import NotFound from '../UI/NotFound/NotFound'

type Props = { handleClose: () => void }

export default function AddFriendDialog({ handleClose, ...props }: DialogProps & Props) {
  const [users, setUsers] = useState<SearchUser[]>([])
  const searchUserApi = useFetch()
  const [searchValue, setSearchValue] = useState('')
  const { enqueueSnackbar } = useSnackbar()
  const { addFriendToList } = useFriends()
  const { searchForFriends } = useUsers()

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSearchValue(newValue)

    if (!newValue) return setUsers([])

    try {
      const friendsResponse = await searchForFriends(newValue)
      setUsers(friendsResponse)
    } catch (error) {
      enqueueSnackbar(searchUserApi.getErrorMessage(error), { variant: 'error' })
    }
  }

  const addFriend = async (id: number) => {
    try {
      addFriendToList(id)
    } catch (error) {
      enqueueSnackbar(searchUserApi.getErrorMessage(error), { variant: 'error' })
    }
  }

  return (
    <Dialog style={{ overflowY: 'initial' }} {...props} onClose={handleClose}>
      <DialogActions>
        <CloseIcon className="cursor-pointer" onClick={handleClose} />
      </DialogActions>
      <DialogTitle variant="h4" textAlign="center" textTransform="uppercase">
        Add new friend
      </DialogTitle>
      <DialogContent style={{ overflowY: 'initial', maxHeight: '60vh' }}>
        <Grid container alignItems="center" py={1}>
          <TextField value={searchValue} onChange={handleSearch} fullWidth label="Search for new friend" />
        </Grid>
        {searchUserApi.isLoading && <Loader />}
        {users.length ? (
          <UserList users={users} addFriendToList={addFriend} />
        ) : (
          <>{searchValue && <NotFound>Users not found</NotFound>}</>
        )}
      </DialogContent>
    </Dialog>
  )
}
