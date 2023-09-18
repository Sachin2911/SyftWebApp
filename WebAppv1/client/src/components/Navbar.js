import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogOut';
import { useAuthContext } from '../hooks/useAuthContext';
import './Navbar.css';
import Sidebar from './Sidebar';


const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useLogout();
  const { user } = useAuthContext();

  const handleClick = () => {
    logout();
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <header>
      <div className="container">
      <Sidebar/>
        <Link to="/">
          <h1>Jodi's CupCakes 🧁</h1>
        </Link>
        <nav>
          {user && (
            <div>
              <span>{user && user.email}</span>
              <button onClick={handleClick}>Log out</button>
            </div>
          )}
          {!user && (
            <div>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </div>
          )}
          
        </nav>
      </div>

      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className='nav_routes'>
          <h3><Link to="/">Home</Link></h3>
          <h3><Link to="/inventory">Inventory</Link></h3>
          <h3><Link to="/invoices">Invoices</Link></h3>
          <h3><Link to="/payments">Payments</Link></h3>
          <h3><Link to="/settings">Settings</Link></h3>
          </div>
      </div>

    </header>
  );
};

export default Navbar;
