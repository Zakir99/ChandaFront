import React, { useState, useRef } from 'react';

const FileInput = ({
  name,
  value,
  onChange,
  accept,
  multiple = false,
  disabled = false,
  required = false,
  placeholder = "Choose files",
  maxSize, // in bytes
  allowedExtensions, // array of extensions e.g., ['.jpg', '.png']
  onError, // error callback
  className = ""
}) => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const validateFile = (file) => {
    // Check size
    if (maxSize && file.size > maxSize) {
      return `File "${file.name}" exceeds maximum size of ${formatBytes(maxSize)}`;
    }
    
    // Check extension
    if (allowedExtensions) {
      const extension = '.' + file.name.split('.').pop().toLowerCase();
      if (!allowedExtensions.includes(extension)) {
        return `File "${file.name}" has invalid extension. Allowed: ${allowedExtensions.join(', ')}`;
      }
    }
    
    return null;
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setError(null);
    
    // Validate files
    const errors = [];
    const validFiles = [];
    
    selectedFiles.forEach(file => {
      const validationError = validateFile(file);
      if (validationError) {
        errors.push(validationError);
      } else {
        validFiles.push(file);
      }
    });
    
    if (errors.length > 0) {
      setError(errors[0]);
      if (onError) onError(errors);
      return;
    }
    
    setFiles(validFiles);
    
    // Pass to parent component
    if (onChange) {
      if (multiple) {
        onChange(name, validFiles);
      } else {
        onChange(name, validFiles[0] || null);
      }
    }
  };

  const removeFile = (indexToRemove) => {
    const updatedFiles = files.filter((_, index) => index !== indexToRemove);
    setFiles(updatedFiles);
    
    if (onChange) {
      if (multiple) {
        onChange(name, updatedFiles);
      } else {
        onChange(name, updatedFiles[0] || null);
      }
    }
    
    // Reset input value to allow re-uploading same file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    const icons = {
      pdf: '📄',
      doc: '📝',
      docx: '📝',
      xls: '📊',
      xlsx: '📊',
      ppt: '📽️',
      pptx: '📽️',
      jpg: '🖼️',
      jpeg: '🖼️',
      png: '🖼️',
      gif: '🖼️',
      mp4: '🎥',
      mp3: '🎵',
      zip: '📦',
      rar: '📦'
    };
    return icons[extension] || '📎';
  };

  const getFileSize = (size) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`file-input-container ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        name={name}
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        disabled={disabled}
        required={required && files.length === 0}
        style={{ display: 'none' }}
      />
      
      {/* Custom upload button */}
      <div
        onClick={!disabled ? triggerFileInput : undefined}
        className={`
          upload-area
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-blue-500'}
          border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-colors
        `}
      >
        <div className="flex flex-col items-center space-y-2">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="text-sm text-gray-600">
            {placeholder}
          </p>
          <p className="text-xs text-gray-400">
            {accept ? `Accepted: ${accept}` : 'All file types accepted'}
            {maxSize && ` • Max size: ${formatBytes(maxSize)}`}
          </p>
          {multiple && (
            <p className="text-xs text-blue-500">
              You can select multiple files
            </p>
          )}
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
          {error}
        </div>
      )}
      
      {/* Display selected files */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700">
            Selected Files ({files.length}):
          </h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <span className="text-2xl">
                    {getFileIcon(file.name)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="text-xs text-gray-500">
                        {getFileSize(file.size)}
                      </span>
                      <span className="text-xs text-gray-400">
                        Modified: {formatDate(file.lastModified)}
                      </span>
                      {file.type && (
                        <span className="text-xs text-gray-400">
                          {file.type}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                    title="Remove file"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
          
          {/* File summary */}
          <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-600">
            Total size: {formatBytes(files.reduce((acc, file) => acc + file.size, 0))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileInput;