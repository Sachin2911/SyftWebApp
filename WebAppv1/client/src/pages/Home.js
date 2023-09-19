import React from 'react'
import Dashboard from '../scenes/dashboard/Dashboard'
import ChatBot from '../components/ChatBot'

function Home() {
  return (
    <div className='dashboardContainer'>
      <Dashboard/>
      <ChatBot /> 
    </div>
  )
}
export default Home
