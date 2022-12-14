import { Dialog, MenuItem, MenuList, useTheme, DialogTitle, DialogContent } from '@mui/material'
import useUserAction from '../../../hooks/useUserAction'

type UserMenuProps = { isShow: boolean; closeMenu: () => void }

export default function UserMenu({ isShow, closeMenu }: UserMenuProps) {
  const { logout } = useUserAction()
  const theme = useTheme()

  return (
    <Dialog open={isShow} onClose={closeMenu}>
      <DialogTitle color={theme.palette.text.secondary}>Quick Options</DialogTitle>
      <DialogContent>
        <MenuList>
          <MenuItem onClick={logout}>Log out</MenuItem>
        </MenuList>
      </DialogContent>
    </Dialog>
  )
}
