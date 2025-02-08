import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Project = () => {

    // File uploaded
    const [file, setFile] = useState(null);
    // Uploading progress
    const [progress, setProgress] = useState({ started: false, percent: 0 });
    // Notify upload status
    const [message, setMessage] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    }

    const handleUpload = (e) => {
        e.preventDefault();

        if (!file) {
            setMessage("No file selected");
            setProgress(prevState => {
                return {...prevState, started: false, percent: 0}
            });
        } else {
            const formData = new FormData();
            formData.append('zipfile', file);

            setMessage("Uploading...");
            setProgress(prevState => {
                return {...prevState, started: true}
            });

            axios.post("http://localhost:5000/project/upload", formData, {
                onUploadProgress: (ProgressEvent) => { setProgress(prevState => {
                    return {...prevState, percent: ProgressEvent.progress*100}
                }) },
                headers: {token: localStorage.token}
            })
            .then(res => {
                setMessage("Upload Successful");
                console.log(res.data);
            })
            .catch(err => {
                setMessage("Upload Failed");
                console.error(err);
            });
        }
    }
    
    return (
        <Fragment>
            <h1 className='text-center my-5'>Upload Project</h1>
            <Link to="/dashboard">Dashboard</Link>

            <div>
                <input type='file' accept='.zip' onChange={handleFileChange}/>
                <button className="btn btn-primary" onClick={handleUpload}>Upload</button>
                <br/>
                { progress.started && <progress max="100" value={progress.percent}></progress> }
                <br/>
                { message && <span>{ message }</span> }
            </div>
            
        </Fragment>
    );
}

export default Project;
