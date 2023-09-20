import React from 'react'
import ChatBot from '../components/ChatBot'

function Settings() {
  const handleRefresh = ()=>{

  }

  return (
    <div className='dashboardContainer'>
      <button onClick={handleRefresh} style={{backgroundColor:"red"}}>
        Refresh Data
      </button>
      <ChatBot /> 
    </div>
  )
}
export default Settings
