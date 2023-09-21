import React from 'react'
import ChatBot from '../components/ChatBot'
import TextField from '@mui/material/TextField';
import { useAuthContext } from '../hooks/useAuthContext';
import { useState } from 'react';

const Settings = () =>{
  const { user } = useAuthContext();
  const [result, setresult] = useState("")
  const [loading, setloading] = useState("")

  return (
    <div className='settings-wrapper' style={{
      display:"flex", alignContent:"center", alignItems:"center", justifyContent:"center"
    }}>
    <div className='settingsContainer' style={{
      width:"40vw", height:"70vh", backgroundColor:"white", margin:"30px", borderRadius:"30px"
    }}>
    <div className='settingsContent' style={{padding:"30px"}}>
      <h2>Settings</h2>
      <hr></hr>
      <div className='content-inner' style={{margin:"10px", display:"flex", flexDirection:"column"
      , width:"80%"}}>
      <div style={{display:"flex", flexDirection:"row", justifyContent:"flex-start", alignItems:"baseline", alignContent:"center"}}>
      <h6>Batch Email:</h6>
      <div style={{width:"30px"}}></div>
      <TextField id="standard-basic" label="Set mail" variant="standard" />
      <button style={{border:"none", backgroundColor:"white"}}>
      <h5>📧</h5>
      </button>
      </div>
      
      <br></br>
      <button onClick={async()=>{
        try{
          setloading("Setting...")
              const url = 'http://localhost:4000/data/all'
              const authString = "Bearer " + user.token;
              const response = await fetch(url, {
                headers: {
                  Authorization: authString,
              },
              method: "GET",
              });
              
              const data = await response.text();
              setloading("")
              console.log(data)
              setresult(data)
              setTimeout(() => {
                setresult("");
              }, 4000);
          }catch(error){
            console.error('Error:', error);
          }
      }} style={{backgroundColor:"red", border:"none", 
      padding:"5px", color:"white", borderRadius:"10px", width:"150px"}}>
        Refresh Data
      </button>
      <p>{loading}</p>
      <p style={{color:"green"}}>{result}</p>
      </div>
    </div>
      <ChatBot /> 
    </div>
    </div>
  )
}
export default Settings
