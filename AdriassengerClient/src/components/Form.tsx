import { FormControl, Input, Typography, Paper, Grid, InputLabel, Button } from '@mui/material'
import { FormSchema } from '../global'

interface Props {
  schema: FormSchema[]
  header?: string
  buttonText?: string
  isLoading?: boolean
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

export default function Form({ schema, header, buttonText, onSubmit, isLoading }: Props) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    onSubmit && onSubmit(e)
  }

  return (
    <Grid container display="flex" justifyContent="center" pt={20}>
      <Paper variant="elevation">
        <Grid minWidth={400} p={1}>
          {header && (
            <header>
              <Typography textTransform="uppercase" textAlign="center" variant="h3">
                {header}
              </Typography>
            </header>
          )}
          <form onSubmit={handleSubmit}>
            <Grid container display="flex" alignItems="center" direction="column">
              {schema.map(({ label, ...input }, index) => (
                <FormControl key={index} fullWidth margin="normal">
                  <InputLabel>{label}</InputLabel>
                  <Input {...input}></Input>
                </FormControl>
              ))}
              <Button disabled={isLoading} type="submit" variant="contained">
                {buttonText || 'Submit'}
              </Button>
            </Grid>
          </form>
        </Grid>
      </Paper>
    </Grid>
  )
}
