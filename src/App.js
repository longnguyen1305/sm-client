import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Projects from './pages/primary/Projects';
import LoginRegister from './pages/loginRegister/LoginRegister';
import Upload from './pages/primary/Upload';
import Details from './pages/primary/Details';

function App() {
  const API = process.env.REACT_APP_API_URL;

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const setAuth = (authStatus) => {
    setIsAuthenticated(authStatus);
  }

  const isAuth = useCallback( async () => {
    try {
      const response = await fetch(`${API}/auth/is-verify`, {
        method: "GET",
        headers: {token: localStorage.token}
      });

      const parseResponse = await response.json()
      parseResponse === true ? setIsAuthenticated(true) : setIsAuthenticated(false);

    } catch (err) {
      console.error(err.message);
    }
  }, [API]);

  useEffect(() => {
    isAuth();
  },[isAuth]);

  return (
    <Fragment>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login-register"/>} />
          <Route
            path='/login-register'
            element={
              !isAuthenticated ? (
                <LoginRegister setAuth={setAuth} API={API}/>
              ) : (
                <Navigate to='/project'/>
              )
            }
          />
          <Route
            path='/project'
            element={
              isAuthenticated ? (
                <Upload API={API}/>
              ) : (
                <Navigate to='/login-register'/>
              )
            }
          />
          <Route
            path='/dashboard'
            element={
              isAuthenticated ? (
                <Projects setAuth={setAuth} API={API}/>
              ) : (
                <Navigate to='/login-register'/>
              )
            }
          />
          <Route
            path="/dashboard/projects/:projectId"
            element={
              isAuthenticated ? (
                <Details API={API}/>
              ) : (
                <Navigate to="/login-register"/>
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
