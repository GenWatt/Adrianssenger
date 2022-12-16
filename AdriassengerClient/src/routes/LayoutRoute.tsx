import { Grid } from '@mui/material'
import { Outlet } from 'react-router-dom'

type LayoutRouteProps = {
  route: any
}

export default function LayoutRoute({ route }: LayoutRouteProps) {
  return (
    <Grid>
      {route.layout}
      <Outlet />
    </Grid>
  )
}
