import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Typography,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import React, { useState } from 'react'
import useFetch from '../../hooks/useFetch'
import { ApiResponse } from '../../global'
import useUser from '../../hooks/useUser'

interface SearchUser {
  id: number
  username: string
}

export default function FriendOptions() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const { user } = useUser()
  const [users, setUsers] = useState<SearchUser[]>([])
  const searchUserApi = useFetch()
  const addToFrindListApi = useFetch()

  const handleAddNewFriendModal = () => setIsOpen(true)

  const handleClose = () => setIsOpen(false)

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSearchValue(newValue)

    if (!newValue) return setUsers([])

    const response = await searchUserApi.callApi<ApiResponse<SearchUser[]>>('/Users/Search?searchText=' + newValue)

    if (!response) return setUsers([])

    if (searchUserApi.notError(response)) {
      setUsers(response.data)
    }
  }

  const addToFriendList = async (id: number) => {
    const response = await addToFrindListApi.callApi<ApiResponse<SearchUser>>('/Friends', 'POST', {
      firstUser: user.id,
      secondUser: id,
    })
    console.log(response)
    if (!response) return

    if (addToFrindListApi.notError(response)) {
    }
  }

  return (
    <Grid container alignItems="center" p={1}>
      <SearchIcon />
      <TextField variant="outlined" label="Search for your friends" />
      <Tooltip className="cursor-pointer" title="Add new friend">
        <AddIcon onClick={handleAddNewFriendModal} />
      </Tooltip>
      <Dialog onClose={handleClose} open={isOpen}>
        <DialogTitle variant="h4" textAlign="center" textTransform="uppercase">
          Add new friend
        </DialogTitle>
        <DialogContent>
          <Grid container alignItems="center" py={1}>
            <TextField value={searchValue} onChange={handleSearch} fullWidth label="Search for new friend" />
          </Grid>
          {searchUserApi.isLoading && (
            <Grid container justifyContent="center">
              <CircularProgress />
            </Grid>
          )}
          {users.length ? (
            <List>
              {users.map((user) => (
                <ListItem key={user.id}>
                  <ListItemText>{user.username}</ListItemText>
                  <ListItemIcon
                    className="cursor-pointer"
                    style={{ minWidth: 0 }}
                    onClick={() => addToFriendList(user.id)}
                  >
                    <AddIcon />
                  </ListItemIcon>
                </ListItem>
              ))}
            </List>
          ) : (
            <>{searchValue && <Typography textAlign="center">No users found</Typography>}</>
          )}
        </DialogContent>
      </Dialog>
    </Grid>
  )
}
