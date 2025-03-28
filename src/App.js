import React, { Fragment, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Projects from './pages/Projects';
import Login from './components/loginRegister/Login';
import Register from './components/loginRegister/Register';
import Upload from './pages/Upload';
import Details from './pages/Details';

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
        <Routes>
          <Route path="/" element={<Navigate to="/login"/>} />
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
                <Upload/>
              ) : (
                <Navigate to='/login'/>
              )
            }
          />
          <Route
            path='/dashboard'
            element={
              isAuthenticated ? (
                <Projects setAuth={setAuth}/>
              ) : (
                <Navigate to='/login'/>
              )
            }
          />
          <Route
            path="/dashboard/projects/:projectId"
            element={
              isAuthenticated ? (
                <Details/>
              ) : (
                <Navigate to="/login"/>
              )
            }
          />
        </Routes>
        <ToastContainer/>
      </Router>
    </Fragment>
  );
}

export default App;
