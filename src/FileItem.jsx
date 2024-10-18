import React, { useEffect } from 'react';
import ProgressBar from './ProgressBar'; // 引入 ProgressBar

const FileItem = ({ file, onDelete, onCancel, uploadProgress }) => {
    const { name, size, type } = file;
    const isImage = type.startsWith('image/');
    const previewUrl = isImage ? URL.createObjectURL(file) : null;

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl); // 释放创建的URL
            }
        };
    }, [previewUrl]);

    return (
        <div className="file-item">
            {isImage && previewUrl ? (
                <img src={previewUrl} alt={name} className="file-preview" />
            ) : (
                <div className="file-info">
                    <p>{name}</p>
                    <p>{size} bytes</p>
                </div>
            )}
        
            {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="upload-status">
                    <ProgressBar progress={uploadProgress} /> 
                </div>
            )}
            <div className="file-actions">
                {uploadProgress < 100 && (
                    <button onClick={(e) => { e.stopPropagation(); onCancel(file); }}>
                        取消上传
                    </button>
                )}
                <button onClick={(e) => { e.stopPropagation(); onDelete(file); }}>
                    删除
                </button>
            </div>
        </div>
    );
};

export default FileItem;
