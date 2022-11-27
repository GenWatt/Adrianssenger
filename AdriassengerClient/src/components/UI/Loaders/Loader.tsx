import { Grid, CircularProgress } from '@mui/material'

export default function Loader() {
  return (
    <Grid container justifyContent="center">
      <CircularProgress />
    </Grid>
  )
}
