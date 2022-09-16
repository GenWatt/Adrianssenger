import './App.css'
import { Route, Routes } from 'react-router-dom'
import { routes } from './routes'
import ProtectedRoute from './routes/ProtectedRoute'
import React from 'react'

function App() {
  return (
    <div className="App">
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
