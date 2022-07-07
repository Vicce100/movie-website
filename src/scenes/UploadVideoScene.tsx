/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { usePageTitle } from '../hooks/index';
import Header from '../component/Header';
import { CategorySchemaType } from '../utils/types';
import { getAllCategory } from '../services/index';

import { ReactComponent as PlayCircle } from '../asset/svg/videoPlayer/playCircle.svg';

import '../styles/UploadVideoStyle.scss';

// create state for storing file in
export default function PostFile() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [displayPicture, setDisplayPicture] = useState<File | null>(null);
  const [picturePreview, setPicturePreview] = useState<string | undefined>(undefined);
  const [title, setTitle] = useState<string>('');
  const [uploadReleaseDate, setUploadReleaseDate] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  const [description, setDescription] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const [allCategories, setAllCategories] = useState<CategorySchemaType[] | null>(null);

  const { setPageTitle } = usePageTitle();

  useEffect(() => setPageTitle('Upload Video'), [setPageTitle]);

  useEffect(() => {
    getAllCategory()
      .then((res) => (res.status === 200 ? setAllCategories(res.data) : null))
      .catch((e) => console.log(e));
  }, []);

  useEffect(() => setUploadReleaseDate(dayjs().format().split('T')[0]), []);

  const submitSingleUpload = useCallback(
    async (
      e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      e.preventDefault();
      if (!videoFile || !displayPicture || !uploadReleaseDate || !title || !description) return;

      const formData = new FormData();
      formData.append('videoFile', videoFile);
      formData.append('displayPicture', displayPicture);
      formData.append('releaseDate', dayjs(uploadReleaseDate).format());
      formData.append('title', title);
      formData.append('description', description);
      categories.forEach((category) => formData.append('categories', category));

      const options: RequestInit = { method: 'POST', credentials: 'include', body: formData };
      try {
        setIsUploading(true);
        const res = await (
          await fetch('http://localhost:5050/video/upload/singe/public', options)
        ).json();
        console.log(await res);
        setIsUploading(false);
        setVideoFile(null);
        setDisplayPicture(null);
        setPicturePreview(undefined);
        setTitle('');
        setUploadReleaseDate(dayjs().format().split('T')[0]);
        setCategories([]);
        setDescription('');
      } catch (error) {
        console.log(error);
        setIsUploading(false);
      }
    },
    [videoFile, displayPicture, uploadReleaseDate, title, description, categories]
  );

  useEffect(() => {
    if (!displayPicture) return;
    const reader = new FileReader();
    reader.onloadend = () => setPicturePreview(reader.result as string);
    reader.readAsDataURL(displayPicture);
  }, [displayPicture]);

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
              onChange={(e) => setDisplayPicture(e.target.files && e.target.files[0])}
            />
            <label htmlFor="displayPicture">
              {picturePreview ? <img src={picturePreview || undefined} alt="preview" /> : null}
              <div className="preview-play-div">
                <PlayCircle className="svg-play" />
              </div>
            </label>
            <div className="video-preview-input-fields">
              <div>
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={title}
                  placeholder="Title"
                  className="title-input"
                  onChange={(e) => setTitle(e.target.value)}
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
                <input
                  type="date"
                  name="ReleaseData"
                  id="ReleaseData"
                  accept="video/*"
                  value={uploadReleaseDate}
                  className="title-input"
                  onChange={(e) => setUploadReleaseDate(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="video-addon-info">
            <div className="description">
              <label htmlFor="description-input">description</label>
              <input
                type="text"
                className="description-input"
                id="description-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={400}
              />
            </div>
            <div className="categories-selection">
              {allCategories &&
                allCategories.map((category) => (
                  <div
                    key={category._id}
                    className="single-categories-div"
                    // style={{
                    //   backgroundColor: checkSelectedCategories(categories, category.name),
                    // }}
                  >
                    <input
                      className="single-categories-checkbox"
                      type="checkbox"
                      name="category"
                      value={category.name}
                      id={category._id}
                      onChange={() => {
                        if (!categories.includes(category.name))
                          setCategories([...categories, category.name]);
                        else setCategories(categories.filter((c) => c !== category.name));
                      }}
                    />
                    <label htmlFor={category._id}>{category.name}</label>
                  </div>
                ))}
            </div>
          </div>
          <div className="submit-video-button-div">
            <button
              type="submit"
              className="submit-video-button"
              disabled={!!isUploading}
              onClick={(e) => {
                submitSingleUpload(e);
              }}
            >
              {!isUploading ? <p>Submit</p> : <div className="submit-video-button-loader" />}
            </button>
          </div>
        </form>
      </div>
    ),
    [
      submitSingleUpload,
      uploadReleaseDate,
      picturePreview,
      allCategories,
      isUploading,
      description,
      categories,
    ]
  );

  return (
    <div className="upload-video-container">
      <Header />
      <div className="upload-video-section">
        <div className="main-content">
          <div className="render-upload-section">{renderSingleUpload()}</div>
          {/* <div className="submit-filed-div">
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
          </div> */}
        </div>
      </div>
    </div>
  );
}
