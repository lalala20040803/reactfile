import React, { useState, useEffect } from 'react';
import './FileDropZone.css';
import validateFile from './fileValidation';

const FileDropZone = ({ onAddFiles }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({});
    const [uploadedFilesInfo, setUploadedFilesInfo] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        let timer;
        if (errorMessage) {
            timer = setTimeout(() => {
                setErrorMessage('');
            }, 3000);
        }
        return () => clearTimeout(timer);
    }, [errorMessage]);

    const handleDrop = (e) => {
        e.preventDefault();
        setIsHovered(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        handleFiles(droppedFiles);
    };

    const handleFiles = (newFiles) => {
        console.log('Received files:', newFiles);
        setErrorMessage('');

        if (!Array.isArray(newFiles)) {
            console.error('newFiles is not an array:', newFiles);
            return;
        }

        newFiles.forEach((file) => {
            const { isValid, errorMessage } = validateFile(file);
            if (isValid) {
                console.log('文件有效:', file);
                onAddFiles([file]);
                setUploadedFilesInfo((prev) => [...prev, { name: file.name, size: file.size }]);
                setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }));
                simulateUpload(file);
            } else {
                console.error('文件验证失败:', errorMessage);
                setErrorMessage(errorMessage);
                setTimeout(() => {
                    setErrorMessage('');
                }, 3000);
            }
        });
    };

    const simulateUpload = (file) => {
        const totalSteps = 100;
        let currentStep = 0;

        const interval = setInterval(() => {
            if (currentStep >= totalSteps) {
                clearInterval(interval);
                setUploadedFilesInfo((prev) => prev.filter(item => item.name !== file.name));
                setUploadProgress((prev) => {
                    const newProgress = { ...prev };
                    delete newProgress[file.name];
                    return newProgress;
                });
            } else {
                currentStep += 1;
                setUploadProgress((prev) => ({
                    ...prev,
                    [file.name]: currentStep
                }));
            }
        }, 100);
    };

    return (
        <div
            className={`drop-zone ${isHovered ? 'hovered' : ''}`}
            onDragOver={(e) => {
                e.preventDefault();
                setIsHovered(true);
            }}
            onDragLeave={() => setIsHovered(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input').click()}
        >
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <input
                id="file-input"
                type="file"
                multiple
                onChange={(e) => handleFiles(Array.from(e.target.files))}
                style={{ display: 'none' }}
            />
            <p>将文件拖至此处或点击上传</p>
            <div>
                {uploadedFilesInfo.map((fileInfo) => (
                    <div key={fileInfo.name}>
                        <p>{fileInfo.name} ({fileInfo.size} bytes)</p>
                        {uploadProgress[fileInfo.name] > 0 && uploadProgress[fileInfo.name] < 100 && (
                            <div className="progress-bar">
                                <div
                                    className="progress"
                                    style={{ width: `${uploadProgress[fileInfo.name]}%` }} // 使用模板字符串
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FileDropZone;
