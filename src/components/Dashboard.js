import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Dashboard = ({ setAuth }) => {

    const [name, setName] = useState("");
    const [images, setImages] = useState([]);
    const [showGallery, setShowGallery] = useState(false);

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

    const openGallery = () => {
        setShowGallery(true);
        getImages();
    }

    const closeGallery = () => {
        setShowGallery(false);
    }

    async function getImages() {
        try {
            const response = await axios.get("http://localhost:5000/dashboard/metrics", {
                headers: {token: localStorage.token}
            })
            setImages(response.data.images);
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
                <button className="btn btn-primary" onClick={openGallery}>
                    View Images
                </button>
                <button className="btn btn-primary" onClick={handleDownload}>
                    Download Optimized Project
                </button>
            </div>
            
            {showGallery && (
                <div>
                    <div>
                        <h2>Metric Images</h2>
                        <button className="btn btn-primary" onClick={closeGallery}>
                            Close Images
                        </button>

                        <div>
                            {images.map((img, index) => (
                                <div key={index}>
                                    <img
                                        src={`http://localhost:5000/dashboard${img.url}`}
                                        alt={img.name}
                                    />
                                    <p>{img.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </Fragment>
    );
}

export default Dashboard;
