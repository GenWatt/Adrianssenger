import { atom, selector } from 'recoil'
import { Friend } from '../global'

interface FriendState {
  friends: Friend[]
  currentTextingFriend: null | number
}

export const initialFriendsValue: FriendState = {
  friends: [],
  currentTextingFriend: null,
}

export const friendsState = atom<FriendState>({
  key: 'friends',
  default: initialFriendsValue,
})

export const getFriendById = selector({
  key: 'friendById',
  get: ({ get }) => {
    const state = get(friendsState)
    return (id: number) => state.friends.find((friend) => friend.id === id)
  },
})
