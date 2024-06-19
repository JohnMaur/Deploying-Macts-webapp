// AdminLogin.jsx
import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import '../Stylesheet/login.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

function AdminLogin() {
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const { isLoggedIn, login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard');
    }
  }, [isLoggedIn, navigate]);

  const adminLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:2526/admin', {
        admin_username: adminUsername,
        admin_password: adminPassword,
      });
      if (response.status === 200) {
        const { token } = response.data;
        login(token); // Use the login function from AuthContext
      } else {
        alert('Invalid username or password');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Error logging in. Please try again.');
    }
  };

  return (
    <div className="main-container">
      <div className="wrapper">
        <div className="title-text">
          <div className="title">Login</div>
        </div>

        <div className='form-container'>

          <div class="slide-controls">
            <input type="radio" name="slide" id="login"/>
            <input type="radio" name="slide" id="signup" />
            <label for="login" class="slide login">MACTs</label>
            <label for="signup" class="slide signup">Admin</label>
            <div class="slider-tab"></div>
          </div>

        <div className="form-inner">
          <form onSubmit={adminLogin} className="login">
            <div className="field">
              <input
                type="text"
                placeholder="Username"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <input
                type="password"
                placeholder="Password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
              />
            </div>
            <div className="pass-link">
              <a href="#">Forgot password?</a>
            </div>
            <div className="field btn">
              <div className="btn-layer"></div>
              <input type="submit" value="Login" />
            </div>
            <div className="signup-link">
              Developed by <span className="name-span">@johnmaur8</span>
            </div>
          </form>
        </div>

        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
