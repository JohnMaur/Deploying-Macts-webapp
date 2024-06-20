import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

function FacultyLogin() {
  const [facultyUser, setFacultyUser] = useState('');
  const [facultyPass, setFacultyPass] = useState('');
  const { isLoggedIn, login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      // handle redirection based on user type if needed
    }
  }, [isLoggedIn, navigate]);

  const facultyLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:2526/faculty', {
        faculty_user: facultyUser,
        faculty_pass: facultyPass,
      });
      if (response.status === 200) {
        const { userType, userId, token } = response.data;
        login(token, userType);
        if (userType === 'teacher') {
          navigate(`/dashboard/Teacher/${userId}`);
        } else if (userType === 'librarian') {
          navigate(`/dashboard/Library`);
        } else if (userType === 'gym') {
          navigate(`/dashboard/Gym`);
        } else if (userType === 'guard') {
          navigate(`/dashboard/Gatepass`);
        } else if (userType === 'registrar') {
          navigate(`/dashboard/Registrar`);
        }
      } else {
        alert('Invalid username or password');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('Invalid username or password');
      } else {
        console.error('Error logging in:', error);
      }
    }
  };

  return (
    <div className="main-container">
      <div className="wrapper">
        <div className="title-text">
          <div className="title">Login</div>
        </div>

        <div className='form-container'>

          <div className="slide-controls">
            <input type="radio" name="slide" id="login"/>
            <input type="radio" name="slide" id="signup" />
            <label htmlFor="login" className="slide login">MACTs</label>
            <label htmlFor="signup" className="slide signup">Faculty</label>
            <div className="slider-tab"></div>
          </div>

          <div className="form-inner">
            <form onSubmit={facultyLogin} className="signup">
              <div className="field">
                <input
                  type="text"
                  placeholder="Username"
                  value={facultyUser}
                  onChange={(e) => setFacultyUser(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <input
                  type="password"
                  placeholder="Password"
                  value={facultyPass}
                  onChange={(e) => setFacultyPass(e.target.value)}
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

export default FacultyLogin;
