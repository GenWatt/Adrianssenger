import RightPanel from '../components/Panels/RightPanel'
import Home from '../views/Home'
import Login from '../views/Login'
import Register from '../views/Register'

export const routes = [
  { path: '/register', element: <Register /> },
  { path: '/login', element: <Login /> },
  { path: '/', element: <Home />, protected: true, children: [{ path: '/messages/:id', element: <RightPanel /> }] },
]
