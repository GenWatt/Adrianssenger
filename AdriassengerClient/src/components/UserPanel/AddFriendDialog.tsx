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
  DialogActions,
  DialogProps,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import React, { useState } from 'react'
import useFetch from '../../hooks/useFetch'
import { ApiResponse, SearchUser } from '../../global'
import useUser from '../../hooks/useUser'

type Props = { handleClose: () => void }

export default function AddFriendDialog({ handleClose, ...props }: DialogProps & Props) {
  const [users, setUsers] = useState<SearchUser[]>([])
  const searchUserApi = useFetch()
  const addToFrindListApi = useFetch()
  const [searchValue, setSearchValue] = useState('')
  const { user } = useUser()

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSearchValue(newValue)

    if (!newValue) return setUsers([])

    const response = await searchUserApi.callApi<ApiResponse<SearchUser[]>>('/Users/Search?searchText=' + newValue)

    if (!response) return setUsers([])

    if (searchUserApi.isError(response)) {
      setUsers(response.data)
    }
  }

  const addToFriendList = async (id: number) => {
    const response = await addToFrindListApi.callApi<ApiResponse<SearchUser>>('/Friends/' + user.id, 'POST', {
      secondUserId: id,
    })
    console.log(response)
    if (!response) return

    if (addToFrindListApi.isError(response)) {
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
        {searchUserApi.isLoading && (
          <Grid container justifyContent="center">
            <CircularProgress />
          </Grid>
        )}
        {users.length ? (
          <List style={{ overflowY: 'auto', height: '30vh' }}>
            {users.map((user) => (
              <ListItem key={user.id} className="cursor-pointer" onClick={() => addToFriendList(user.id)}>
                <ListItemText>{user.username}</ListItemText>
                <ListItemIcon style={{ minWidth: 0 }}>
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
  )
}
