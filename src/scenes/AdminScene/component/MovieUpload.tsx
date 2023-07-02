/* eslint-disable camelcase */
/* eslint-disable react/jsx-no-useless-fragment */
import React, { useCallback, useEffect, useState, useRef } from 'react';
import dayjs from 'dayjs';

import { getAllCategory, getAllFranchise } from '../../../services';
import {
  getMovieData,
  searchMovie,
  updateMovieDate,
  uploadMovieObject,
  uploadMovieChunk,
} from '../../../services/videoService';
import {
  CategorySchemaType,
  FranchiseSchemaType,
  // descriptionMaxLength,
  routesString as rs,
  TMDB_BASE_URL,
  TMDB_API_KEY,
  searchMovieString,
  returnVideosArray,
  TMDB_IMAGE_URL,
  descriptionMaxLength,
  getMovieGenre,
  MovieSchemaType,
} from '../../../utils/types';
import { generateFFmpeg, host, port, protocol, url } from '../../../services/apiService';
import { usePageTitle } from '../../../hooks';

import { ReactComponent as GoBack } from '../../../asset/svg/left-arrow-white.svg';

import '../styles/MovieUpload.scss';

type tmdbEpisodeData = {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

type tmdbMovieSearchResult = {
  page: number;
  results: tmdbEpisodeData[];
  total_pages: number;
  total_results: number;
} | null;

type tmdbGenreType = { genres: { id: number; name: string }[] };
const chunkSize = 10 * 1024;

export default function MovieUpload() {
  const [indexSection, setIndexSection] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const [internalSearchValue, setInternalSearchValue] = useState<string>('');
  const [internalSearchResponse, setInternalSearchResponse] = useState<returnVideosArray | null>(
    null
  );
  const [internalMovieData, setInternalMovieData] = useState<MovieSchemaType | null>(null);

  const [externalSearchValue, setExternalSearchValue] = useState<string>('');
  const [externalSearchResult, setExternalSearchResult] = useState<tmdbMovieSearchResult>(null);
  const [externalMovieData, setExternalMovieData] = useState<tmdbEpisodeData | null>(null);

  const [tmdbGenreList, setTmdbGenreList] = useState<tmdbGenreType | null>(null);
  const [allCategories, setAllCategories] = useState<CategorySchemaType[] | null>(null);
  const [allFranchise, setAllFranchise] = useState<FranchiseSchemaType[] | null>(null);

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [franchises, setFranchises] = useState<string[]>([]);

  const uploadMovieTitleRef = useRef<HTMLInputElement | null>(null);
  const uploadMovieDescriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const uploadMovieReleaseDataRef = useRef<HTMLInputElement | null>(null);
  const uploadMovieImg = useRef<HTMLImageElement | null>(null);
  const uploadMovieBackdrop = useRef<HTMLImageElement | null>(null);

  const [currentChunkIndex, setCurrentChunkIndex] = useState<null | number>(null);
  const [lastMovieId, setLastMovieId] = useState<string>('');

  const updateMovieTitle = useRef<HTMLInputElement | null>(null);
  const updateMovieDisplayPicture = useRef<HTMLInputElement | null>(null);
  const updateMovieBackdrop = useRef<HTMLInputElement | null>(null);
  const updateMovieDescription = useRef<HTMLTextAreaElement | null>(null);
  const updateMovieUploadDate = useRef<HTMLInputElement | null>(null);

  const { setPageTitle } = usePageTitle();

  useEffect(() => setPageTitle('Upload Video'), [setPageTitle]);

  useEffect(() => {
    getAllCategory()
      .then((res) => (res.status === 200 ? setAllCategories(res.data) : null))
      .catch((e) => console.log(e));

    getAllFranchise()
      .then((res) => (res.status === 200 ? setAllFranchise(res.data) : null))
      .catch((e) => console.log(e));

    (async () => {
      const res = await (
        await fetch(`${TMDB_BASE_URL}${getMovieGenre}?${TMDB_API_KEY}`, { method: 'GET' })
      )
        .json()
        .catch((err) => console.log(err));

      setTmdbGenreList(res);
    })();
  }, []);

  useEffect(() => {
    if (!internalSearchValue) return;
    searchMovie(internalSearchValue)
      .then((res) => res.data && setInternalSearchResponse(res.data))
      .catch((e) => console.log(e));
  }, [internalSearchValue]);

  useEffect(() => {
    (async () => {
      if (!externalSearchValue) return;
      const options: RequestInit = { method: 'GET' };
      const res = await (
        await fetch(
          `${TMDB_BASE_URL}${searchMovieString}${externalSearchValue.replaceAll(
            ' ',
            '%20'
          )}&${TMDB_API_KEY}`,
          options
        )
      )
        .json()
        .catch((err) => console.log(err));

      setExternalSearchResult(res);
    })();
  }, [externalSearchValue]);

  useEffect(() => {
    if (!externalMovieData || !tmdbGenreList || !tmdbGenreList.genres.length) return;

    tmdbGenreList.genres.forEach((genre) => {
      if (externalMovieData.genre_ids.find((tempIds) => tempIds === genre.id))
        setCategories([...categories, genre.name]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalMovieData]);

  const goBack = useCallback(() => {
    if (indexSection === 3 || indexSection === 4) setIndexSection(0);
    else if (indexSection !== 0) setIndexSection((prop) => prop - 1);
  }, [indexSection]);

  const checkSelectedCategories = useCallback((arrayToCheck: string[], name: string) => {
    if (!arrayToCheck.includes(name)) return '#4c525e';
    return '#fc7ae2';
  }, []);

  const submitExternalUpload = useCallback(async () => {
    if (
      !externalMovieData ||
      !videoFile ||
      !uploadMovieDescriptionRef.current?.value ||
      !uploadMovieTitleRef.current?.value ||
      !uploadMovieReleaseDataRef.current?.value ||
      !uploadMovieImg.current?.src ||
      !uploadMovieBackdrop.current?.src
    )
      return;

    const formData = new FormData();
    formData.append('videoFile', videoFile);
    formData.append('displayPictureUrl', uploadMovieImg.current?.src);
    formData.append('backdropPath', uploadMovieBackdrop.current?.src);
    formData.append('releaseDate', dayjs(uploadMovieReleaseDataRef.current.value).format());
    formData.append('title', uploadMovieTitleRef.current.value);
    formData.append('description', uploadMovieDescriptionRef.current.value);
    formData.append('isPublic', String(true));
    categories.forEach((category) => formData.append('categories', category));
    franchises.forEach((franchise) => formData.append('franchise', franchise));

    const options: RequestInit = { method: 'POST', credentials: 'include', body: formData };

    setIsUploading(true);
    const res: { success: boolean } = await (
      await fetch(`${url}/${rs.video}/${rs.movie}/${rs.create}`, options)
    )
      .json()
      .catch((err) => console.log(err));

    console.log(res);
    setVideoFile(null);
    setIndexSection(0);
    setIsUploading(false);
  }, [categories, franchises, videoFile, externalMovieData]);

  const submitExternalUploadObject = useCallback(async () => {
    if (
      !externalMovieData ||
      !videoFile ||
      !uploadMovieDescriptionRef.current?.value ||
      !uploadMovieTitleRef.current?.value ||
      !uploadMovieReleaseDataRef.current?.value ||
      !uploadMovieImg.current?.src ||
      !uploadMovieBackdrop.current?.src
    )
      return;

    const value = {
      displayPictureUrl: uploadMovieImg.current.src,
      backdropPath: uploadMovieBackdrop.current.src,
      releaseDate: dayjs(uploadMovieReleaseDataRef.current.value).format(),
      title: uploadMovieTitleRef.current.value,
      description: uploadMovieDescriptionRef.current.value,
      isPublic: true,
      categories: categories.map((c) => c),
      franchise: franchises.map((f) => f),
    };

    setIsUploading(true);
    const { data } = await uploadMovieObject(value);
    setLastMovieId(data.movieId);
  }, [categories, franchises, videoFile, externalMovieData]);

  useEffect(() => {
    if (lastMovieId) console.log(lastMovieId);
  }, [lastMovieId]);

  const uploadChunk = useCallback(
    async (readerEvent: ProgressEvent<FileReader>) => {
      if (
        !videoFile ||
        !uploadMovieTitleRef.current?.value ||
        !readerEvent.target?.result ||
        currentChunkIndex === null
      )
        return;

      const data = readerEvent.target.result;
      const params = new URLSearchParams();
      params.set('name', String(videoFile.name));
      params.set('movieId', String(lastMovieId));
      params.set('size', String(videoFile.size));
      params.set('currentChunkIndex', String(currentChunkIndex));
      params.set('totalChunks', String(Math.ceil(videoFile.size / chunkSize)));
      const headers = { 'Content-Type': 'application/octet-stream' };

      try {
        await uploadMovieChunk<{ success: true; movieId: string }>(
          `${protocol}://${host}:${port}/${rs.video}/${rs.movie}/${
            rs.upload
          }/file?${params.toString()}`,
          data,
          headers
        );

        const chunks = Math.ceil(videoFile.size / chunkSize) - 1;
        const isLastChunk = currentChunkIndex === chunks;
        if (!isLastChunk) setCurrentChunkIndex(currentChunkIndex + 1);
        else {
          setCurrentChunkIndex(null);
          setVideoFile(null);
          setIndexSection(0);
          setIsUploading(false);

          generateFFmpeg(lastMovieId)
            .finally(() => setIsUploading(false))
            .then((result) => {
              if (result.data.success) setLastMovieId('');
            })
            .catch((error) => console.log(error));
        }
      } catch (error) {
        console.log(error);
      }
    },
    [currentChunkIndex, lastMovieId, videoFile]
  );

  const readAndUploadCurrentChunk = useCallback(() => {
    const reader = new FileReader();
    if (!videoFile || currentChunkIndex === null) return;
    const from = Number(currentChunkIndex) * chunkSize;
    const to = from + chunkSize;
    reader.onload = (e) => uploadChunk(e);
    reader.readAsDataURL(videoFile.slice(from, to));
  }, [videoFile, currentChunkIndex, uploadChunk]);

  useEffect(() => {
    if (currentChunkIndex !== null) readAndUploadCurrentChunk();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChunkIndex]);

  const submitInternalUpdate = useCallback(async () => {
    const [movieTitle, displayPicture, backdrop, descriptor, date] = [
      updateMovieTitle?.current?.value,
      updateMovieDisplayPicture?.current?.value,
      updateMovieBackdrop?.current?.value,
      updateMovieDescription?.current?.value,
      updateMovieUploadDate?.current?.value,
    ];
    if (!movieTitle && !displayPicture && !backdrop && !descriptor && !date) return;
    if (!updateMovieTitle?.current?.id) return;

    setIsUploading(true);
    updateMovieDate<{ success: boolean }>({
      title: movieTitle || undefined,
      displayPicture: displayPicture || undefined,
      backdropPath: backdrop || undefined,
      description: descriptor || undefined,
      releaseDate: date || undefined,
      videoId: updateMovieTitle.current.id,
    })
      .then(() => {
        // console.log(res);
        setIndexSection(0);
        setIsUploading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  const internalSearchSection = useCallback(
    () => (
      <div className="search-section">
        <div className="search-input-section">
          <button type="button" className="goBackIcon" onClick={goBack}>
            <GoBack />
          </button>
          <input
            onChange={(e) => setInternalSearchValue(e.target.value)}
            value={internalSearchValue}
            className="search-input"
            type="text"
            name=""
            id=""
            placeholder="TMDB Search Query"
          />
          <div className="goBackIcon" />
        </div>
        <div className="search-result-section">
          {internalSearchResponse &&
            internalSearchResponse.map((movie) => (
              <button
                type="button"
                className="search-result"
                key={movie._id}
                onClick={() => {
                  getMovieData(movie._id)
                    .then((res) => {
                      if (res.status === 200) setInternalMovieData(res.data);
                      setIndexSection(4);
                    })
                    .catch((err) => console.log(err));
                }}
              >
                <img src={movie.displayPicture} alt={movie.title} />
              </button>
            ))}
        </div>
      </div>
    ),
    [internalSearchResponse, internalSearchValue, goBack]
  );

  const externalSearchSection = useCallback(
    () => (
      <React.Fragment>
        <div className="search-section">
          <div className="search-input-section">
            <button type="button" className="goBackIcon" onClick={goBack}>
              <GoBack />
            </button>
            <input
              onChange={(e) => setExternalSearchValue(e.target.value)}
              value={externalSearchValue}
              className="search-input"
              type="text"
              name=""
              id=""
              placeholder="TMDB Search Query"
            />
            <div className="goBackIcon" />
          </div>
          <div className="search-result-section">
            {externalSearchResult?.results.length &&
              externalSearchResult.results.map((tmdbData) => (
                <button
                  key={tmdbData.id}
                  type="button"
                  className="search-result"
                  onClick={() => {
                    console.log(tmdbData);
                    setExternalMovieData(tmdbData);
                    setIndexSection(2);
                  }}
                >
                  <img
                    src={`${TMDB_IMAGE_URL}${tmdbData.poster_path}`}
                    alt={`${tmdbData.title}-img`}
                  />
                  <div className="search-result-checkmate" />
                </button>
              ))}
          </div>
        </div>
      </React.Fragment>
    ),
    [externalSearchResult?.results, externalSearchValue, goBack]
  );

  const renderProgressButton = useCallback(() => {
    if (!videoFile || !isUploading || currentChunkIndex === null) return <p>Submit</p>;

    let progress = 0;
    const chunks = Math.ceil(videoFile.size / chunkSize);
    progress = Math.round((Number(currentChunkIndex) / chunks) * 100);

    return (
      <div
        className={`progress ${progress === 100 ? 'done' : ''}`}
        style={{ width: `${progress}%` }}
      >
        {progress}%
      </div>
    );
  }, [currentChunkIndex, isUploading, videoFile]);

  const uploadMovieSection = useCallback(() => {
    if (!externalMovieData) return undefined;

    const { title, id, overview, release_date, poster_path, backdrop_path } = externalMovieData;

    return (
      <div className="upload-movie-section">
        <div className="title-section">
          <button type="button" className="goBackIcon" onClick={goBack}>
            <GoBack />
          </button>
          <div>
            <label htmlFor={String(id)}>Name:</label>
            <input
              className="name-input"
              type="text"
              name=""
              id={String(id)}
              ref={uploadMovieTitleRef}
              defaultValue={title}
              placeholder="TMDB Search Query"
            />
          </div>

          <div className="submit-button-div">
            <button
              type="submit"
              className="submit-button"
              disabled={!!isUploading}
              onClick={async () => {
                if (videoFile) {
                  await submitExternalUploadObject();
                  setCurrentChunkIndex(0);
                }
              }}
            >
              {renderProgressButton()}
            </button>
          </div>
        </div>
        <div className="info-section">
          <div className="image-section">
            <img
              ref={uploadMovieImg}
              src={`${TMDB_IMAGE_URL}${poster_path}`}
              alt={`${title}-img`}
              className="img-vertical"
            />
            <img
              ref={uploadMovieBackdrop}
              src={`${TMDB_IMAGE_URL}${backdrop_path}`}
              alt={`${title}-img`}
              className="img-horizontal"
            />

            <label htmlFor="description-input">description</label>
            <textarea
              className="description-input"
              id="description-input"
              defaultValue={overview}
              ref={uploadMovieDescriptionRef}
              maxLength={descriptionMaxLength}
            />
          </div>
          <div className="video-info-section">
            <div className="video-file-div">
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
            <div className="date-section">
              <label htmlFor="ReleaseData">Release Data</label>
              <input
                type="date"
                name="ReleaseData"
                id="ReleaseData"
                accept="video/*"
                defaultValue={dayjs().format(release_date).split('T')[0]}
                ref={uploadMovieReleaseDataRef}
                className="title-input"
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
                        style={{
                          backgroundColor: checkSelectedCategories(categories, category.name),
                          margin: '5px',
                          display: 'flex',
                          transition: 'all 250ms',
                          userSelect: 'none',
                          borderRadius: '12px',
                        }}
                      >
                        <input
                          className="checkbox"
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
              <div className="parent">
                <h4>Franchises</h4>
                <div className="categories-and-franchise">
                  {allFranchise &&
                    allFranchise.map((franchise) => (
                      <div
                        key={franchise._id}
                        className="single-categories-and-franchise"
                        style={{
                          backgroundColor: checkSelectedCategories(franchises, franchise.name),
                          margin: '5px',
                          display: 'flex',
                          transition: 'all 250ms',
                          userSelect: 'none',
                          borderRadius: '12px',
                        }}
                      >
                        <input
                          className="checkbox"
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
            </div>
          </div>
        </div>
      </div>
    );
  }, [
    allCategories,
    allFranchise,
    categories,
    checkSelectedCategories,
    submitExternalUploadObject,
    externalMovieData,
    franchises,
    goBack,
    isUploading,
    renderProgressButton,
    videoFile,
  ]);

  const updateMovieSection = useCallback(() => {
    if (!internalMovieData) return undefined;

    const { _id } = internalMovieData;

    const [tempCategory, tempFranchise] = [
      internalMovieData.categories,
      internalMovieData.franchise,
    ];

    return (
      <div className="upload-movie-section">
        <div className="title-section">
          <button type="button" className="goBackIcon" onClick={goBack}>
            <GoBack />
          </button>
          <div>
            <label htmlFor={String(_id)}>Name:</label>
            <input
              className="name-input"
              type="text"
              name=""
              id={String(_id)}
              ref={updateMovieTitle}
              defaultValue=""
              placeholder="TMDB Search Query"
            />
          </div>

          <div className="submit-button-div">
            <button
              type="submit"
              className="submit-button"
              disabled={!!isUploading}
              onClick={submitInternalUpdate}
            >
              {!isUploading ? <p>Submit</p> : <div className="submit-button-loader" />}
            </button>
          </div>
        </div>
        <div className="info-section">
          <div className="video-info-section">
            <div className="video-file-div">
              <label htmlFor="videoFile">Display Picture</label>
              <input
                type="text"
                name="displayPicture"
                id="displayPicture"
                defaultValue=""
                accept="video/*"
                className="title-input"
                ref={updateMovieDisplayPicture}
              />
            </div>
            <div className="video-file-div">
              <label htmlFor="videoFile">Backdrop URL</label>
              <input
                type="text"
                name="backdropPath"
                id="backdropPath"
                defaultValue=""
                accept="video/*"
                className="title-input"
                ref={updateMovieBackdrop}
              />
            </div>

            <textarea
              className="description-input"
              id="description-input"
              defaultValue=""
              ref={updateMovieDescription}
              maxLength={descriptionMaxLength}
            />

            <div className="date-section">
              <label htmlFor="ReleaseData">Release Data</label>
              <input
                type="date"
                name="ReleaseData"
                id="ReleaseData"
                accept="video/*"
                defaultValue=""
                ref={updateMovieUploadDate}
                className="title-input"
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
                        style={{
                          backgroundColor: checkSelectedCategories(tempCategory, category.name),
                          margin: '5px',
                          display: 'flex',
                          transition: 'all 250ms',
                          userSelect: 'none',
                          borderRadius: '12px',
                        }}
                      >
                        <input
                          className="checkbox"
                          type="checkbox"
                          name="category"
                          value={category.name}
                          id={category._id}
                          onChange={() => {
                            if (!tempCategory.includes(category.name))
                              setCategories([...tempCategory, category.name]);
                            else setCategories(tempCategory.filter((c) => c !== category.name));
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
                        style={{
                          backgroundColor: checkSelectedCategories(tempFranchise, franchise.name),
                          margin: '5px',
                          display: 'flex',
                          transition: 'all 250ms',
                          userSelect: 'none',
                          borderRadius: '12px',
                        }}
                      >
                        <input
                          className="checkbox"
                          type="checkbox"
                          name="franchise"
                          value={franchise.name}
                          id={franchise._id}
                          onChange={() => {
                            if (!tempFranchise.includes(franchise.name))
                              setFranchises([...tempFranchise, franchise.name]);
                            else setFranchises(tempFranchise.filter((c) => c !== franchise.name));
                          }}
                        />
                        <label htmlFor={franchise._id}>{franchise.name}</label>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }, [
    allCategories,
    allFranchise,
    checkSelectedCategories,
    submitInternalUpdate,
    goBack,
    internalMovieData,
    isUploading,
  ]);

  const startSection = useCallback(
    () => (
      <React.Fragment>
        <button
          id="internal-search-button"
          type="button"
          className="action-button"
          onClick={() => setIndexSection(3)}
        >
          <p>&#128269;</p>
        </button>
        <button
          id="external-search-button"
          type="button"
          className="action-button"
          onClick={() => setIndexSection(1)}
        >
          <p>&#43;</p>
        </button>
      </React.Fragment>
    ),
    []
  );

  return (
    <div className="movie-upload-container">
      <div className="movie-upload-section">
        {indexSection === 0 ? startSection() : <React.Fragment />}
        {indexSection === 1 ? externalSearchSection() : <React.Fragment />}
        {indexSection === 2 ? uploadMovieSection() : <React.Fragment />}
        {indexSection === 3 ? internalSearchSection() : <React.Fragment />}
        {indexSection === 4 ? updateMovieSection() : <React.Fragment />}
      </div>
    </div>
  );
}
