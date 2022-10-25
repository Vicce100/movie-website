/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useRef, useId, useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { v4 } from 'uuid';

import { useCurrentUserContext, useProfileContext } from '../contexts/UserAuth';
import { EpisodeSchemaType, MovieSchemaType, SeriesSchemaType } from '../utils/types';
import {
  getMovieData,
  getSeriesData,
  addIdToSavedList,
  removeIdFromSavedList,
  getSeriesEpisodes,
} from '../services/videoService';
import { useFormateTime, usePageTitle, useRefreshToken } from '../hooks';

import { ReactComponent as Checked } from '../asset/svg/videoInfo/checked.svg';

import '../styles/VideoInfoStyle.scss';

export default function VideoInfoScene({ isMovieProp = true }: { isMovieProp?: boolean }) {
  const [isMovie, setIsMovie] = useState<boolean | undefined>(undefined);
  const [movieData, setMovieData] = useState<MovieSchemaType | null>(null);
  const [seriesData, setSeriesData] = useState<SeriesSchemaType | null>(null);

  // only for series
  const [seriesEpisodes, setSeriesEpisodes] = useState<EpisodeSchemaType[][]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number>(0);

  const videoInfoContainerRef = useRef<HTMLDivElement | null>(null);

  const { currentUser } = useCurrentUserContext();
  const { activeProfile } = useProfileContext();
  const callRefreshToken = useRefreshToken();

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const { formateInMinutes } = useFormateTime();
  const { setPageTitle } = usePageTitle();
  const id = useId();

  useEffect(() => {
    const setProp = () => {
      if (typeof isMovieProp === 'boolean') setIsMovie(isMovieProp);
    };
    return () => setProp();
  }, [isMovieProp]);

  useEffect(
    () => setPageTitle(movieData?.title || 'video player'),
    [movieData?.title, setPageTitle]
  );

  useEffect(
    () => {
      const callSeries = async (value: string) => {
        try {
          const { data: tempSeriesData } = await getSeriesData(value);
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

      const callMovie = async (value: string) =>
        getMovieData(value)
          .then((res) => (res.status === 200 ? setMovieData(res.data) : null))
          .catch(() => {
            callSeries(value);
            setIsMovie(false);
          });

      const value = searchParams.get('contentId');
      if (typeof isMovie === 'boolean' && isMovie && value) callMovie(value);
      else if (typeof isMovie === 'boolean' && value) callSeries(value);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams, isMovie]
  );

  const addToSavedList = useCallback(
    async (videoId: string, action: 'add' | 'remove') => {
      if (!activeProfile?._id) return;
      if (action === 'add') await addIdToSavedList({ profileId: activeProfile._id, videoId });
      if (action === 'remove')
        await removeIdFromSavedList({ profileId: activeProfile._id, videoId });
      callRefreshToken(currentUser, activeProfile._id);
    },
    [activeProfile?._id, callRefreshToken, currentUser]
  );

  const renderAddToMyListButton = useCallback(() => {
    if (isMovie && activeProfile?.savedList?.find((objectId) => objectId === movieData?._id))
      return <Checked />;
    if (!isMovie && activeProfile?.savedList?.find((objectId) => objectId === seriesData?._id))
      return <Checked />;
    return <p>&#43; {/* &#10004; */}</p>;
  }, [activeProfile?.savedList, isMovie, movieData?._id, seriesData?._id]);

  const renderMovie = useCallback(
    () =>
      movieData && (
        <div className="movie-content-container">
          <div
            tabIndex={0}
            // eslint-disable-next-line jsx-a11y/aria-role
            role="Button"
            className="display-img"
            onClick={(event) => {
              if (document.activeElement?.id && document.activeElement.id === 'display-img-id')
                navigate(`/player/${movieData._id}`, { state: { isMovie: true } });
              event.nativeEvent.stopImmediatePropagation();
            }}
            id="display-img-id"
          >
            <img src={movieData.displayPicture} alt={`${movieData.title}-img:`} />
            <div className="content-header">
              <div className="content-header-div">
                <div className="header-generale-content">
                  <div className="header-play-link">
                    <Link
                      className="header-play-button"
                      to={`/player/${movieData._id}`}
                      state={{ isMovie: true }}
                    >
                      <h2 className="header-play-button-text">Play</h2>
                    </Link>
                  </div>
                  <button
                    type="button"
                    className="add-to-saved-list"
                    onClick={() => {
                      if (activeProfile?.savedList?.find((u) => u === movieData?._id))
                        addToSavedList(movieData._id, 'remove');
                      else addToSavedList(movieData._id, 'add');
                    }}
                    // addToSavedList
                  >
                    {renderAddToMyListButton()}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="header-title-div">
            <h2 className="header-title">{movieData.title}</h2>
          </div>
          <div className="small-info">
            <span className="date">{movieData.releaseDate.split('T')[0]}</span>
            <span className="time">{formateInMinutes(movieData.durationInMs / 1000)}</span>
          </div>
          <span className="description">{movieData.description}</span>
        </div>
      ),
    [
      movieData,
      renderAddToMyListButton,
      formateInMinutes,
      navigate,
      activeProfile?.savedList,
      addToSavedList,
    ]
  );

  const renderSeries = useCallback(
    () =>
      seriesData && (
        <div className="series-content-container">
          <div
            tabIndex={0}
            // eslint-disable-next-line jsx-a11y/aria-role
            role="Button"
            className="display-img"
            onClick={(event) => {
              if (document.activeElement?.id && document.activeElement.id === 'display-img-id')
                navigate(
                  `/player/${
                    seriesEpisodes[0] && seriesEpisodes[0].length
                      ? seriesEpisodes[0][0]._id
                      : seriesData._id
                  }`,
                  { state: { isMovie: false } }
                );
              event.nativeEvent.stopImmediatePropagation();
            }}
            id="display-img-id"
          >
            <img src={seriesData.displayPicture} alt={`${seriesData.title}-img:`} />
            <div className="content-header">
              <div className="content-header-div">
                <div className="header-generale-content">
                  <div className="header-play-link">
                    <Link
                      className="header-play-button"
                      to={`/player/${
                        seriesEpisodes[0] && seriesEpisodes[0].length
                          ? seriesEpisodes[0][0]._id
                          : seriesData._id
                      }`}
                      state={{ isMovie: false }}
                    >
                      <h2 className="header-play-button-text">Play</h2>
                    </Link>
                  </div>
                  <button
                    type="button"
                    className="add-to-saved-list"
                    onClick={() => {
                      if (activeProfile?.savedList?.find((u) => u === seriesData?._id))
                        addToSavedList(seriesData._id, 'remove');
                      else addToSavedList(seriesData._id, 'add');
                    }}
                    // addToSavedList
                  >
                    {renderAddToMyListButton()}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="header-title-div">
            <h2 className="header-title">{seriesData.title}</h2>
          </div>
          <div className="small-info">
            <span className="date">From: {seriesData.creationDate.split('T')[0]}</span>
            <span className="date">To: {seriesData.latestDate.split('T')[0]}</span>
            <span className="time">Sessions: {seriesData.amountOfSessions}</span>
            <span className="time">Episodes: {seriesData.amountOfEpisodes}</span>
          </div>
          <span className="description">{seriesData.description}</span>

          <div className="seasons">
            {seriesEpisodes.map((_episode, index) => (
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
          </div>

          <div className="episodes">
            {seriesEpisodes[selectedSeason] &&
              seriesEpisodes[selectedSeason].map((episode, index) => (
                <Link
                  className="episode-div"
                  key={episode._id}
                  to={`/player/${episode._id}`}
                  state={{ isMovie: false }}
                >
                  <div className="episode-div-header">
                    <div className="text-div">
                      <div className="div" style={{ display: 'flex', flexDirection: 'row' }}>
                        <p className="text episode-index">{index + 1}</p>
                        <p className="text">{episode.episodeTitle}</p>
                      </div>
                      {episode.durationInMs && (
                        <span className="text">
                          {formateInMinutes(episode.durationInMs / 1000)}
                        </span>
                      )}
                    </div>
                    {/* <div className="remaining" /> */}
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
                </Link>
              ))}
          </div>
        </div>
      ),
    [
      seriesData,
      renderAddToMyListButton,
      seriesEpisodes,
      selectedSeason,
      navigate,
      activeProfile?.savedList,
      addToSavedList,
      formateInMinutes,
    ]
  );

  // useEffect(() => {
  //   if (seriesData) {
  //     const a = seriesData.episodes[0][0];
  //     console.log(a.durationInMs);
  //   }
  // }, [seriesData]);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div
      ref={videoInfoContainerRef}
      className="video-info-container"
      id={`${id}-container-ref`}
      tabIndex={0}
      role="button"
      onClick={() => {
        if (!videoInfoContainerRef || !videoInfoContainerRef.current || !document.activeElement)
          return;
        if (videoInfoContainerRef.current.id === document.activeElement.id) {
          if (!searchParams.get('searchId')) setSearchParams('');
          else setSearchParams({ searchId: searchParams.get('searchId') || '' });
        }
      }}
    >
      <div tabIndex={0} role="button" className="main-content">
        {typeof isMovie === 'boolean' && isMovie ? renderMovie() : renderSeries()}
      </div>
    </div>
  );
}
