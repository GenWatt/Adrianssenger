import { List, Grid, Theme } from '@mui/material'
import { useLayoutEffect, useRef, useEffect } from 'react'
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

let observer: IntersectionObserver | null = null

function Messages({ messages }: MessagesProps) {
  const { classes } = useStyles()
  const containerRef = useRef<any | null>(null)
  const listRef = useRef<any | null>(null)
  const firstUpdate = useRef(true)
  const { getMessageById, seenMessageRequest } = useMessage()

  const setScroll = () => {
    if (listRef.current) {
      containerRef.current.scrollTo({ top: listRef.current.scrollHeight })
    }
  }

  const handleIntersection = (entry: IntersectionObserverEntry) => {
    if (entry.isIntersecting) {
      const target = entry.target as HTMLDivElement
      const messageId = target.dataset.messageId

      if (messageId) {
        const message = getMessageById(+messageId)

        message && seenMessageRequest(message)
      }
    }
  }

  const AddEntries = (entries: IntersectionObserverEntry[]) => entries.forEach(handleIntersection)

  const setupObserverForMessagesItem = () => {
    if (listRef.current) {
      const messagesEl = listRef.current.children as HTMLDivElement[]

      if (messagesEl) {
        observer = new IntersectionObserver(AddEntries)

        for (const messageEl of messagesEl) {
          observer.observe(messageEl)
        }
      }
    }
  }

  useLayoutEffect(() => {
    if (messages.length) {
      firstUpdate.current && setScroll()
      setupObserverForMessagesItem()
      firstUpdate.current = false
    }

    return () => {
      observer && observer.disconnect()
      observer = null
    }
  }, [messages])

  useEffect(() => {
    return () => {
      firstUpdate.current = true
    }
  }, [])

  return (
    <Grid height="1px" overflow="auto" container ref={containerRef} flexGrow={1}>
      <List ref={listRef} className={classes.list}>
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}
      </List>
    </Grid>
  )
}

export default Messages
