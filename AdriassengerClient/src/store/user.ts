import { atom } from 'recoil'
import { UserHeaderData } from '../global'

export const initialUserValue: UserHeaderData = {
  userName: '',
  id: 0,
  avatarUrl: '',
  isLogIn: false,
  isRefreshing: false,
}

export const userState = atom<UserHeaderData>({
  key: 'userState',
  default: initialUserValue,
})
