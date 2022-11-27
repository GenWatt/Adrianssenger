import { List, Grid, useTheme } from '@mui/material'
import { useLayoutEffect, useRef } from 'react'
import type { Message } from '../../global'
import useMessage from '../../hooks/useMessage'
import MessageItem from './MessageItem'

type MessagesProps = { messages: Message[] }

export default function Messages({ messages }: MessagesProps) {
  const theme = useTheme()
  const ref = useRef<any>(null)
  const listRef = useRef<any>(null)
  const { messagesStore } = useMessage()

  const setScroll = () => {
    if (listRef.current) {
      console.log(listRef.current.scrollHeight)
      ref.current.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
    }
  }

  useLayoutEffect(() => {
    setScroll()
  }, [messagesStore])

  return (
    <Grid height="1px" overflow="auto" container ref={ref} flexGrow={1}>
      <List
        ref={listRef}
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          paddingLeft: theme.spacing(0.5),
          paddingRight: theme.spacing(0.5),
        }}
      >
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}
      </List>
    </Grid>
  )
}
