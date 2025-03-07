import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

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

    const handleDownload = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.get("http://localhost:5000/dashboard/project", {
                responseType: 'blob',
                headers: {token: localStorage.token}
            })

            // Create blob link to download
            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'optimized.zip');
            
            // Append to html link element page
            document.body.appendChild(link);
            // Start download
            link.click();
            // Clean up and remove the link
            link.parentNode.removeChild(link);

        } catch (err) {
            console.error(err.message);
        }
        
    }

    return (
        <Fragment>
            <h1>Dashboard {name}</h1>
            <Link to="/project">Project</Link>
            
            <div>
                <button className="btn btn-primary" onClick={logout}>
                    Logout
                </button>
                <button className="btn btn-primary" onClick={handleDownload}>
                    Download Optimized Project
                </button>
            </div>
        </Fragment>
    );
}

export default Dashboard;
