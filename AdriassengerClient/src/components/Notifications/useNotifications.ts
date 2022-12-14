import { notificationState } from '../../store/notification'
import { useRecoilState } from 'recoil'
import { NotificationState } from '../../global'
import useFetch from '../../hooks/useFetch'

export default function useNotifications() {
  const [notificationStore, setNotificationStore] = useRecoilState(notificationState)
  const { request, isLoading } = useFetch()

  const loadNotifications = async () => {
    try {
      const response = await request<NotificationState[]>('/Notification')
      if (response) {
        setNotificationStore(() => ({ notifications: response.data }))
      }
    } catch (error) {}
  }

  const deleteNotificationApi = async (id: number) => {
    await request('/Notification/' + id, 'DELETE')
  }

  const removeNotification = (id: number) => {
    setNotificationStore((prev) => ({
      notifications: prev.notifications.filter((notification) => notification.id !== id),
    }))
  }

  const removeNotificationByActionId = (actionId: number) => {
    setNotificationStore((prev) => ({
      notifications: prev.notifications.filter((notification) => notification.actionId !== actionId),
    }))
  }

  const addNotification = (data: NotificationState) => {
    setNotificationStore((prev) => ({ notifications: [...prev.notifications, data] }))
  }

  const notificationLength = () => notificationStore.notifications.length

  return {
    removeNotification,
    addNotification,
    removeNotificationByActionId,
    notificationStore,
    loadNotifications,
    isLoading,
    setNotificationStore,
    notificationLength,
    deleteNotificationApi,
  }
}
