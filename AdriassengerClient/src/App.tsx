import './App.css'
import { Route, Routes } from 'react-router-dom'
import { routes } from './routes'
import React, { useEffect } from 'react'
import useSignalConnection from './hooks/SignalR/useSignalConnection'
import LayoutRoute from './routes/LayoutRoute'
import useLocalStorage from './hooks/useLocalStorage'
import { UserHeaderData } from './global'
import useUser from './hooks/useUser'

function App() {
  const { disconnect, makeConnections, connection } = useSignalConnection()
  const { getObj } = useLocalStorage()
  const { loadUser } = useUser()

  useEffect(() => {
    const savedUser = getObj<UserHeaderData>('user')
    if (savedUser) loadUser(savedUser)
  }, [])

  useEffect(() => {
    makeConnections()
    console.log('hej')

    return () => {
      disconnect()
    }
  }, [connection])

  return (
    <div className="App">
      <Routes>
        {routes.map((route, index) => (
          <React.Fragment key={index}>
            <Route element={<LayoutRoute route={route} />}>
              <Route path={route.path} element={route.element}>
                {route.children &&
                  route.children.map((route, index) => <Route key={index} path={route.path} element={route.element} />)}
              </Route>
            </Route>
          </React.Fragment>
        ))}
      </Routes>
    </div>
  )
}

export default App
