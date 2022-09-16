import { Grid } from '@mui/material'
import { useEffect } from 'react'
import { Routes, useNavigate, Route, Outlet } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import LeftPanel from '../components/UserPanel/LeftPanel'
import RightPanel from '../components/UserPanel/RightPanel'
import useFetch from '../hooks/useFetch'

export default function Home() {
  return (
    <Grid container display="flex">
      <LeftPanel />
      <Outlet />
    </Grid>
  )
}
