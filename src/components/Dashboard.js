import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import styles from './index.module.css'

const Dashboard = ({ setAuth, API }) => {

    const [name, setName] = useState("");
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();

    const handleNextPage = () => {
        navigate("/project");
    }

    const getName = useCallback(async () => {
        try {
            const response = await axios.get(`${API}/dashboard/`, {
                headers: { token: localStorage.token }
            });

            setName(response.data.user_name);

        } catch (err) {
            console.error("Error fetching user name:", err.message);
        }
    }, [API]);

    const getProjects = useCallback(async () => {
        try {
            const response = await axios.get(`${API}/dashboard/projects`, {
                headers: { token: localStorage.token }
            });

            setProjects(response.data.projects);

        } catch (err) {
            console.error("Error fetching projects:", err.message);
        }
    }, [API])

    const logout = (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        setAuth(false);
        toast.success("Logged out successfully!");
    }

    useEffect(() => {
        getName();
        getProjects();
    },[getName, getProjects]);

    const handleProjectClick = (project) => {
        navigate(`/dashboard/projects/${project.project_id}`, { state: { project } });
    };

    return (
        <Fragment>
            <div className={styles.container}>
                <button
                    className={styles.nextButton}
                    onClick={handleNextPage}
                >
                    Upload Project
                </button>

                <h1>Dashboard</h1>
                <h2>Welcome, {name}</h2>
                <br/>

                <h3>Your Projects:</h3>
                { projects.length > 0 ? (
                    <ul className={styles.projectList}>
                        {projects.map((project) => (
                            <li key={project.project_id} className={styles.projectItem}>
                                <button
                                    className={styles.projectButton}
                                    onClick={() => handleProjectClick(project)}
                                >
                                    {project.project_createtime} / {project.project_name} / {project.project_status}
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className={styles.noProjectMessage}>No projects submitted yet.</p>
                )}

                <button className={styles.logoutButton} onClick={logout}>
                    Logout
                </button>
            </div>
        </Fragment>
    );
}

export default Dashboard;
