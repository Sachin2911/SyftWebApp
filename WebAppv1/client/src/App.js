import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'
import 'bootstrap/dist/css/bootstrap.min.css';
// pages & components
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Navbar from './components/Navbar'
import Kpi from './pages/Kpi'
import Settings from './pages/Settings'
import Management from './pages/Management';
import Analytics from './pages/Analytics'

function App() {
  const { user } = useAuthContext()

  return (
    <div className="App" style={{backgroundColor:"#F1F1F1"}}>
      <BrowserRouter>
        <Navbar />
        <div className="pages" >
          <Routes>
            <Route 
              path="/"
              element={user ? <Home />:<Navigate to="/login"/>}
            />
            <Route 
              path="/login" 
              element={!user ? <Login />: <Navigate to="/"/>} 
            />
            <Route 
              path="/signup" 
              element={!user ? <Signup />: <Navigate to="/"/>} 
            />
             <Route 
              path="/prediction"
              element={user ? <Kpi />:<Navigate to="/login"/>}
            />
            <Route 
              path="/analytics"
              element={user ? <Analytics />:<Navigate to="/login"/>}
            />
            <Route 
              path="/inventory"
              element={user ? <Management />:<Navigate to="/login"/>}
            />
            <Route 
              path="/settings"
              element={user ? <Settings />:<Navigate to="/login"/>}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
