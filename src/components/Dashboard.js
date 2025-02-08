import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Dashboard = ({ setAuth }) => {

    const [name, setName] = useState("");

    async function getName() {
        try {
            const response = await fetch("http://localhost:5000/dashboard/", {
                method: "GET",
                headers: {token: localStorage.token}
            });

            const parseResponse = await response.json();
            setName(parseResponse.user_name);

        } catch (err) {
            console.error(err.message);
        }
    }

    const logout = (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        setAuth(false);
        toast.success("Logged out successfully!");
    }

    useEffect(() => {
        getName();
    },[]);

    return (
        <Fragment>
            <h1>Dashboard {name}</h1>
            <Link to="/project">Project</Link>
            
            <div>
                <button className="btn btn-primary" onClick={logout}>Logout</button>
            </div>
        </Fragment>
    );
}

export default Dashboard;
