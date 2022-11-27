import { atom, selector } from 'recoil'
import { UserHeaderData } from '../global'

export const initialUserValue: UserHeaderData = { userName: '', id: 0, avatarUrl: '' }

export const userState = atom<UserHeaderData>({
  key: 'userState',
  default: initialUserValue,
})

export const isAuthenticate = selector({
  key: 'isAuth',
  get: ({ get }) => {
    const user = get(userState)
    return user && Boolean(user.id)
  },
})
