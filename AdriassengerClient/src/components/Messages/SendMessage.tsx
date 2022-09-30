import { TextField, Grid, Button, useTheme } from '@mui/material'

export default function SendMessage() {
  const theme = useTheme()
  return (
    <Grid container>
      <TextField
        style={{
          flexGrow: 1,
          border: `${theme.spacing(0.2)} solid ${theme.palette.secondary.main}`,
          borderRadius: theme.spacing(0.5),
        }}
        variant="filled"
        label="Write message"
      />
      <Button variant="contained">Send</Button>
    </Grid>
  )
}
