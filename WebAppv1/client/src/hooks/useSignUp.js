import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useSignUp = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const {dispatch} = useAuthContext()

    const signup = async (email, password) =>{
        setIsLoading(true)
        setError(null) //We need to set it to null every time because otherwise if we make subsequent requests the previos error will be there
        
        const response = await fetch('http://localhost:4000/user/signup',{
            method:"POST",
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({email, password})
        }) //we already set the proxy in package.json to 4000
        const json = await response.json()

        if(!response.ok){
            setIsLoading(false)
            setError(json.error)
        }
        if(response.ok){
            // save the user to local storage
            localStorage.setItem('user', JSON.stringify(json))

            //update the authContext
            dispatch({type:'LOGIN', payload: json})
            setIsLoading(false)
        }
    }
    return {signup, isLoading, error}
} 
