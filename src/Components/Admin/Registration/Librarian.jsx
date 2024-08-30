import React, { useState } from 'react';
import { Layout, message } from 'antd';

const { Content: AntdContent } = Layout;

const LibrarianRegistration = ({ borderRadiusLG }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = () => {
    // Validate password and confirmPassword
    if (password !== confirmPassword) {
      message.error('Passwords do not match');
      return;
    }

    // Proceed with signup
    // fetch('https://macts-backend-webapp-production-0bd2.up.railway.app/LibrarianSignUp', {
    fetch('https://macts-backend-webapp.onrender.com/LibrarianSignUp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
        email,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Signup response:', data);
        if (data.message === 'User signed up successfully') {
          // Show success message
          message.success('Account created successfully');
          // Clear input fields
          setUsername('');
          setPassword('');
          setConfirmPassword('');
          setEmail('');
        } else {
          // Handle other possible success responses or errors
          message.error('Error signing up');
        }
      })
      .catch(error => {
        console.error('Error signing up:', error);
        // Handle error
        message.error('Error signing up');
      });
  };

  return (
    <AntdContent
      style={{
        margin: '10px 16px',
        padding: 24,
        minHeight: 420,
        background: 'white',
        borderRadius: borderRadiusLG,
      }}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-2xl font-semibold mb-4">Librarian Registration</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirm Password"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="py-2 px-4 bg-transparent border border-gray-300 rounded-md text-gray-600 mt-2 mb-0 hover:bg-gray-100 hover:text-blue-500 focus:outline-none"
          >
            {showPassword ? (
              <span className="flex items-center">
                Hide Password
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M2.793 4.793a1 1 0 011.414 0L10 10.586l5.793-5.793a1 1 0 111.414 1.414l-7 7a1 1 0 01-1.414 0l-7-7a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M10 3a7 7 0 00-7 7c0 1.654.574 3.17 1.524 4.364l1.485-1.485A4.967 4.967 0 015 10a5 5 0 015-5c.78 0 1.52.182 2.17.505l1.485-1.485A6.972 6.972 0 0010 3zm7.677 2.293a1 1 0 011.414 1.414L15.414 10l3.677 3.677a1 1 0 01-1.414 1.414L14 11.414l-3.677 3.677a1 1 0 01-1.414-1.414L12.586 10l-3.677-3.677a1 1 0 011.414-1.414L14 8.586l3.677-3.677z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            ) : (
              <span className="flex items-center">
                Show Password
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm0-8a2 2 0 100 4 2 2 0 000-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            )}
          </button>
        </div>
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          onClick={handleSignup}
        >
          Sign Up
        </button>
      </div>
    </AntdContent>
  );
};

export default LibrarianRegistration;
