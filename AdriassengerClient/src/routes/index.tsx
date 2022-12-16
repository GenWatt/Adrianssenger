import RightPanel from '../views/Panels/RightPanel'
import Home from '../views/Home'
import Login from '../views/Login'
import HomePanel from '../views/Panels/HomePanel'
import Register from '../views/Register'
import AppBar from '../components/UI/AppBar'

export const routes = [
  { path: '/register', element: <Register /> },
  { path: '/login', element: <Login /> },
  {
    path: '/',
    element: <Home />,
    protected: true,
    layout: <AppBar />,
    children: [
      { path: '/messages/:id', element: <RightPanel /> },
      { path: '/home', element: <HomePanel /> },
    ],
  },
]
