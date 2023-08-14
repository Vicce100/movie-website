/* eslint-disable camelcase */
/* eslint-disable react/jsx-no-useless-fragment */
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';

import {
  CategorySchemaType,
  FranchiseSchemaType,
  MovieSchemaType,
  TMDB_API_KEY,
  TMDB_BASE_URL,
  TMDB_IMAGE_URL,
  returnVideosArray,
  searchMovieString,
  routesString as rs,
  getMovieGenre,
} from '../../../utils/types';
import {
  deleteMovie,
  generateFFmpeg,
  getMovieData,
  getMoviesInfinityScroll,
  searchMoviesInfinityScroll,
  updateMovieDate,
  uploadMovieChunk,
  uploadMovieObject,
} from '../../../services/videoService';
import {
  getAllCategory,
  getAllFranchise,
  host,
  port,
  protocol,
} from '../../../services/apiService';
import { usePageTitle } from '../../../hooks';

import { ReactComponent as GoBack } from '../../../asset/svg/left-arrow-white.svg';

import '../styles/Movies.scss';

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

type internalUpdateDataType = {
  title: string;
  creditsDurationInMs: number;
  isPublic: boolean;
  categories: string[];
  franchise: string[];
  description: string;
  releaseDate: string;
  displayPictureUrl: string;
  backdropPath: string;
};

type tmdbGenreType = { genres: { id: number; name: string }[] };

const chunkSize = 40 * 1024;

export default function Movies() {
  const [indexSection, setIndexSection] = useState<number>(0);
  const [searchResponse, setSearchResponse] = useState<returnVideosArray | undefined>(undefined);

  const [movieData, setMovieData] = useState<MovieSchemaType | null>(null);
  const [internalUpdateData, setInternalUpdateData] = useState<internalUpdateDataType | null>(null);
  const [externalMovieData, setExternalMovieData] = useState<tmdbEpisodeData | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(20);

  const [searchString, setSearchString] = useState('');
  const [TMDBSearchString, setTMDBSearchString] = useState('');
  const [TMDBSearchResult, setTMDBSearchResult] = useState<tmdbMovieSearchResult>(null);

  const [tmdbGenreList, setTmdbGenreList] = useState<tmdbGenreType | null>(null);
  const [allCategories, setAllCategories] = useState<CategorySchemaType[] | null>(null);
  const [allFranchise, setAllFranchise] = useState<FranchiseSchemaType[] | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [franchises, setFranchises] = useState<string[]>([]);

  const [currentChunkIndex, setCurrentChunkIndex] = useState<null | number>(null);
  const [lastMovieId, setLastMovieId] = useState<string>('');

  const [searchParams, setSearchParams] = useSearchParams({
    searchId: '',
    page: String(0),
    limit: String(20),
    indexSection: String(0),
    TMDBSearchString: '',
  });

  const creditsDuration = useRef<HTMLInputElement | null>(null);

  /*
  searchParams.set('contentId', video._id);
  setSearchParams(searchParams);
  */

  const { setPageTitle } = usePageTitle();

  useEffect(() => setPageTitle('Upload Video'), [setPageTitle]);

  const goBack = useCallback(() => {
    if (TMDBSearchString) searchParams.set('TMDBSearchString', '');
    if (searchParams.get('searchId')) searchParams.set('searchId', '');

    if (indexSection === 2) searchParams.set('indexSection', String(0));
    else if (indexSection !== 0) searchParams.set('indexSection', String(indexSection - 1));
    setSearchParams(searchParams);
  }, [TMDBSearchString, indexSection, searchParams, setSearchParams]);

  const checkSelectedCategories = useCallback((arrayToCheck: string[], name: string) => {
    if (!arrayToCheck.includes(name)) return '#4c525e';
    return '#fc7ae2';
  }, []);

  useEffect(() => {
    const pageParameter = searchParams.get('page');
    const indexSectionParameter = searchParams.get('indexSection');
    const TMDBSearchStringParameter = searchParams.get('TMDBSearchString');

    setPage(pageParameter ? Number(pageParameter) : 0);
    setIndexSection(indexSectionParameter ? Number(indexSectionParameter) : 0);
    setTMDBSearchString(TMDBSearchStringParameter || '');
  }, [searchParams]);

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

  useEffect(
    () => () => {
      const searchId = searchParams.get('searchId');
      if (searchId) return;
      getMoviesInfinityScroll({
        skip: page,
        limit: limit,
      })
        .then((response) => setSearchResponse(response.data))
        .catch((error) => console.error(error));
    },
    [page, searchParams, limit]
  );

  useEffect(() => {
    const searchId = searchParams.get('searchId');
    if (!searchId) return;
    searchMoviesInfinityScroll({
      skip: page,
      limit: 20,
      searchId,
    })
      .then((response) => setSearchResponse(response.data))
      .catch((error) => console.error(error));
  }, [searchParams, page]);

  const fetchMovieData = useCallback(async (movieId: string) => {
    try {
      const response = await getMovieData(movieId);
      setMovieData(response.data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    (async () => {
      if (!TMDBSearchString) return;
      const options: RequestInit = { method: 'GET' };
      const res = await (
        await fetch(
          `${TMDB_BASE_URL}${searchMovieString}${TMDBSearchString.replaceAll(
            ' ',
            '%20'
          )}&${TMDB_API_KEY}`,
          options
        )
      )
        .json()
        .catch((err) => console.log(err));

      setTMDBSearchResult(res);
    })();
  }, [TMDBSearchString]);

  useEffect(() => {
    if (!externalMovieData || !tmdbGenreList || !tmdbGenreList.genres.length) return;

    tmdbGenreList.genres.forEach((genre) => {
      if (externalMovieData.genre_ids.find((tempIds) => tempIds === genre.id))
        setCategories([...categories, genre.name]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalMovieData]);

  // Upload Movie Start

  const submitExternalUploadObject = useCallback(async () => {
    if (!externalMovieData || !creditsDuration.current?.value) return;
    const {
      backdrop_path,
      overview: description,
      poster_path,
      title,
      release_date,
    } = externalMovieData;

    const value = {
      displayPictureUrl: poster_path,
      backdropPath: backdrop_path,
      releaseDate: dayjs().format(dayjs().format(release_date).split('T')[0]),
      title,
      description,
      creditsDurationInMs: creditsDuration.current.value || 480000,
      isPublic: true,
      categories: categories.map((c) => c),
      franchise: franchises.map((f) => f),
    };

    setIsUploading(true);
    const { data } = await uploadMovieObject(value);
    setLastMovieId(data.movieId);
  }, [categories, externalMovieData, franchises]);

  useEffect(() => {
    if (lastMovieId) console.log(lastMovieId);
  }, [lastMovieId]);

  const uploadChunk = useCallback(
    async (readerEvent: ProgressEvent<FileReader>) => {
      if (
        !videoFile ||
        !externalMovieData ||
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
          searchParams.set('indexSection', String(0));
          searchParams.set('TMDBSearchString', '');
          setExternalMovieData(null);
          setCategories([]);
          setFranchises([]);
          setSearchParams(searchParams);
          setIsUploading(false);

          generateFFmpeg(lastMovieId)
            .then((result) => console.log(result.data))
            .catch((error) => console.log(error));
        }
      } catch (error) {
        console.log(error);
      }
    },
    [currentChunkIndex, externalMovieData, lastMovieId, searchParams, setSearchParams, videoFile]
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

  // Upload Movie End

  const startSection = useCallback(
    () => (
      <React.Fragment>
        <div className="movies-tools-parent">
          <div className="movies-tools">
            <button type="button" className="svgIcon" onClick={goBack} disabled>
              <GoBack />
            </button>
            <p>|</p>
            <p>movies</p>
            <p>|</p>
            <input
              className="name-input"
              type="text"
              value={searchString}
              placeholder="Search"
              onChange={(e) => {
                setSearchString(e.target.value);
                searchParams.set('searchId', e.target.value);
                setSearchParams(searchParams);
              }}
            />
          </div>
          <button
            type="button"
            className="add-movie-button"
            onClick={() => {
              searchParams.set('indexSection', String(2));
              setSearchParams(searchParams);
            }}
          >
            <p className="add-movie-text">&#43;</p>
          </button>
        </div>
        <div className="movies-list">
          {searchResponse &&
            searchResponse.map((movie) => (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
              <div
                className="single-movie"
                key={movie._id}
                onClick={async () => {
                  await fetchMovieData(movie._id);
                  setInternalUpdateData({
                    title: '',
                    creditsDurationInMs: 0,
                    isPublic: true,
                    categories: [],
                    franchise: [],
                    description: '',
                    releaseDate: '',
                    displayPictureUrl: '',
                    backdropPath: '',
                  });
                  searchParams.set('indexSection', String(1));
                  setSearchParams(searchParams);
                }}
              >
                <img
                  src={movie.displayPicture}
                  alt={movie.title}
                  className="single-movie-img"
                  loading="lazy"
                />
              </div>
            ))}

          <div className="scroll-section">
            <div className="center-scroll">
              <button
                className="scroll-button"
                type="button"
                disabled={page === 0}
                onClick={() => {
                  searchParams.set('page', String(page - 1));
                  setSearchParams(searchParams);
                }}
              >
                <p>&#8592;</p>
              </button>
              <button className="scroll-button" type="button">
                <p>&#43;</p>
              </button>
              <button
                className="scroll-button"
                type="button"
                disabled={searchResponse && searchResponse?.length < 20}
                onClick={() => {
                  searchParams.set('page', String(page + 1));
                  setSearchParams(searchParams);
                }}
              >
                <p>&#8594;</p>
              </button>
            </div>
          </div>
        </div>
      </React.Fragment>
    ),
    [fetchMovieData, goBack, page, searchParams, searchResponse, searchString, setSearchParams]
  );

  const renderProgressButton = useCallback(() => {
    if (!videoFile || !isUploading || currentChunkIndex === null)
      return <p className="submit-text">submit</p>;

    let progress = 0;
    const chunks = Math.ceil(videoFile.size / chunkSize);
    progress = Math.round((currentChunkIndex / chunks) * 100);

    return (
      <div
        className={`progress ${progress === 100 ? 'done' : ''}`}
        style={{ width: `${progress}%` }}
      >
        <p>{progress}%</p>
      </div>
    );
  }, [currentChunkIndex, isUploading, videoFile]);

  const updateMovie = useCallback(async () => {
    if (!movieData) return;
    setIsUploading(true);

    updateMovieDate<{ success: boolean }>({
      title: internalUpdateData?.title || undefined,
      creditsDurationInMs: internalUpdateData?.creditsDurationInMs || undefined,
      isPublic: internalUpdateData?.isPublic || undefined,
      categories: categories.length ? categories.map((c) => c) : undefined,
      franchise: franchises.length ? franchises.map((f) => f) : undefined,
      description: internalUpdateData?.description || undefined,
      releaseDate: internalUpdateData?.releaseDate || undefined,
      displayPictureUrl: internalUpdateData?.displayPictureUrl || '',
      backdropPath: internalUpdateData?.backdropPath || '',
      videoId: movieData._id,
    })
      .then(() => {
        searchParams.set('searchId', '');
        setIndexSection(0);
        setMovieData(null);
        setInternalUpdateData(null);
        setCategories([]);
        setFranchises([]);
        setSearchParams(searchParams);
        setIsUploading(false);
      })
      .catch((err) => console.log(err));
  }, [movieData, internalUpdateData, categories, franchises, searchParams, setSearchParams]);

  const modifyMovie = useCallback(() => {
    if (!movieData || !internalUpdateData) {
      searchParams.set('indexSection', String(0));
      setSearchParams(searchParams);
      return <React.Fragment />;
    }
    return (
      // internalUpdateData
      <React.Fragment>
        <form style={{ overflowY: 'auto', overflowX: 'hidden', width: '100%' }} action="upload">
          <div className="movies-tools-parent">
            <div className="movies-tools">
              <button type="button" className="svgIcon" onClick={goBack}>
                <GoBack />
              </button>
              <p>|</p>
              <p>movies</p>
              <p>|</p>
              <input
                className="name-input"
                type="text"
                name=""
                id="name"
                onChange={(e) => {
                  setInternalUpdateData((props) => {
                    const value = props || internalUpdateData;
                    return { ...value, title: e.target.value };
                  });
                }}
                value={internalUpdateData.title || ''}
                placeholder={movieData.title}
              />
            </div>
            <button
              type="button"
              className="submit-button delete-button"
              disabled={!!isUploading}
              onClick={() => deleteMovie(movieData._id)}
            >
              <p className="submit-text">Delete</p>
            </button>
            <button
              type="button"
              className="submit-button"
              disabled={!!isUploading}
              onClick={updateMovie}
            >
              {!isUploading ? (
                <p className="submit-text">submit</p>
              ) : (
                <div className="submit-button-loader" />
              )}
            </button>
          </div>

          <div className="movies-list">
            <div className="inputs-fields-section">
              <div className="inputs-fields-div">
                <div className="switch-div-box">
                  <h1 className="switch-header-text left">Private</h1>
                  <input
                    className="switch-input"
                    type="checkbox"
                    name="switch-input"
                    id="switch-input"
                    checked={internalUpdateData.isPublic}
                    onChange={(e) => {
                      setInternalUpdateData((props) => {
                        const value = props || internalUpdateData;
                        return { ...value, isPublic: e.target.checked };
                      });
                    }}
                  />
                  <label htmlFor="switch-input" />
                  <h1 className="switch-header-text right">Public</h1>
                </div>
                <div className="single-input-field">
                  <label htmlFor="creditsDuration">Credits Duration In Milliseconds</label>
                  <input
                    className="text-input-field"
                    type="text"
                    name="creditsDuration"
                    id="creditsDuration"
                    value={internalUpdateData.creditsDurationInMs}
                    onChange={(e) => {
                      setInternalUpdateData((props) => {
                        const value = props || internalUpdateData;
                        return { ...value, creditsDurationInMs: Number(e.target.value) };
                      });
                    }}
                    placeholder={String(movieData.creditsDurationInMs)}
                  />
                </div>
                <div className="single-input-field">
                  <label htmlFor="releaseDate"> Release Date</label>
                  <input
                    type="date"
                    name="releaseDate"
                    id="releaseDate"
                    accept="video/*"
                    value={internalUpdateData.releaseDate}
                    className="text-input-field"
                    onChange={(e) => {
                      setInternalUpdateData((props) => {
                        const value = props || internalUpdateData;
                        return { ...value, releaseDate: e.target.value };
                      });
                    }}
                  />
                </div>
                <div className="single-input-field">
                  <label htmlFor="description-input">Description</label>
                  <textarea
                    className="description-input"
                    id="description-input"
                    value={internalUpdateData.description}
                    onChange={(e) => {
                      setInternalUpdateData((props) => {
                        const value = props || internalUpdateData;
                        return { ...value, description: e.target.value };
                      });
                    }}
                    placeholder={movieData.description}
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
                            style={{
                              backgroundColor: checkSelectedCategories(
                                internalUpdateData.categories,
                                category.name
                              ),
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
                                if (!internalUpdateData.categories.includes(category.name))
                                  setInternalUpdateData({
                                    ...internalUpdateData,
                                    categories: [...internalUpdateData.categories, category.name],
                                  });
                                else
                                  setInternalUpdateData({
                                    ...internalUpdateData,
                                    categories: internalUpdateData.categories.filter(
                                      (c) => c !== category.name
                                    ),
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
                            style={{
                              backgroundColor: checkSelectedCategories(
                                internalUpdateData.franchise,
                                franchise.name
                              ),
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
                                if (!internalUpdateData.franchise.includes(franchise.name))
                                  setInternalUpdateData({
                                    ...internalUpdateData,
                                    franchise: [...internalUpdateData.franchise, franchise.name],
                                  });
                                else
                                  setInternalUpdateData({
                                    ...internalUpdateData,
                                    franchise: internalUpdateData.franchise.filter(
                                      (f) => f !== franchise.name
                                    ),
                                  });
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
            <div className="controller-fields-section">
              <div className="image-section">
                <img
                  src={internalUpdateData.displayPictureUrl}
                  alt={`${movieData.title}-poster_path`}
                  className="img-vertical"
                />
                <div className="input-holder">
                  <p>Poster Image</p>
                  <input
                    className="name-input"
                    type="text"
                    name="poster_path"
                    id="poster_path"
                    onChange={(e) => {
                      setInternalUpdateData((props) => {
                        const value = props || internalUpdateData;
                        return { ...value, displayPictureUrl: e.target.value };
                      });
                    }}
                    value={internalUpdateData.displayPictureUrl}
                    placeholder={movieData.displayPicture}
                  />
                </div>
                <img
                  src={internalUpdateData.backdropPath}
                  alt={`${movieData.title}-backdrop_path`}
                  className="img-horizontal"
                />
                <div className="input-holder">
                  <p>Backdrop Image</p>
                  <input
                    className="name-input"
                    type="text"
                    name="backdrop_path"
                    id="backdrop_path"
                    onChange={(e) => {
                      setInternalUpdateData((props) => {
                        const value = props || internalUpdateData;
                        return { ...value, backdropPath: e.target.value };
                      });
                    }}
                    value={internalUpdateData.backdropPath}
                    placeholder={movieData.backdropPath}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </React.Fragment>
    );
  }, [
    allCategories,
    allFranchise,
    checkSelectedCategories,
    goBack,
    internalUpdateData,
    isUploading,
    movieData,
    searchParams,
    setSearchParams,
    updateMovie,
  ]);

  const TMDBMovieSearch = useCallback(
    () => (
      <React.Fragment>
        <div className="movies-tools-parent">
          <div className="movies-tools">
            <button type="button" className="svgIcon" onClick={goBack}>
              <GoBack />
            </button>
            <p>|</p>
            <p>movies</p>
            <p>|</p>
            <input
              className="name-input"
              type="text"
              value={TMDBSearchString}
              placeholder="Search"
              onChange={(e) => {
                searchParams.set('TMDBSearchString', e.target.value);
                setSearchParams(searchParams);
              }}
            />
          </div>
        </div>
        {TMDBSearchResult && (
          <div className="movies-list">
            {TMDBSearchResult.results.length &&
              TMDBSearchResult.results.map((tmdbData) => (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                <div
                  className="single-movie"
                  key={tmdbData.id}
                  onClick={() => {
                    setExternalMovieData({
                      ...tmdbData,
                      poster_path: `${TMDB_IMAGE_URL}${tmdbData.poster_path}`,
                      backdrop_path: `${TMDB_IMAGE_URL}${tmdbData.backdrop_path}`,
                    });
                    searchParams.set('indexSection', String(3));
                    setSearchParams(searchParams);
                  }}
                >
                  <img
                    src={`${TMDB_IMAGE_URL}${tmdbData.poster_path}`}
                    alt={`${tmdbData.title}-img`}
                    className="single-movie-img"
                    loading="lazy"
                  />
                </div>
              ))}
          </div>
        )}
      </React.Fragment>
    ),
    [TMDBSearchResult, TMDBSearchString, goBack, searchParams, setSearchParams]
  );

  const movieUpload = useCallback(() => {
    if (!externalMovieData) {
      searchParams.set('indexSection', String(2));
      setSearchParams(searchParams);
      return <React.Fragment />;
    }

    const { title, id, overview, release_date, poster_path, backdrop_path } = externalMovieData;
    return (
      <React.Fragment>
        <form
          style={{ overflowY: 'auto', overflowX: 'hidden', width: '100%' }}
          action="upload"
          onSubmit={submitExternalUploadObject}
        >
          <div className="movies-tools-parent">
            <div className="movies-tools">
              <button type="button" className="svgIcon" onClick={goBack}>
                <GoBack />
              </button>
              <p>|</p>
              <p>movies</p>
              <p>|</p>
              <input
                className="name-input"
                type="text"
                name=""
                id={`${String(id)}-name`}
                onChange={(e) => {
                  setExternalMovieData((props) => {
                    const value = props || externalMovieData;
                    return { ...value, title: e.target.value };
                  });
                }}
                value={title}
                placeholder="Title"
              />
            </div>
            <button
              type="button"
              className="submit-button"
              disabled={!!isUploading || !videoFile}
              onClick={async () => {
                await submitExternalUploadObject();
                setCurrentChunkIndex(0);
              }}
            >
              {renderProgressButton()}
            </button>
          </div>

          <div className="movies-list">
            <div className="inputs-fields-section">
              <div className="inputs-fields-div">
                <div className="switch-div-box">
                  <h1 className="switch-header-text left">Private</h1>
                  <input
                    className="switch-input"
                    type="checkbox"
                    name="switch-input"
                    id="switch-input"
                    onChange={(e) => setIsPublic(e.target.checked)}
                    defaultChecked={isPublic}
                  />
                  <label htmlFor="switch-input" />
                  <h1 className="switch-header-text right">Public</h1>
                </div>
                <div className="single-input-field">
                  <label htmlFor="videoFile">Video File</label>
                  <input
                    type="file"
                    name="videoFile"
                    id="videoFile"
                    accept="video/*"
                    className="video-file-input text-input-field"
                    onChange={(e) => setVideoFile(e.target.files && e.target.files[0])}
                  />
                </div>
                <div className="single-input-field">
                  <label htmlFor="creditsDuration">Credits Duration In Milliseconds</label>
                  <input
                    className="text-input-field"
                    type="text"
                    name="creditsDuration"
                    id="creditsDuration"
                    ref={creditsDuration}
                    defaultValue={480000}
                  />
                </div>
                <div className="single-input-field">
                  <label htmlFor="releaseDate"> Release Date</label>
                  <input
                    type="date"
                    name="releaseDate"
                    id="releaseDate"
                    accept="video/*"
                    value={release_date}
                    className="text-input-field"
                    onChange={(e) => {
                      setExternalMovieData((props) => {
                        const value = props || externalMovieData;
                        return { ...value, releaseDate: e.target.value };
                      });
                    }}
                  />
                </div>
                <div className="single-input-field">
                  <label htmlFor="description-input">Description</label>
                  <textarea
                    className="description-input"
                    id="description-input"
                    value={overview}
                    onChange={(e) => {
                      setExternalMovieData((props) => {
                        const value = props || externalMovieData;
                        return { ...value, overview: e.target.value };
                      });
                    }}
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
            <div className="controller-fields-section">
              <div className="image-section">
                <img src={poster_path} alt={`${title}-poster_path`} className="img-vertical" />
                <div className="input-holder">
                  <p>Poster Image</p>
                  <input
                    className="name-input"
                    type="text"
                    name="poster_path"
                    id="poster_path"
                    onChange={(e) => {
                      setExternalMovieData((props) => {
                        const value = props || externalMovieData;
                        return { ...value, poster_path: e.target.value };
                      });
                    }}
                    value={poster_path}
                    placeholder="poster_path"
                  />
                </div>
                <img
                  src={backdrop_path}
                  alt={`${title}-backdrop_path`}
                  className="img-horizontal"
                />
                <div className="input-holder">
                  <p>Backdrop Image</p>
                  <input
                    className="name-input"
                    type="text"
                    name="backdrop_path"
                    id="backdrop_path"
                    onChange={(e) => {
                      setExternalMovieData((props) => {
                        const value = props || externalMovieData;
                        return { ...value, backdrop_path: e.target.value };
                      });
                    }}
                    value={backdrop_path}
                    placeholder="backdrop_path"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </React.Fragment>
    );
  }, [
    externalMovieData,
    submitExternalUploadObject,
    goBack,
    isUploading,
    videoFile,
    renderProgressButton,
    isPublic,
    allCategories,
    allFranchise,
    searchParams,
    setSearchParams,
    checkSelectedCategories,
    categories,
    franchises,
  ]);

  return (
    <section className="movies-base-section">
      <div className="movie-base-child">
        {indexSection === 0 ? startSection() : <React.Fragment />}
        {indexSection === 1 ? modifyMovie() : <React.Fragment />}
        {indexSection === 2 ? TMDBMovieSearch() : <React.Fragment />}
        {indexSection === 3 ? movieUpload() : <React.Fragment />}
      </div>
    </section>
  );
}
