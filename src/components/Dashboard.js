import React, { Fragment, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Dashboard = ({ setAuth }) => {

    const [name, setName] = useState("");
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();

    async function getName() {
        try {
            const response = await axios.get("http://localhost:5000/dashboard/", {
                headers: { token: localStorage.token }
            });

            setName(response.data.user_name);

        } catch (err) {
            console.error("Error fetching user name:", err.message);
        }
    }

    async function getProjects() {
        try {
            const response = await axios.get("http://localhost:5000/dashboard/projects", {
                headers: { token: localStorage.token }
            });

            setProjects(response.data.projects);

        } catch (err) {
            console.error("Error fetching projects:", err.message);
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
        getProjects();
    },[]);

    const handleProjectClick = (project) => {
        navigate(`/dashboard/projects/${project.project_id}`, { state: { project } });
    };

    return (
        <Fragment>
            <h1>Dashboard - Welcome, {name}</h1>
            <Link to="/project">Upload New Project</Link>
            
            <div>
                <button className="btn btn-primary" onClick={logout}>
                    Logout
                </button>
            </div>
            
            <h2>Your Projects</h2>
            <ul>
                {projects.map((project) => (
                    <li key={project.project_id}>
                        <button onClick={() => handleProjectClick(project)}>
                            {project.project_name} ({project.project_status})
                        </button>
                    </li>
                ))}
            </ul>
        </Fragment>
    );
}

export default Dashboard;
