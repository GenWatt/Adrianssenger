import { createTheme } from '@mui/material/styles'

const primaryColor = '#5F6F94'
const primaryDark = '#25316D'
const secondaryColor = '#309bab'
const primaryLight = '#3b5289'
const fontColor = '#E4E3E3'

export const theme = createTheme({
  palette: {
    primary: {
      main: primaryColor,
      dark: primaryDark,
      light: primaryLight,
    },
    secondary: {
      main: secondaryColor,
    },
    text: {
      primary: '#3fffff',
      secondary: '#2d2d2d',
    },
  },
  typography: {
    allVariants: {
      color: fontColor,
    },
  },
  components: {
    MuiMenuItem: {
      styleOverrides: {
        root: {
          backgroundColor: primaryLight,
          '&:hover': {
            backgroundColor: primaryDark,
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 0,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {},
      },
    },
  },
})
