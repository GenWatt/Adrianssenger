import { Theme } from '@mui/material'
import { makeStyles } from 'tss-react/mui'
import React from 'react'

type IconButtonProps = { children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>

const useStyles = makeStyles()((theme: Theme) => {
  return {
    roots: {
      border: 'none',
      backgroundColor: 'transparent',
      padding: 0,
      cursor: 'pointer',
    },
  }
})

export default function IconButton({ children, className, ...props }: IconButtonProps) {
  const { classes } = useStyles()
  return (
    <button className={`${className} ${classes.roots}`} {...props}>
      {children}
    </button>
  )
}
