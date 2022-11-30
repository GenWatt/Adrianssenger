import { List, Grid, Theme } from '@mui/material'
import { useLayoutEffect, useRef } from 'react'
import type { Message } from '../../global'
import useMessage from './useMessage'
import MessageItem from './MessageItem'
import { makeStyles } from 'tss-react/mui'

type MessagesProps = { messages: Message[] }

const useStyles = makeStyles()((theme: Theme) => {
  return {
    list: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      paddingLeft: theme.spacing(0.5),
      paddingRight: theme.spacing(0.5),
    },
  }
})

export default function Messages({ messages }: MessagesProps) {
  const { classes } = useStyles()
  const ref = useRef<any | null>(null)
  const listRef = useRef<any | null>(null)
  const { messagesStore } = useMessage()

  const setScroll = () => {
    if (listRef.current) {
      ref.current.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
    }
  }

  useLayoutEffect(() => {
    setScroll()
  }, [messagesStore])

  return (
    <Grid height="1px" overflow="auto" container ref={ref} flexGrow={1}>
      <List ref={listRef} className={classes.list}>
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}
      </List>
    </Grid>
  )
}
