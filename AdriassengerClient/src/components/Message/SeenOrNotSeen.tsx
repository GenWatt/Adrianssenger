import { Typography } from '@mui/material'

export default function SeenOrNotSeen({ seen }: { seen: boolean }) {
  return (
    <>
      {seen ? <Typography variant="caption">Seen </Typography> : <Typography variant="caption">Not seen </Typography>}
    </>
  )
}
