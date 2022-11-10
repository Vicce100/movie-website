import React, { useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';

import { getAllCategory, getAllFranchise } from '../../../services';
import {
  CategorySchemaType,
  FranchiseSchemaType,
  descriptionMaxLength,
  routesString as rs,
} from '../../../utils/types';
import { url } from '../../../services/apiService';
import { usePageTitle } from '../../../hooks';

import { ReactComponent as PlayCircle } from '../../../asset/svg/videoPlayer/playCircle.svg';

import '../styles/MovieUpload.scss';

export default function MovieUpload() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [displayPicture, setDisplayPicture] = useState<File | null>(null);
  const [picturePreview, setPicturePreview] = useState<string | undefined>(undefined);
  const [title, setTitle] = useState<string>('');
  const [uploadReleaseDate, setUploadReleaseDate] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  const [franchises, setFranchises] = useState<string[]>([]);
  const [description, setDescription] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const [allCategories, setAllCategories] = useState<CategorySchemaType[] | null>(null);
  const [allFranchise, setAllFranchise] = useState<FranchiseSchemaType[] | null>(null);

  const { setPageTitle } = usePageTitle();

  useEffect(() => setPageTitle('Upload Video'), [setPageTitle]);

  useEffect(() => {
    setUploadReleaseDate(dayjs().format().split('T')[0]);

    getAllCategory()
      .then((res) => (res.status === 200 ? setAllCategories(res.data) : null))
      .catch((e) => console.log(e));

    getAllFranchise()
      .then((res) => (res.status === 200 ? setAllFranchise(res.data) : null))
      .catch((e) => console.log(e));
  }, []);

  const uploadMovieCall = useCallback(
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
      formData.append('isPublic', String(true));
      categories.forEach((category) => formData.append('categories', category));
      franchises.forEach((franchise) => formData.append('franchise', franchise));

      const options: RequestInit = { method: 'POST', credentials: 'include', body: formData };
      try {
        setIsUploading(true);
        const res: { success: boolean } = await (
          await fetch(`${url}/${rs.video}/${rs.movie}/${rs.create}`, options)
        ).json();
        console.log(res);
        setVideoFile(null);
        setDisplayPicture(null);
        setPicturePreview(undefined);
        setTitle('');
        setUploadReleaseDate(dayjs().format().split('T')[0]);
        setDescription('');
      } catch (error) {
        console.log(error);
      }
      setIsUploading(false);
    },
    [videoFile, displayPicture, uploadReleaseDate, title, description, categories, franchises]
  );

  useEffect(() => {
    if (!displayPicture) return;
    const reader = new FileReader();
    reader.onloadend = () => setPicturePreview(reader.result as string);
    reader.readAsDataURL(displayPicture);
  }, [displayPicture]);

  return (
    <div className="single-upload-section">
      <form onSubmit={uploadMovieCall}>
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
            <textarea
              className="description-input"
              id="description-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={descriptionMaxLength}
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
            {allFranchise &&
              allFranchise.map((franchise) => (
                <div
                  key={franchise._id}
                  className="single-categories-div"
                  // style={{
                  //   backgroundColor: checkSelectedCategories(categories, franchise.name),
                  // }}
                >
                  <input
                    className="single-categories-checkbox"
                    type="checkbox"
                    name="franchise"
                    value={franchise.name}
                    id={franchise._id}
                    onChange={() => {
                      if (!franchises.includes(franchise.name))
                        setFranchises([...franchises, franchise.name]);
                      else setFranchises(franchises.filter((c) => c !== franchise.name));
                    }}
                  />
                  <label htmlFor={franchise._id}>{franchise.name}</label>
                </div>
              ))}
          </div>
        </div>
        <div className="submit-video-button-div">
          <button
            type="submit"
            className="submit-video-button"
            disabled={!!isUploading}
            onClick={uploadMovieCall}
          >
            {!isUploading ? <p>Submit</p> : <div className="submit-video-button-loader" />}
          </button>
        </div>
      </form>
    </div>
  );
}
