import { useTheme } from '@mui/material'

export default function useFromTheme() {
  const theme = useTheme()

  const getNumberFromSpacing = (value: number) => {
    const arr = theme.spacing(value).match(/[0-9]+/)
    let numInPixels: RegExpMatchArray = arr ? arr : ['0']
    return +numInPixels[0]
  }

  return { getNumberFromSpacing }
}
