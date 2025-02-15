import React, { createContext, useState, useContext } from 'react'
import {useNavigate } from 'react-router-dom'

export const UserContext = createContext()

export const useUser =() => {
  return useContext(UserContext)
}

export const UserProvider = ({ children }) => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  const login = (userData) => {
    setUser(userData);
  };    

  const logout = () => {
    setUser(null);
    navigate("/")
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  )
}
export default UserProvider;