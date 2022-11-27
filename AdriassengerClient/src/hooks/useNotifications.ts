import { notificationState } from '../store/notification'
import { useRecoilState } from 'recoil'
import { NotificationState } from '../global'

export default function useNotifications() {
  const [notificationStore, setNotificationStore] = useRecoilState(notificationState)

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

  return { removeNotification, addNotification, removeNotificationByActionId, notificationStore }
}
