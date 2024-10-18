const validTypes = [
    'image/jpeg', 
    'image/png',
    'application/pdf',    // PDF 文件
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX 文件
    'text/plain',         // TXT 文件
    'application/msword' // DOC 文件
];  // 支持的文件类型
const maxSize = 2 * 1024 * 1024; // 最大文件大小：10MB

/**
 * 验证文件的类型和大小
 * @param {File} file - 需要验证的文件
 * @returns {Object} - 包含验证结果和错误信息
 */
const validateFile = (file) => {
    let errorMessage = '';

    // 检查文件类型
    if (!validTypes.includes(file.type)) {
        errorMessage = '不支持的文件类型！';
    }

    // 检查文件大小
    if (file.size > maxSize) {
        errorMessage = '文件过大，请选择小于10MB的文件。';
    }

    return {
        isValid: !errorMessage, // 如果没有错误信息，则有效
        errorMessage,
    };
};

export default validateFile;
