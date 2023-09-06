import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    //pasa también el nombbre del usuario
    //formData.append('avatar', avatar);

  
    try {
      const res = await axios.post(
        'https://ceu-chatcompletion-python.azurewebsites.net/api/fileblobupload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('File uploaded successfully:', res.data);
      setUploadStatus('File uploaded successfully.'); // Set the upload status
    } catch (err) {
      console.log('There was an error uploading the file:', err);
      setUploadStatus('There was an error uploading the file.');
    }
  };

  return (
    <div>
      <h1>File Upload</h1>
      <form onSubmit={onSubmit}>
        <div>
          <input type="file" onChange={onFileChange} />
        </div>
        <button type="submit">Upload</button>
      </form>
      {uploadStatus && <p>{uploadStatus}</p>} {/* Show upload status */}
    </div>
  );
};

export default FileUpload;
