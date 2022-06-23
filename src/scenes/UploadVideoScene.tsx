import React, { useState, useCallback, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { usePageTitle } from '../hooks/index';
import Header from '../component/Header';
import { ReactComponent as Play } from '../svg/play.svg';
import '../styles/UploadVideoStyle.scss';

// create state for storing file in
export default function PostFile() {
  const [multipleUpload, setMultipleUpload] = useState<boolean>(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [singleDisplayPicture, setSingleDisplayPicture] = useState<File | null>(null);
  const [singlePicturePreview, setSinglePicturePreview] = useState<string | undefined>(undefined);
  const [singleTitle, setSingleTitle] = useState<string>('');
  const [singleUploadReleaseDate, setSingleUploadReleaseDate] = useState<string>('');
  // const navigate = useNavigate();
  const { setPageTitle } = usePageTitle();

  useEffect(() => setPageTitle('Upload Video'), [setPageTitle]);

  const submitSingleUpload = useCallback(
    async (
      e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      e.preventDefault();
      if (!videoFile || !singleDisplayPicture || !singleUploadReleaseDate || !singleTitle) return;
      const formData = new FormData();
      formData.append('videoFile', videoFile);
      formData.append('displayPicture', singleDisplayPicture);
      formData.append('releaseDate', dayjs(singleUploadReleaseDate).format());
      formData.append('title', singleTitle);
      // formData.append('album')
      // formData.append('description');
      // formData.append('categories');

      const options: RequestInit = { method: 'POST', credentials: 'include', body: formData };
      try {
        const res = await (
          await fetch('http://localhost:5050/video/upload/singe/public', options)
        ).json();
        const response = await res;
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    },
    [videoFile, singleDisplayPicture, singleUploadReleaseDate, singleTitle]
  );

  const aaa = useCallback((value: File) => {
    const reader = new FileReader();
    reader.onloadend = () => setSinglePicturePreview(reader.result as string);
    reader.readAsDataURL(value);
  }, []);

  const renderSingleUpload = useCallback(
    () => (
      <div className="single-upload-section">
        <form onSubmit={submitSingleUpload}>
          <div className="video-preview-section">
            <input
              className="single-display-picture-input"
              style={{ display: 'none' }}
              type="file"
              name="displayPicture"
              id="displayPicture"
              accept="image/*"
              onChange={(e) => {
                setSingleDisplayPicture(e.target.files && e.target.files[0]);
                const a = e.target.files && e.target.files[0];
                if (a) aaa(a);
              }}
            />
            <label htmlFor="displayPicture">
              {singlePicturePreview ? (
                <img src={singlePicturePreview || undefined} alt="preview" />
              ) : null}
              <div className="preview-play-div">
                <Play className="svg-play" />
              </div>
            </label>
            <div className="video-preview-input-fields">
              <div>
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  placeholder="Title"
                  className="title-input"
                  onChange={(e) => setSingleTitle(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="videoFile">Video File</label>
                <input
                  type="file"
                  name="videoFile"
                  id="videoFile"
                  accept="video/*"
                  className="video-file-input"
                  onChange={(e) => setVideoFile(e.target.files && e.target.files[0])}
                />
              </div>
              <div className="release-date-div">
                <label htmlFor="ReleaseData">Release Data</label>
                <div>
                  <input
                    type="date"
                    name="ReleaseData"
                    id="ReleaseData"
                    accept="video/*"
                    value={singleUploadReleaseDate}
                    className="title-input"
                    onChange={(e) => setSingleUploadReleaseDate(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setSingleUploadReleaseDate(dayjs().format().split('T')[0])}
                  >
                    This Date
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    ),
    [submitSingleUpload, singlePicturePreview, singleUploadReleaseDate, aaa]
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
              onClick={(e) => (!multipleUpload ? submitSingleUpload(e) : submitSingleUpload(e))}
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
