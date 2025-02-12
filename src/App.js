import React, { Fragment, useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import Project from './components/Project';

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const setAuth = (authStatus) => {
    setIsAuthenticated(authStatus);
  }

  async function isAuth() {
    try {
      const response = await fetch("http://localhost:5000/auth/is-verify", {
        method: "GET",
        headers: {token: localStorage.token}
      });

      const parseResponse = await response.json()
      parseResponse === true ? setIsAuthenticated(true) : setIsAuthenticated(false);

    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    isAuth();
  },[]);

  return (
    <Fragment>
      <Router>
        <div className='container'>
          <Routes>
            <Route
              path='/login'
              element={
                !isAuthenticated ? (
                  <Login setAuth={setAuth}/>
                ) : (
                  <Navigate to='/project'/>
                )
              }
            />
            <Route
              path='/register'
              element={
                !isAuthenticated ? (
                  <Register setAuth={setAuth}/>
                ) : (
                  <Navigate to='/login'/>
                )
              }
            />
            <Route
              path='/project'
              element={
                isAuthenticated ? (
                  <Project setAuth={setAuth}/>
                ) : (
                  <Navigate to='/login'/>
                )
              }
            />
            <Route
              path='/dashboard'
              element={
                isAuthenticated ? (
                  <Dashboard setAuth={setAuth}/>
                ) : (
                  <Navigate to='/login'/>
                )
              }
            />
          </Routes>
          <ToastContainer/>
        </div>
      </Router>
    </Fragment>
  );
}

export default App;
