import { useState } from "react"
import { useLoginIn } from "../hooks/useLogin"
import { FlexBetween } from "../components/ChartElements"

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const {login, isLoading, error} = useLoginIn();

  const handleSubmit = async (e) => {
    e.preventDefault()
    await login(email, password)
  }

  return (
    <div>
    <form className="login" onSubmit={handleSubmit}>
      <h3>Log In</h3>
      
      <label>Email address:</label>
      <input 
        type="email" 
        onChange={(e) => setEmail(e.target.value)} 
        value={email} 
      />
      <label>Password:</label>
      <input 
        type="password" 
        onChange={(e) => setPassword(e.target.value)} 
        value={password} 
      />
      <br></br>
      <button disabled={isLoading}>Log in</button>
      {error && <div className="error">{error}</div>}
    </form>
    <div style={{height:"41vh"}}></div>
    </div>
  )
}

export default Login