import { Avatar, Dialog, DialogContent, DialogTitle, Grid, useTheme } from '@mui/material'
import { useSnackbar } from 'notistack'
import React from 'react'
import { UserHeaderData } from '../../../global'
import useFetch from '../../../hooks/useFetch'
import useFile from '../../../hooks/useFile'
import useUser from '../../../hooks/useUser'
import Form from '../../Forms/Form'
import IconButton from '../Buttons/IconButton'
import CloseIcon from '@mui/icons-material/Close'

type EditPhotoProps = { isOpen: boolean; handleClose: () => void }

const schema = [{ type: 'file', label: 'Choose profile image', name: 'profilePicture', id: 'profilePicture' }]

export default function EditPhoto({ isOpen, handleClose }: EditPhotoProps) {
  const { user, updateUser } = useUser()
  const { request } = useFetch()
  const { enqueueSnackbar } = useSnackbar()
  const { getStaticFile } = useFile()
  const theme = useTheme()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      const res = await request<UserHeaderData>('/Users/' + user.id, 'PUT', new FormData(e.target as HTMLFormElement))
      updateUser(res.data)
    } catch (error) {
      enqueueSnackbar('Could not update photo')
    }
  }

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <IconButton
        style={{ position: 'absolute', right: theme.spacing(1), top: theme.spacing(1) }}
        onClick={handleClose}
      >
        <CloseIcon />
      </IconButton>
      <DialogTitle>Edit Photo</DialogTitle>
      <DialogContent>
        <Grid container justifyContent="center">
          <Avatar
            style={{ width: theme.spacing(20), height: theme.spacing(20) }}
            src={getStaticFile(user.avatarUrl)}
          ></Avatar>
        </Grid>

        <Form schema={schema} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  )
}
