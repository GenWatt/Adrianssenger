import { createTheme } from '@mui/material/styles'

const primaryColor = '#2bc5c5'
const primaryDark = 'rgb(30, 137, 137)'
const primaryLight = 'rgb(85, 208, 208)'
const secondaryColor = '#e822d9'
const secondaryLight = 'rgb(236, 78, 224)'
const secondaryDark = 'rgb(162, 23, 151)'
const fontColor = 'rgba(0, 0, 0, 0.87)'

export const theme = createTheme({
  palette: {
    primary: {
      main: primaryColor,
      dark: primaryDark,
      light: primaryLight,
    },
    secondary: {
      main: secondaryColor,
      light: secondaryLight,
      dark: secondaryDark,
    },
    text: {
      //primary: '#3fffff',
      //secondary: '#2d2d2d',
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
