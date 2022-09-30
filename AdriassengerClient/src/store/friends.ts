import { atom, selector } from 'recoil'
import { Friend } from '../global'

interface FriendState {
  friends: Friend[]
  currentTextingFriend: null | number
}

const initialFriendsValue: Friend[] = []

export const friendsState = atom<FriendState>({
  key: 'friends',
  default: {
    friends: initialFriendsValue,
    currentTextingFriend: null,
  },
})

export const getFriendById = selector({
  key: 'friendById',
  get: ({ get }) => {
    const state = get(friendsState)
    return (id: number) => state.friends.find((friend) => friend.id === id)
  },
})
