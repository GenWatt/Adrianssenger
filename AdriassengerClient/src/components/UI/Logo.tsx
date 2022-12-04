import { useTheme } from '@mui/material'
import LogoImg from '../../assets/adrianssenger.png'

export default function Logo() {
  const theme = useTheme()

  return (
    <img
      style={{ width: theme.spacing(8), height: theme.spacing(8), borderRadius: theme.spacing(0.4) }}
      src={LogoImg}
      alt="logo"
    />
  )
}
