import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../component/Header';
import '../styles/UploadVideoStyle.scss';

// create state for storing file in
export default function PostFile() {
  const [multipleUpload, setMultipleUpload] = useState<boolean>(false);
  const [file, setFile] = useState<string | Blob | null>(null);
  const navigate = useNavigate();

  const fileChangeHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setFile(e.target.files && e.target.files[0]),
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!file) return;
      const formData = new FormData();
      formData.append('file', file);

      const options: RequestInit = { method: 'POST', credentials: 'include', body: formData };
      try {
        const res = await fetch('http://localhost:5050/image/upload/multiple', options);
        if (res.ok) navigate('/');
      } catch (error) {
        console.log(error);
      }
    },
    [file, navigate]
  );

  const renderSingleUpload = useCallback(
    () => (
      <div>
        <h2>renderSingleUpload</h2>
      </div>
    ),
    []
  );

  const renderMultipleUpload = useCallback(
    () => (
      <div>
        <h2>renderMultipleUpload</h2>
      </div>
    ),
    []
  );

  return (
    <div className="upload-video-container">
      <Header />
      <div className="upload-video-section">
        <div className="select-upload-formate">
          <h2 className="upload-selection-title">Single Upload</h2>
          <input
            className="switch-input"
            type="checkbox"
            name="switch-input"
            id="switch-input"
            onChange={(e) => setMultipleUpload(e.target.checked)}
            // disabled
          />
          <label htmlFor="switch-input" />
          <h2 className="upload-selection-title">Multiple Upload</h2>
        </div>
        <div className="main-content">
          <div className="render-upload-section">
            {!multipleUpload ? renderSingleUpload() : renderMultipleUpload()}
          </div>
          <div className="submit-filed-div">
            <button
              type="button"
              className="submit-avatar-upload-button"
              // onClick={(e) => (!multipleUpload ? uploadSingleAvatar(e) : uploadMultipleAvatars(e))}
            >
              Submit
            </button>
            {multipleUpload && (
              <button
                type="button"
                className="submit-avatar-upload-button"
                // onClick={() =>
                //   setMultipleAvatar([...multipleAvatar, { id: uuidV4(), name: '', file: null }])
                // }
              >
                Add Field
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
