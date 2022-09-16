import { atom, selector } from 'recoil'
import { UserWithToken } from '../global'

export const initialUserValue: UserWithToken = { username: '', id: 0, token: '', isVeryfied: false, refreshToken: '' }

export const userState = atom<UserWithToken>({
  key: 'userState',
  default: initialUserValue,
})

export const isAuthenticate = selector({
  key: 'isAuth',
  get: ({ get }) => {
    const user = get(userState)
    return user.token && user.id
  },
})
