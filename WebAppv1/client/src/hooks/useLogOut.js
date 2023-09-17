import { useAuthContext } from "./useAuthContext"

export const useLogout = () =>{
    const {dispatch} = useAuthContext()

    const logout = ()=>{
        // We don't have to send a request to the server to logout, instead we can just remove the token and the global state
        //remove user from storage
        localStorage.removeItem('user')

        //dispacth logout action
        dispatch({type:'LOGOUT'})
    }
    return {logout}
}