import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material'
import { Friend } from '../../../global'
import useFriends from '../../Friends/useFriends'

type RemoveFriendProps = { friend: Friend; isOpen: boolean; onClose: () => void }

export default function RemoveFriend({ friend, isOpen, onClose }: RemoveFriendProps) {
  const { deleteFriend } = useFriends()
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Are you sure to remove {friend.userName}</DialogTitle>
      <DialogContent>
        <Button onClick={() => deleteFriend(friend.friendId)} variant="contained" color="success">
          Yes
        </Button>
        <Button onClick={onClose} variant="contained" color="error">
          No
        </Button>
      </DialogContent>
    </Dialog>
  )
}
