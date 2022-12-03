import { atom } from 'recoil'
import { NotificationState } from '../global'

interface Notifications {
  notifications: NotificationState[]
}

export const initialNotificationState: Notifications = {
  notifications: [],
}

export const notificationState = atom<Notifications>({
  key: 'notificationState',
  default: initialNotificationState,
})
