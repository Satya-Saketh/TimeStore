import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Add from './pages/Add'
import Booking from './pages/Booking'
import List from './pages/List'

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Add />} />
        <Route path="/list" element={<List />} />
        <Route path="/booking" element={<Booking />} />
      </Routes>
    </>
  )
}

export default App