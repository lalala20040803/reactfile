import React from 'react';
import './ProgressBar.css'; // 样式文件

const ProgressBar = ({ progress }) => {
    // 确保 progress 在 0 到 100 之间
    const validProgress = Math.max(0, Math.min(100, progress));

    return (
        <div className="progress-bar-container">
            <div
                className="progress-bar"
                style={{ width: `${validProgress}%` }}
            />
            <span className="progress-text">{validProgress}%</span>
        </div>
    );
};

export default ProgressBar;

