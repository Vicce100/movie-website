import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { url } from '../services/apiService';
import { usePageTitle } from '../hooks/index';
import Header from '../component/Header';
import { CategorySchemaType, FranchiseSchemaType, routesString as rs } from '../utils/types';
import { getAllCategory, getAllFranchise } from '../services/index';

import { ReactComponent as PlayCircle } from '../asset/svg/videoPlayer/playCircle.svg';

import '../styles/UploadVideoStyle.scss';

type CreateSeriesType = {
  title: string;
  description: string;
  displayPicture: File | null;
  isPublic: boolean;
  creationDate: string;
  latestDate: string;
  category: string[];
  franchise: string[];
};

export default function PostFile() {
  const [showMovieUpload, setShowMovieUpload] = useState<boolean>(false);
  const [showCreateSeries, setShowCreateSeries] = useState<boolean>(false);
  const [showAddEpisode, setShowAddEpisode] = useState<boolean>(false);

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [displayPicture, setDisplayPicture] = useState<File | null>(null);
  const [picturePreview, setPicturePreview] = useState<string | undefined>(undefined);
  const [title, setTitle] = useState<string>('');
  const [uploadReleaseDate, setUploadReleaseDate] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  const [franchises, setFranchises] = useState<string[]>([]);
  const [description, setDescription] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const [seriesPicturePreview, setSeriesPicturePreview] = useState<string | undefined>(undefined);
  const [createSeries, setCreateSeries] = useState<CreateSeriesType>({
    title: '',
    description: '',
    displayPicture: null,
    isPublic: true,
    creationDate: dayjs().format().split('T')[0],
    latestDate: dayjs().format().split('T')[0],
    category: [],
    franchise: [],
  });

  const [allCategories, setAllCategories] = useState<CategorySchemaType[] | null>(null);
  const [allFranchise, setAllFranchise] = useState<FranchiseSchemaType[] | null>(null);

  const { setPageTitle } = usePageTitle();
  const navigate = useNavigate();

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
        setCategories([]);
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

  const renderMovieUpload = useCallback(
    () => (
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
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      uploadMovieCall,
      uploadReleaseDate,
      picturePreview,
      allCategories,
      isUploading,
      description,
      categories,
    ]
  );

  const createSeriesCall = useCallback(
    async (
      e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      e.preventDefault();
      const {
        title: seriesTitle,
        description: seriesDescription,
        displayPicture: seriesDisplayPicture,
        isPublic: seriesIsPublic,
        creationDate: SeriesCreationDate,
        latestDate: seriesLatestDate,
        category: seriesCategory,
        franchise: seriesFranchise,
      } = createSeries;
      if (
        !seriesTitle ||
        !seriesDescription ||
        !seriesDisplayPicture ||
        !SeriesCreationDate ||
        !seriesLatestDate ||
        !seriesCategory ||
        !seriesFranchise ||
        isUploading
      )
        return;

      const formData = new FormData();

      formData.append('title', seriesTitle);
      formData.append('displayPicture', seriesDisplayPicture);
      formData.append('description', seriesDescription);
      formData.append('isPublic', String(seriesIsPublic));

      formData.append('creationDate', dayjs(SeriesCreationDate).format());
      formData.append('latestDate', dayjs(seriesLatestDate).format());

      seriesCategory.forEach((category) => formData.append('categories', category));
      seriesFranchise.forEach((franchise) => formData.append('franchise', franchise));

      const options: RequestInit = { method: 'POST', credentials: 'include', body: formData };
      try {
        setIsUploading(true);
        const res: { success: boolean } = await (
          await fetch(`${url}/${rs.video}/${rs.series}/${rs.create}`, options)
        ).json();
        console.log(res);
        setCreateSeries({
          title: '',
          description: '',
          displayPicture: null,
          isPublic: true,
          creationDate: dayjs().format().split('T')[0],
          latestDate: dayjs().format().split('T')[0],
          category: [],
          franchise: [],
        });
        setSeriesPicturePreview(undefined);
      } catch (error) {
        console.log(error);
      }
      setIsUploading(false);
    },
    [createSeries, isUploading]
  );

  useEffect(() => {
    if (!createSeries.displayPicture) return;
    const reader = new FileReader();
    reader.onloadend = () => setSeriesPicturePreview(reader.result as string);
    reader.readAsDataURL(createSeries.displayPicture);
  }, [createSeries.displayPicture]);

  const renderCreateSeries = useCallback(
    () => (
      <div className="create-series-container">
        <form onSubmit={createSeriesCall}>
          <div className="preview-image">
            <input
              className="display-picture-input"
              style={{ display: 'none' }}
              type="file"
              name="displayPicture"
              id="displayPicture"
              accept="image/*"
              onChange={(e) =>
                setCreateSeries({
                  ...createSeries,
                  displayPicture: e.target.files && e.target.files[0],
                })
              }
            />
            <label htmlFor="displayPicture">
              {seriesPicturePreview && (
                <img src={seriesPicturePreview || undefined} alt="preview" />
              )}
            </label>
            <div className="fields">
              <div>
                <label htmlFor="title">Series Title</label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={createSeries.title}
                  placeholder="Title"
                  className="title-input"
                  onChange={(e) => setCreateSeries({ ...createSeries, title: e.target.value })}
                />
              </div>

              <div className="date-div">
                <label htmlFor="creationDate">Creation Date</label>
                <input
                  type="date"
                  name="creationDate"
                  id="creationDate"
                  accept="video/*"
                  value={createSeries.creationDate}
                  className="title-input"
                  onChange={(e) =>
                    setCreateSeries({ ...createSeries, creationDate: e.target.value })
                  }
                />
              </div>

              <div className="date-div">
                <label htmlFor="latestDate">Latest Date</label>
                <input
                  type="date"
                  name="latestDate"
                  id="latestDate"
                  accept="video/*"
                  value={createSeries.latestDate}
                  className="title-input"
                  onChange={(e) => setCreateSeries({ ...createSeries, title: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="switch-div-box">
            <h1 className="switch-header-text">Private</h1>
            <input
              className="switch-input"
              type="checkbox"
              name="switch-input"
              id="switch-input"
              onChange={(e) => setCreateSeries({ ...createSeries, isPublic: e.target.checked })}
              // disabled
            />
            <label htmlFor="switch-input" />
            <h1 className="switch-header-text">Public</h1>
          </div>

          <div className="description">
            <label htmlFor="description-input">Description</label>
            <textarea
              className="description-input"
              id="description-input"
              value={createSeries.description}
              onChange={(e) => setCreateSeries({ ...createSeries, description: e.target.value })}
              maxLength={400}
            />
          </div>

          <div className="categories-and-franchise-container">
            <div className="parent">
              <h4>Categories</h4>
              <div className="categories-and-franchise">
                {allCategories &&
                  allCategories.map((category) => (
                    <div
                      key={category._id}
                      className="single-categories-and-franchise"
                      // style={{
                      //   backgroundColor: checkSelectedCategories(categories, category.name),
                      // }}
                    >
                      <input
                        className="checkbox"
                        type="checkbox"
                        name="category"
                        value={category.name}
                        id={category._id}
                        onChange={() => {
                          if (!createSeries.category.includes(category.name))
                            setCreateSeries({
                              ...createSeries,
                              category: [...createSeries.category, category.name],
                            });
                          else
                            setCreateSeries({
                              ...createSeries,
                              category: createSeries.category.filter((c) => c !== category.name),
                            });
                        }}
                      />
                      <label htmlFor={category._id}>{category.name}</label>
                    </div>
                  ))}
              </div>
            </div>
            <div className="parent">
              <h4>Franchises</h4>
              <div className="categories-and-franchise">
                {allFranchise &&
                  allFranchise.map((franchise) => (
                    <div
                      key={franchise._id}
                      className="single-categories-and-franchise"
                      // style={{
                      //   backgroundColor: checkSelectedCategories(categories, franchise.name),
                      // }}
                    >
                      <input
                        className="checkbox"
                        type="checkbox"
                        name="franchise"
                        value={franchise.name}
                        id={franchise._id}
                        onChange={() => {
                          if (!createSeries.franchise.includes(franchise.name))
                            setCreateSeries({
                              ...createSeries,
                              franchise: [...createSeries.franchise, franchise.name],
                            });
                          else
                            setCreateSeries({
                              ...createSeries,
                              franchise: createSeries.franchise.filter((f) => f !== franchise.name),
                            });
                        }}
                      />
                      <label htmlFor={franchise._id}>{franchise.name}</label>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* submit button */}
          <div className="submit-button-div">
            <button
              type="submit"
              className="submit-button"
              disabled={!!isUploading}
              onClick={createSeriesCall}
            >
              {!isUploading ? <p>Submit</p> : <div className="submit-button-loader" />}
            </button>
          </div>
        </form>
      </div>
    ),
    [allCategories, allFranchise, createSeries, createSeriesCall, isUploading, seriesPicturePreview]
  );

  const selectField = useCallback(
    // eslint-disable-next-line no-unused-vars
    (setValue: (value: React.SetStateAction<boolean>) => void, value: boolean) => {
      setShowMovieUpload(false);
      setShowCreateSeries(false);
      setShowAddEpisode(false);
      setValue(!value);
    },
    []
  );

  return (
    <div className="upload-video-container">
      <Header />

      <div className="options-menu">
        <button
          type="button"
          className="options-button-box"
          id="options-button-box-go-home"
          onClick={() => navigate('/')}
        >
          <h3 className="options-box-heading">Go To Home</h3>
        </button>
        <button
          style={{ border: showMovieUpload ? '1px solid #fff' : 'none' }}
          type="button"
          className="options-button-box"
          onClick={() => selectField(setShowMovieUpload, showMovieUpload)}
        >
          <h3 className="options-box-heading">Movie Upload</h3>
        </button>
        <button
          style={{ border: showCreateSeries ? '1px solid #fff' : 'none' }}
          type="button"
          className="options-button-box"
          onClick={() => selectField(setShowCreateSeries, showCreateSeries)}
        >
          <h3 className="options-box-heading">Create Series</h3>
        </button>
        <button
          style={{ border: showAddEpisode ? '1px solid #fff' : 'none' }}
          type="button"
          className="options-button-box"
          onClick={() => selectField(setShowAddEpisode, showAddEpisode)}
        >
          <h3 className="options-box-heading">Add Episode</h3>
        </button>
      </div>
      <div className="upload-video-section">
        <div className="main-content">
          {showMovieUpload && <div className="render-upload-section">{renderMovieUpload()}</div>}
          {showCreateSeries && <div className="render-upload-section">{renderCreateSeries()}</div>}
          {/* {showAddEpisode && <div className="render-upload-section">{renderAddEpisode()}</div>} */}
        </div>
      </div>
    </div>
  );
}
