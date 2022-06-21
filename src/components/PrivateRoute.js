import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function PrivateHome({children}) {
    const { currentUser } = useAuth()
  return (
    <div>
        {currentUser ? children : <Navigate to="/login"></Navigate>}
    </div>
  )
}

export function PrivateAuth({children}) {
  const { currentUser } = useAuth()
return (
  <div>
      {currentUser ? <Navigate to="/"></Navigate> : children }
  </div>
)
}
