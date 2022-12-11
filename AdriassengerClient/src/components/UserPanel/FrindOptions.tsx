import { Grid, TextField, Tooltip } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import React, { useState } from 'react'
import AddFriendDialog from '../Friends/AddFriendDialog'

interface Props {
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void
  searchText: string
}

export default function FriendOptions({ handleSearch, searchText }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  const handleAddNewFriendModal = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)

  return (
    <>
      <Grid container alignItems="center" flexWrap="nowrap" p={1}>
        <SearchIcon />
        <TextField
          style={{ flexGrow: 1 }}
          variant="outlined"
          label="Search for your friends"
          value={searchText}
          onChange={handleSearch}
        />
        <Tooltip className="cursor-pointer" title="Add new friend">
          <AddIcon onClick={handleAddNewFriendModal} />
        </Tooltip>
      </Grid>
      <AddFriendDialog open={isOpen} handleClose={handleClose} />
    </>
  )
}
