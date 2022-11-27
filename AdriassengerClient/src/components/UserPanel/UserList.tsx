import { List, ListItem, ListItemText, ListItemIcon } from '@mui/material'
import { SearchUser } from '../../global'
import AddIcon from '@mui/icons-material/Add'

type UserListProps = {
  users: SearchUser[]
  addFriendToList: (id: number) => void
}

export default function UserList({ users, addFriendToList }: UserListProps) {
  return (
    <List style={{ overflowY: 'auto', height: '30vh' }}>
      {users.map((user) => (
        <ListItem key={user.id} className="cursor-pointer" onClick={() => addFriendToList(user.id)}>
          <ListItemText>{user.userName}</ListItemText>
          <ListItemIcon style={{ minWidth: 0 }}>
            <AddIcon />
          </ListItemIcon>
        </ListItem>
      ))}
    </List>
  )
}
