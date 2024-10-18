import React, { useState } from 'react';
import FileDropZone from './FileDropZone';
import './App.css';
import FileItem from './FileItem';

const App = () => {
    const [files, setFiles] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState({});
    const [previewImages, setPreviewImages] = useState([]);
    const [showPreview, setShowPreview] = useState(false);

    const createPreview = (file) => {
        const fileTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (fileTypes.includes(file.type)) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const previewUrl = event.target.result;
                setPreviewImages((prev) => [...prev, previewUrl]);
                file.previewUrl = previewUrl;
            };
            reader.readAsDataURL(file);
        } else {
            console.log(`不支持的文件类型: ${file.type}`);
        }
    };

    const handleAddFiles = (newFiles) => {
        if (!Array.isArray(newFiles)) {
            console.error('期望 newFiles 是一个数组:', newFiles);
            return;
        }
        
        newFiles.forEach(file => {
            if (!uploadedFiles.some(uploadedFile => uploadedFile.name === file.name)) {
                setUploadedFiles(prev => [...prev, file]); // 始终添加文件到已上传列表
                
                const fileTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
                if (fileTypes.includes(file.type)) {
                    setFiles(prevFiles => [...prevFiles, file]); // 仅支持的文件添加到文件列表
                    createPreview(file);
                    simulateUpload(file); // 启动模拟上传
                } else {
                    console.log(`不支持的文件类型: ${file.type}`);
                }
            } else {
                console.log(`文件已上传: ${file.name}`);
            }
        });
    };
    

    const handleDeleteFile = (file) => {
        setUploadedFiles((prevFiles) => prevFiles.filter((f) => f !== file));
        setPreviewImages((prevImages) => prevImages.filter((src) => src !== file.previewUrl));
    };

    const handleCancelUpload = (file) => {
        const updatedProgress = { ...uploadProgress };
        delete updatedProgress[file.name];
        setUploadProgress(updatedProgress);
        console.log(`上传已取消: ${file.name}`);
    };

    const simulateUpload = (file) => {
        const interval = setInterval(() => {
            setUploadProgress((prev) => {
                const currentProgress = prev[file.name] || 0;
                if (currentProgress >= 100) {
                    clearInterval(interval);
                    setFiles((prevFiles) => prevFiles.filter((f) => f !== file));
                    return { ...prev, [file.name]: null };
                }
                return { ...prev, [file.name]: currentProgress + 10 };
            });
        }, 100);
    };

    return (
        <div className="app-container">
            <h1>文件拖拽上传</h1>
            <FileDropZone 
                onAddFiles={handleAddFiles} 
                onDeleteFile={handleDeleteFile}
                files={files} 
            />
            <h2>已上传文件列表</h2>
            <ul>
                {uploadedFiles.map((file, index) => (
                    <FileItem 
                        key={index} 
                        file={file} 
                        onDelete={handleDeleteFile} 
                        onCancel={handleCancelUpload} 
                        uploadProgress={uploadProgress[file.name] || 0}
                    />
                ))}
            </ul>

            {uploadedFiles.some(file => ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) && (
                <button onClick={() => setShowPreview(!showPreview)}>
                    {showPreview ? '隐藏预览' : '文件预览'}
                </button>
            )}

            {showPreview && (
                <div className="preview-container">
                    {previewImages.map((src, index) => (
                        <img key={index} src={src} alt={`预览 ${index}`} className="preview-image" />
                    ))}
                </div>
            )}
        </div>
    );
};

export default App;
