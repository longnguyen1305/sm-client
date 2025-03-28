import React, { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import JSZip from 'jszip';
import ReactCodeMirror from '@uiw/react-codemirror';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { cpp } from '@codemirror/lang-cpp';
import FolderTree from 'react-folder-tree';
import styles from './index.module.css'

const Project = () => {

    // All chosen files
    const [files, setFiles] = useState([]);
    // File Tree Structure
    const [fileTree, setFileTree] = useState(null);
    // Selected file
    const [selectedFile, setSelectedFile] = useState(null);
    // Code of selected file
    const [code, setCode] = useState("");
    // Uploading progress
    const [progress, setProgress] = useState({ started: false, percent: 0 });
    // Notify upload status
    const [message, setMessage] = useState(null);

    const navigate = useNavigate();

    const handleNextPage = () => {
        navigate("/dashboard");
    }

    const handleFolderSelect = async (e) => {
        const fileList = e.target.files;
        const newFiles = [];
        const treeData = { name: "root", children: [], isFile: false, filePath: "root" };

        for (const file of fileList) {
            const relativePath = file.webkitRelativePath || file.name;
            const content = await file.text();
            newFiles.push({ key: relativePath, name: file.name, content })

            //Build folder tree structure
            const parts = relativePath.split("/");
            let current = treeData;
            parts.forEach((part, index) => {
                let existing = current.children.find(child => child.name === part);
                if (!existing) {
                    const checkFile = index === parts.length - 1;
                    existing = {
                        name: part,
                        isFile: checkFile,
                        filePath: index === parts.length - 1 ? relativePath : null,
                        ...(checkFile ? {} : { children: [] }) // only give children to folders
                    };
                    current.children.push(existing);
                }
                current = existing;
            });
        };
        setFiles(newFiles);
        setFileTree(treeData);
    };

    const handleFileSelect = ({ defaultOnClick, nodeData }) => {
        if(nodeData.isFile) {
            const file = files.find(f => f.key === nodeData.filePath);
            if (file) {
                setSelectedFile( { path: nodeData.filePath, name: nodeData.name });
                setCode(file.content || "");
            }
        }
    };

    const handleEditorChange = (value) => {
        if (selectedFile) {
            setFiles(prevFiles => prevFiles.map(file =>
                file.key === selectedFile.path ? {...file, content: value} : file
            ));
        }
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
        formData.append('zipfile', zipBlob, `${fileTree.children[0].name}.zip`);

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
            setMessage("Submit Successful");
            console.log(res.data);
        })
        .catch(err => {
            setMessage("Submit Failed");
            console.error(err);
        });
        
    }
    
    return (
        <Fragment>
            <div className={styles.container}>
                <button
                    className={styles.nextButton}
                    onClick={handleNextPage}
                >
                    Dashboard
                </button>

                <h1>Upload Project</h1>
                
                <div className={styles.controls}>
                    <input
                        type='file' 
                        directory="" 
                        webkitdirectory="" 
                        onChange={handleFolderSelect}
                    />
                    <button
                        className={styles.submitButton}
                        onClick={handleUpload}
                    >
                        Submit Project
                    </button>
                </div>
                
                { progress.started && (
                    <progress
                        max="100"
                        value={progress.percent}
                        className={styles.progress}
                    ></progress>
                )}
                <br/>
                { message && (
                    <span className={styles.message}>{ message }</span>
                )}

                {fileTree && (
                    <div className={styles.editorwrapper}>
                        <div className={styles.foldertree}>
                            <h3>Project</h3>
                            <FolderTree
                                data={fileTree.children[0]}
                                showCheckbox={false}
                                indentPixels={ 10 }
                                onNameClick={handleFileSelect}
                            />
                        </div>
                        <div className={styles.codewrapper}>
                            <ReactCodeMirror
                                value={code}
                                height="475px"
                                theme={dracula}
                                extensions={[cpp()]}
                                onChange={handleEditorChange}
                            />
                            {selectedFile &&
                                <h3>Editing: {selectedFile.name}</h3>
                            }
                        </div>
                    </div>
                )}

                
                    
            </div>
            
            
        </Fragment>
    );
}

export default Project;
