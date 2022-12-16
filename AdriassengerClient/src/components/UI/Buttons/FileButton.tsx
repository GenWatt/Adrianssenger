import { Theme } from '@mui/material'
import React, { ButtonHTMLAttributes } from 'react'
import { makeStyles } from 'tss-react/mui'

type FileButtonProps = {
  children: React.ReactNode
} & ButtonHTMLAttributes<HTMLButtonElement>

const useStyles = makeStyles()((theme: Theme) => ({
  button: {
    border: `${theme.spacing(0.3)} dashed ${theme.palette.primary.main}`,
    padding: theme.spacing(1),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'bold',
    minWidth: theme.spacing(15),
    minHeight: theme.spacing(15),
    cursor: 'pointer',
    backgroundColor: 'transparent',
  },
}))

export default function FileButton({ children, ...rest }: FileButtonProps) {
  const { classes } = useStyles()
  return (
    <button className={classes.button} {...rest}>
      {children}
    </button>
  )
}
