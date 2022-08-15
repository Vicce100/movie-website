/* eslint-disable no-nested-ternary */
import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { v4 } from 'uuid';

import { url } from '../services/apiService';
import { getSeriesData, getSeriesEpisodes, searchSeries } from '../services/videoService';
import { usePageTitle, useShuffleArray } from '../hooks/index';
import Header from '../component/Header';
import {
  CategorySchemaType,
  FranchiseSchemaType,
  returnVideos,
  returnVideosArray,
  routesString as rs,
  descriptionMaxLength,
  EpisodeSchemaType,
  SeriesSchemaType,
} from '../utils/types';
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

  const [addEpisodeIndex, setAddEpisodeIndex] = useState<number>(0);
  const [searchString, setSearchString] = useState<string>('');
  const [searchResponse, setSearchResponse] = useState<returnVideosArray | undefined>(undefined);
  const [seriesToAddEpisode, setSeriesToAddEpisode] = useState<returnVideos>({
    _id: '',
    title: '',
    isMovie: true,
    displayPicture: '',
  });
  const [seriesData, setSeriesData] = useState<SeriesSchemaType | null>(null);
  const [seriesEpisodes, setSeriesEpisodes] = useState<EpisodeSchemaType[][]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number>(0);

  const [episodeDisplayPicture, setEpisodeDisplayPicture] = useState<File | null>(null);
  const [episodePicturePreview, setEpisodePicturePreview] = useState<string | undefined>(undefined);

  const [allCategories, setAllCategories] = useState<CategorySchemaType[] | null>(null);
  const [allFranchise, setAllFranchise] = useState<FranchiseSchemaType[] | null>(null);
  const [addEpisodeVideoFile, setAddEpisodeVideoFile] = useState<File | null>(null);
  const [addEpisodeCreationDate, setAddEpisodeCreationDate] = useState<string>(
    dayjs().format().split('T')[0]
  );
  const [episodeDescription, setEpisodeDescription] = useState<string>('');
  const [episodeTitle, setEpisodeTitle] = useState<string>('');

  const { setPageTitle } = usePageTitle();
  const shuffleArray = useShuffleArray();
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

  useEffect(() => {
    if (!searchString) return;
    searchSeries(searchString)
      .then((res) => (res.status === 200 ? setSearchResponse(res.data) : null))
      .catch((e) => console.log(e));
  }, [searchString]);

  useEffect(() => {
    if (!seriesToAddEpisode || !seriesToAddEpisode._id) return;
    const abc = async () => {
      try {
        const { data: tempSeriesData } = await getSeriesData(seriesToAddEpisode._id);
        setSeriesData(tempSeriesData);
        if (tempSeriesData) {
          const { data } = await getSeriesEpisodes(tempSeriesData._id);
          setSeriesEpisodes(data);
        }
      } catch (error) {
        console.log(error);
        if (error) navigate('/');
      }
    };
    abc();
  }, [navigate, seriesToAddEpisode]);

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
          ...createSeries,
          title: '',
          description: '',
          displayPicture: null,
          isPublic: true,
          creationDate: dayjs().format().split('T')[0],
          latestDate: dayjs().format().split('T')[0],
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
                  onChange={(e) => setCreateSeries({ ...createSeries, latestDate: e.target.value })}
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

  const renderSearchEpisode = useCallback(
    () => (
      <div className="search-container">
        <input
          type="text"
          name="search-value"
          id="search-value"
          placeholder="Search for movies and series..."
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
        />
        {searchResponse && (
          <div className="search-value-container">
            {shuffleArray(searchResponse).map((video: returnVideos) => (
              <div className="search-value-element" key={video._id}>
                <button
                  type="button"
                  className="search-value-element-button"
                  onClick={() => {
                    setSeriesToAddEpisode(video);
                    setAddEpisodeIndex(1);
                  }}
                >
                  <img src={video.displayPicture} alt={video.title} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    ),
    [searchResponse, searchString, shuffleArray]
  );

  useEffect(() => {
    if (!episodeDisplayPicture) return;
    const reader = new FileReader();
    reader.onloadend = () => setEpisodePicturePreview(reader.result as string);
    reader.readAsDataURL(episodeDisplayPicture);
  }, [episodeDisplayPicture]);

  const uploadEpisode = useCallback(
    async (
      e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      e.preventDefault();

      if (
        !seriesData ||
        !addEpisodeVideoFile ||
        !episodeDisplayPicture ||
        !episodeDescription ||
        !episodeTitle
      )
        return;

      let episodeNr = 1;
      let seasonNr = 1;

      if (seriesData.episodes[selectedSeason]) episodeNr = seriesData.episodes.length + 1;

      if (seriesEpisodes.length) seasonNr = selectedSeason + 1;

      const formData = new FormData();

      formData.append('videoFile', addEpisodeVideoFile);
      formData.append('displayPicture', episodeDisplayPicture);

      formData.append('seriesId', seriesData?._id);
      formData.append('episodeTitle', episodeTitle);
      formData.append('description', episodeDescription);
      formData.append('releaseDate', dayjs(addEpisodeCreationDate).format());
      formData.append('seasonNr', String(seasonNr));
      formData.append('episodeNr', String(episodeNr));

      const options: RequestInit = { method: 'POST', credentials: 'include', body: formData };
      try {
        setIsUploading(true);
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
        const res: { success: boolean } = await (
          await fetch(`${url}/${rs.video}/${rs.episode}/${rs.add}`, options)
        ).json();
        // console.log(res);
        setSeriesToAddEpisode({
          _id: '',
          title: '',
          isMovie: true,
          displayPicture: '',
        });
        setAddEpisodeVideoFile(null);
        setSeriesData(null);
        setEpisodeDescription('');
        setEpisodeTitle('');
      } catch (error) {
        console.log(error);
      }
      setIsUploading(false);
      setAddEpisodeIndex(0);
    },
    [
      seriesData,
      addEpisodeVideoFile,
      episodeDisplayPicture,
      episodeDescription,
      episodeTitle,
      selectedSeason,
      seriesEpisodes,
      addEpisodeCreationDate,
    ]
  );

  const renderSeriesInfo = useCallback(
    () =>
      seriesData ? (
        <div className="series-data-container">
          <div className="series-data">
            <div className="title-div">
              <h4 className="field-text">{seriesData.title}</h4>
            </div>
            <div className="series-info">
              <div className="displayPicture">
                <img src={seriesData.displayPicture} alt="preview-img" />
              </div>
              <div className="fields">
                <div className="fields">
                  <h4 className="field-text">{seriesData.description}</h4>
                </div>
              </div>
            </div>
            <div className="seasons-and-episodes">
              <div className="seasons">
                {seriesEpisodes.map((_season, index) => (
                  <button
                    type="button"
                    style={{ backgroundColor: selectedSeason === index ? '#03b1fc' : '#fc7ae2' }}
                    key={`${v4()}-season-button`}
                    className="seasons-button"
                    onClick={() => setSelectedSeason(index)}
                  >
                    <p>{index + 1}</p>
                  </button>
                ))}
                <button
                  style={{
                    backgroundColor:
                      selectedSeason === seriesEpisodes.length ? '#03b1fc' : '#fc7ae2',
                  }}
                  className="seasons-button"
                  type="button"
                  onClick={() => setSelectedSeason(seriesEpisodes.length)}
                >
                  +
                </button>
              </div>
              <div className="episodes">
                {seriesEpisodes[selectedSeason] &&
                  seriesEpisodes[selectedSeason].map((episode, index) => (
                    <div className="episode-div" key={episode._id}>
                      <div className="episode-div-header">
                        <div className="text-div">
                          <p className="text episode-index">{index + 1}</p>
                          <p className="text">{episode.episodeTitle}</p>
                        </div>
                        <div className="remaining" />
                      </div>
                      <div className="episode-content">
                        <img
                          src={episode.displayPicture}
                          alt={`${episode.episodeTitle}-img`}
                          className="episode-display-image"
                        />
                        <div className="episode-description">
                          <p>{episode.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                <form
                  onSubmit={uploadEpisode}
                  className="episode-div"
                  style={{
                    backgroundColor: 'rgba(50, 50, 50, 0.5)',
                    boxShadow: '0px 0px 10px rgba(1, 1, 1, 0.5)',
                  }}
                >
                  <div className="episode-div-header">
                    <div className="text-div">
                      <p className="text episode-index">
                        {seriesEpisodes[selectedSeason] && seriesEpisodes[selectedSeason].length
                          ? seriesEpisodes[selectedSeason].length + 1
                          : 1}
                      </p>
                      <input
                        type="text"
                        name="newEpisodeTitle"
                        id="newEpisodeTitle"
                        placeholder="Episode Title"
                        value={episodeTitle}
                        onChange={(e) => setEpisodeTitle(e.target.value)}
                      />
                      <p className="move-left">Video File</p>
                      <input
                        className="episode-video-file"
                        style={{ display: 'none' }}
                        type="file"
                        name="addEpisodeVideoFile"
                        id="addEpisodeVideoFile"
                        accept="video/mp4"
                        onChange={(e) =>
                          setAddEpisodeVideoFile(e.target.files && e.target.files[0])
                        }
                      />
                      <label htmlFor="addEpisodeVideoFile" />

                      <label className="move-left" htmlFor="creationDate">
                        Creation Date
                      </label>
                      <input
                        type="date"
                        name="creationDate"
                        id="creationDate"
                        accept="video/*"
                        value={addEpisodeCreationDate}
                        className="creation-date move-left"
                        onChange={(e) => setAddEpisodeCreationDate(e.target.value)}
                      />
                    </div>
                    <div className="remaining" />
                  </div>
                  <div className="episode-content">
                    <input
                      className="display-picture-input"
                      style={{ display: 'none' }}
                      type="file"
                      name="displayPicture"
                      id="displayPicture"
                      accept="image/*"
                      onChange={(e) =>
                        setEpisodeDisplayPicture(e.target.files && e.target.files[0])
                      }
                    />
                    <label htmlFor="displayPicture">
                      {episodePicturePreview && (
                        <img
                          className="episode-display-image"
                          src={episodePicturePreview}
                          alt="preview"
                        />
                      )}
                    </label>
                    <div className="episode-description">
                      <textarea
                        value={episodeDescription}
                        onChange={(e) => setEpisodeDescription(e.target.value)}
                        placeholder="Description..."
                        maxLength={descriptionMaxLength}
                      />
                    </div>
                  </div>
                  <div className="episode-div-header">
                    <button
                      className="submit-button"
                      type="submit"
                      onClick={uploadEpisode}
                      disabled={!!isUploading}
                    >
                      {!isUploading ? (
                        <p>Submit</p>
                      ) : (
                        <div className="submit-video-button-loader" />
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : null,
    [
      seriesData,
      selectedSeason,
      seriesEpisodes,
      uploadEpisode,
      episodeTitle,
      addEpisodeCreationDate,
      episodePicturePreview,
      episodeDescription,
      isUploading,
    ]
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
          {showAddEpisode && (
            <div className="render-upload-section">
              {addEpisodeIndex === 0
                ? renderSearchEpisode()
                : addEpisodeIndex === 1
                ? renderSeriesInfo()
                : undefined}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
