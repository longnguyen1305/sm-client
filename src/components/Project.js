import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import JSZip from 'jszip';
import ReactCodeMirror from '@uiw/react-codemirror';
import { dracula } from '@uiw/codemirror-theme-dracula';

const Project = () => {

    // All chosen files
    const [files, setFiles] = useState([]);
    // Selected file
    const [selectedFile, setSelectedFile] = useState(null);
    // Code of selected file
    const [code, setCode] = useState("");
    // Uploading progress
    const [progress, setProgress] = useState({ started: false, percent: 0 });
    // Notify upload status
    const [message, setMessage] = useState(null);

    const handleFolderSelect = async (e) => {
        const fileList = e.target.files;
        const newFiles = [];

        for (const file of fileList) {
            const relativePath = file.webkitRelativePath || file.name;
            const content = await file.text();
            newFiles.push({ key: relativePath, name: file.name, content })
        };
        setFiles(newFiles);
    };

    const handleFileSelect = (fileKey) => {
        const file = files.find(f => f.key === fileKey);
        if (file) {
            setSelectedFile(fileKey);
            setCode(file.content || "");
        }
    };

    const handleEditorChange = (value) => {
        setFiles(prevFiles => prevFiles.map(file =>
            file.key === selectedFile ? {...file, content: value} : file
        ));
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (files.length === 0) {
            setMessage("No file selected");
            setProgress(prevState => {
                return {...prevState, started: false, percent: 0}
            });
            return;
        }

        const zip = new JSZip();
        files.forEach(({ key, content }) => {
            zip.file(key, content);
        });
        const zipBlob = await zip.generateAsync({ type:"blob"});

        const formData = new FormData();
        formData.append('zipfile', zipBlob, "project.zip");

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
    
    return (
        <Fragment>
            <h1 className='text-center my-5'>Upload Project</h1>
            <Link to="/dashboard">Dashboard</Link>

            <div>
                <input type='file' directory="" webkitdirectory="" onChange={handleFolderSelect}/>
                <button className="btn btn-primary" onClick={handleUpload}>Upload</button>
                <br/>
                { progress.started && <progress max="100" value={progress.percent}></progress> }
                <br/>
                { message && <span>{ message }</span> }
            </div>

            <div>
                <div>
                    <h3>Files</h3>
                    <ul>
                        {files.map(({ key, name }) => (
                            <li
                                key={key}
                                className="p-2 cursor-pointer bg-gray-800 hover:bg-gray-600"
                                onClick={() => handleFileSelect(key)}
                            >
                                📄 {name}
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    {selectedFile && (
                        <div className='p-4'>
                            <h3>Editing: {selectedFile}</h3>
                            <ReactCodeMirror
                                value={code}
                                height="400px"
                                theme={dracula}
                                onChange={handleEditorChange}
                            />
                        </div>
                    )}
                </div>
            </div>
            
        </Fragment>
    );
}

export default Project;
