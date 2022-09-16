import { Avatar, List, ListItem, ListItemText, ListSubheader } from '@mui/material'
import Img from '../../assets/react.svg'

export default function FrindList() {
  return (
    <List>
      <ListItem divider>
        <Avatar src={Img} />
        <ListItemText>Hejoo</ListItemText>
      </ListItem>
    </List>
  )
}
