import React, { useState, useCallback } from 'react';
import '../styles/AdminStyle.scss';

export default function AddAvatar() {
  const [multipleUpload, setMultipleUpload] = useState<boolean>(false);

  const renderSingleUpload = useCallback(() => {
    const a = 'sef';
    return (
      <form action="">
        <input type="file" name="file" />
        <button type="submit">upload</button>
      </form>
    );
  }, []);

  const renderMultipleUpload = useCallback(() => {
    const a = 'sef';
    return (
      <div>
        <h4>this is a multiple upload</h4>
      </div>
    );
  }, []);

  return (
    <div className="add-avatar-container">
      <div className="switch-div-section">
        <div className="switch-div-box">
          <h1 className="add-avatar-header-text">Add single</h1>
          <input
            className="switch-input"
            type="checkbox"
            name="switch-input"
            id="switch-input"
            onChange={(e) => setMultipleUpload(e.target.checked)}
            // disabled
          />
          <label htmlFor="switch-input" />
          <h1 className="add-avatar-header-text">Add multiple</h1>
        </div>
      </div>
      <div className="main-content">
        <div className="form-parent-div">
          {!multipleUpload ? renderSingleUpload() : renderMultipleUpload()}
        </div>
      </div>
    </div>
  );
}
