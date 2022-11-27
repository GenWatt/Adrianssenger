import './App.css'
import { Route, Routes, useLocation } from 'react-router-dom'
import { routes } from './routes'
import ProtectedRoute from './routes/ProtectedRoute'
import React, { useEffect } from 'react'
import AppBar from './components/UI/AppBar'
import useSignalConnection from './hooks/useSignalConnection'

const hideAppBarPaths = ['/login', '/register']

function App() {
  const location = useLocation()
  const { disconnect, makeConnections, connection } = useSignalConnection()

  useEffect(() => {
    makeConnections()

    return () => {
      disconnect()
    }
  }, [connection])

  const hideAppBar = (arr: string[]) => arr.some((e) => e === location.pathname)

  return (
    <div className="App">
      {!hideAppBar(hideAppBarPaths) && <AppBar />}
      <Routes>
        {routes.map((route, index) => (
          <React.Fragment key={index}>
            {route.protected ? (
              <Route path={route.path} element={<ProtectedRoute>{route.element}</ProtectedRoute>}>
                <>
                  {route.children &&
                    route.children.map((route, index) => (
                      <Route key={index} path={route.path} element={route.element} />
                    ))}
                </>
              </Route>
            ) : (
              <Route path={route.path} element={route.element} />
            )}
          </React.Fragment>
        ))}
      </Routes>
    </div>
  )
}

export default App
