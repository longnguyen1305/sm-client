import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styles from './index.module.css'

const Result = () => {
    const { projectId } = useParams();
    const [metrics, setMetrics] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const project = location.state.project;

    const handleDownload = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.get(`http://localhost:5000/dashboard/projects/${projectId}`, {
                responseType: 'blob',
                headers: {token: localStorage.token}
            })

            // Create blob link to download
            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${project.project_name}_optimized.zip`);
            
            // Append to html link element page
            document.body.appendChild(link);
            // Start download
            link.click();
            // Clean up and remove the link
            link.parentNode.removeChild(link);

        } catch (err) {
            console.error("Error downloading project:", err.message);
        }
        
    }

    const getMetrics = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:5000/dashboard/metrics/${projectId}`, {
                headers: { token: localStorage.token }
            });
            setMetrics(response.data.metrics);
        } catch (err) {
            console.error("Error fetching metrics:", err.message);
        }
    }, [projectId]);

    useEffect(() => {
        getMetrics();
    }, [getMetrics]);

    return (
        <Fragment>
            <div className={styles.container}>
                <button
                    className={styles.backButton}
                    onClick={() => navigate("/dashboard")}
                >
                    Back to Dashboard
                </button>

                <h2 className={styles.projecttitle}>Project: {project.project_name}</h2>
                <p className={styles.projectinfo}>Status: {project.project_status}</p>
                <p className={styles.projectinfo}>Created At: {project.project_createtime}</p>

                <button
                    className={styles.submitButton}
                    onClick={handleDownload}
                >
                    Download Project
                </button>
                
                <h3 className={styles.projecttitle}>Metrics:</h3>
                {metrics.length === 0 ? (
                    <p className={styles.noProjectMessage}>No metrics available.</p>
                ) : (
                    <div className={styles.metricswrapper}>
                        {metrics.map((metric) => (
                            <div key={metric.metric_name} className={styles.metricItem}>
                                <h4>{metric.metric_name}</h4>
                                <img
                                    src={metric.metric_url}
                                    alt={metric.metric_name}
                                    className={styles.metricImage}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Fragment>
    )
}

export default Result;