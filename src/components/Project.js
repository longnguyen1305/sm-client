import React, { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import JSZip from 'jszip';
import ReactCodeMirror from '@uiw/react-codemirror';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { cpp } from '@codemirror/lang-cpp';
import { Tree } from 'react-arborist';
import styles from './index.module.css'

const Project = ({ API }) => {

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
    // Modified code of selected file
    const [editedFiles, setEditedFiles] = useState({});

    const navigate = useNavigate();

    const handleNextPage = () => {
        navigate("/dashboard");
    }

    const handleFolderSelect = async (e) => {
        const fileList = e.target.files;
        const newFiles = [];
        const treeData = { id: "root", name: "root", children: [], isFile: false, filePath: "root" };

        for (const file of fileList) {
            const relativePath = file.webkitRelativePath || file.name;
            newFiles.push({ key: relativePath, name: file.name, file })

            //Build folder tree structure
            const parts = relativePath.split("/");
            let current = treeData;
            parts.forEach((part, index) => {
                let existing = current.children.find(child => child.name === part);
                if (!existing) {
                    const checkFile = index === parts.length - 1;
                    existing = {
                        id: current.id + "/" + part,
                        name: part,
                        isFile: checkFile,
                        filePath: checkFile ? relativePath : null,
                        ...(checkFile ? {} : { children: [] }) // only give children to folders
                    };
                    current.children.push(existing);
                }
                current = existing;
            });
        };
        setFiles(newFiles);
        setFileTree(treeData);
        setMessage(null);
    };

    const handleFileSelect = async ({ node }) => {
        const nodeData = node.data;
        if(nodeData.isFile) {
            const file = files.find(f => f.key === nodeData.filePath);
            if (file) {
                let content = editedFiles[file.key]; // check edited first
                if (!content) {
                    content = await file.file.text(); // fallback to original
                }
                setSelectedFile( { path: nodeData.filePath, name: nodeData.name });
                setCode(content || "");
            }
        }
    };

    const handleEditorChange = (value) => {
        if (selectedFile) {
            setEditedFiles(prev => ({
                ...prev,
                [selectedFile.path]: value
            }));
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
        files.forEach(({ key, file }) => {
            if (editedFiles[key]) {
                zip.file(key, editedFiles[key]); // use edited content
            } else {
                zip.file(key, file); // use original file
            }
        });
        const zipBlob = await zip.generateAsync({ type:"blob"});

        const formData = new FormData();
        formData.append('zipfile', zipBlob, `${fileTree.children[0].name}.zip`);

        setMessage("Uploading...");
        setProgress(prevState => {
            return {...prevState, started: true}
        });

        axios.post(`${API}/project/upload`, formData, {
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
            <div className={styles.logoBar}>
                <img src="/logo.png" alt="Logo" className={styles.logo} />
            </div>
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
                            <Tree
                                data={fileTree.children}
                                openByDefault={true}
                                height={ 440 }
                                width={'100%'}
                                indent={10}
                                onSelect={(nodes) => {
                                    if (nodes.length > 0) {
                                        handleFileSelect({ node: nodes[0] });
                                    }
                                }}
                            />
                        </div>
                        <div className={styles.codewrapper}>
                            <ReactCodeMirror
                                value={code}
                                height="450px"
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
