import { Grid } from '@mui/material'
import { Outlet } from 'react-router-dom'
import LeftPanel from '../components/Panels/LeftPanel'

export default function Home() {
  return (
    <Grid container display="flex" flexWrap="nowrap" gap={1}>
      <LeftPanel />
      <Outlet />
    </Grid>
  )
}
