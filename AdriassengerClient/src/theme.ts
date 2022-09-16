import { createTheme } from '@mui/material/styles'

const primaryColor = '#233445'
const primaryDark = '#dbdbdb'
const secondaryColor = '#edf2ff'

export const theme = createTheme({
  palette: {
    primary: {
      main: primaryColor,
      dark: primaryDark,
    },
    secondary: {
      main: secondaryColor,
    },
  },
  components: {
    MuiMenuItem: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          '&:hover': {
            backgroundColor: primaryDark,
          },
        },
      },
    },
  },
})
