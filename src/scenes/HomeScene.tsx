/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react/jsx-no-useless-fragment */
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import VideoInfoScene from './VideoInfoScene';
import Header from '../component/Header';

import { usePageTitle, useRefreshToken, useWindowDimensions } from '../hooks/index';
import {
  addIdToLikedList,
  getMovieByCategory,
  getSeriesByCategory,
  getVideosData,
  removeIdFromLikedList,
  removeMovieWatched,
  removeSeriesWatched,
} from '../services/videoService';
import { continueWatchingType, queryPaths, returnVideosArray } from '../utils/types';

import { useCurrentUserContext, useProfileContext } from '../contexts/UserAuth';
import { ReactComponent as Like } from '../asset/svg/like-svgrepo-com.svg';
import { ReactComponent as IsLiked } from '../asset/svg/like-svgrepo-com-white.svg';

import '../styles/HomeSceneStyle.scss';

export default function HomeScene() {
  const [myList, setMyList] = useState<returnVideosArray | null>(null);
  const [continueWatching, setContinueWatching] = useState<continueWatchingType[] | null>(null);
  const [randomMovie, setRandomMovie] = useState<returnVideosArray | null>(null);
  const [randomSeries, setRandomSeries] = useState<returnVideosArray | null>(null);
  const [actionAndAdventure, setActionAndAdventure] = useState<returnVideosArray | null>(null);
  const [superheroActionMovie, setSuperheroActionMovie] = useState<returnVideosArray | null>(null);
  const [romCom, setRomCom] = useState<returnVideosArray | null>(null);
  const [familyWeekEndMovie, setFamilyWeekEndMovie] = useState<returnVideosArray | null>(null);
  const [comedyTvShow, setComedyTvShow] = useState<returnVideosArray | null>(null);
  const [newlyAdded, setNewlyAdded] = useState<returnVideosArray | null>(null);
  const [forYou, setForYou] = useState<returnVideosArray | null>(null);
  const [horrorMovies, setHorrorMovies] = useState<returnVideosArray | null>(null);
  const [teenageMovies, setTeenageMovies] = useState<returnVideosArray | null>(null);

  const [myListPage, setMyListPage] = useState<number>(0);
  const [continueWatchingPage, setContinueWatchingPage] = useState<number>(0);
  const [randomMoviePage, setRandomMoviePage] = useState<number>(0);
  const [randomSeriesPage, setRandomSeriesPage] = useState<number>(0);
  const [actionAndAdventurePage, setActionAndAdventurePage] = useState<number>(0);
  const [superheroActionMoviePage, setSuperheroActionMoviePage] = useState<number>(0);
  const [romComPage, setRomComPage] = useState<number>(0);
  const [familyWeekEndMoviePage, setFamilyWeekEndMoviePage] = useState<number>(0);
  const [comedyTvShowPage, setComedyTvShowPage] = useState<number>(0);
  const [newlyAddedPage, setNewlyAddedPage] = useState<number>(0);
  const [forYouPage, setForYouPage] = useState<number>(0);
  const [horrorMoviesPage, setHorrorMoviesPage] = useState<number>(0);
  const [teenageMoviesPage, setTeenageMoviesPage] = useState<number>(0);

  const [itemPerPage, setItemPerPage] = useState<number>(6);
  const [isMovie, setIsMovie] = useState<boolean>(true);
  const [scrollYOffset, setScrollYOffset] = useState<number>(0);

  const rowVideoContainerRef0 = useRef<HTMLDivElement | null>(null);
  const rowVideoContainerRef1 = useRef<HTMLDivElement | null>(null);
  const rowVideoContainerRef2 = useRef<HTMLDivElement | null>(null);
  const rowVideoContainerRef3 = useRef<HTMLDivElement | null>(null);
  const rowVideoContainerRef4 = useRef<HTMLDivElement | null>(null);
  const rowVideoContainerRef5 = useRef<HTMLDivElement | null>(null);
  const rowVideoContainerRef6 = useRef<HTMLDivElement | null>(null);
  const rowVideoContainerRef7 = useRef<HTMLDivElement | null>(null);
  const rowVideoContainerRef8 = useRef<HTMLDivElement | null>(null);
  const rowVideoContainerRef9 = useRef<HTMLDivElement | null>(null);
  const rowVideoContainerRef10 = useRef<HTMLDivElement | null>(null);
  const rowVideoContainerRef11 = useRef<HTMLDivElement | null>(null);
  const rowVideoContainerRef12 = useRef<HTMLDivElement | null>(null);

  const [searchId, setSearchId] = useSearchParams({ contentId: '' });

  const { width } = useWindowDimensions();
  const { activeProfile } = useProfileContext();
  const { currentUser } = useCurrentUserContext();
  const { setPageTitle } = usePageTitle();
  const refreshToken = useRefreshToken();
  const navigate = useNavigate();

  useEffect(() => setPageTitle('Home'), [setPageTitle, searchId]);

  useEffect(() => {
    if (activeProfile) {
      getVideosData<returnVideosArray>({
        queryName: queryPaths.myList,
        profileId: activeProfile._id,
      })
        .then((res) => (res.status === 200 ? setMyList(res.data) : null))
        .catch((e) => console.log(e));

      getVideosData<continueWatchingType[]>({
        queryName: queryPaths.continueWatching,
        profileId: activeProfile._id,
      })
        .then((res) => (res.status === 200 ? setContinueWatching(res.data) : null))
        .catch((e) => console.log(e));

      getVideosData<returnVideosArray>({
        queryName: queryPaths.forYou,
        profileId: activeProfile._id,
      })
        .then((res) => (res.status === 200 ? setForYou(res.data) : null))
        .catch((e) => console.log(e));
    }
  }, [activeProfile]);

  useEffect(() => {
    getVideosData<returnVideosArray>({ queryName: queryPaths.randomMovie })
      .then((res) => (res.status === 200 ? setRandomMovie(res.data) : null))
      .catch((e) => console.log(e));

    getVideosData<returnVideosArray>({ queryName: queryPaths.randomSeries })
      .then((res) => (res.status === 200 ? setRandomSeries(res.data) : null))
      .catch((e) => console.log(e));

    getVideosData<returnVideosArray>({ queryName: queryPaths.newlyAdded })
      .then((res) => (res.status === 200 ? setNewlyAdded(res.data) : null))
      .catch((e) => console.log(e));

    getMovieByCategory({ categoryNames: ['Action', 'Adventure'] })
      .then((res) => (res.status === 200 ? setActionAndAdventure(res.data) : null))
      .catch((e) => console.log(e));

    getMovieByCategory({ categoryNames: ['Superhero', 'Action'] })
      .then((res) => (res.status === 200 ? setSuperheroActionMovie(res.data) : null))
      .catch((e) => console.log(e));

    getMovieByCategory({ categoryNames: ['Teenage', 'Coming-Of-Age'] })
      .then((res) => (res.status === 200 ? setTeenageMovies(res.data) : null))
      .catch((e) => console.log(e));

    getMovieByCategory({ categoryNames: ['Comedy', 'Romance'], exudeArray: ['Kids'] })
      .then((res) => (res.status === 200 ? setRomCom(res.data) : null))
      .catch((e) => console.log(e));

    getMovieByCategory({ categoryNames: ['Family', 'Kids'] })
      .then((res) => (res.status === 200 ? setFamilyWeekEndMovie(res.data) : null))
      .catch((e) => console.log(e));

    getSeriesByCategory({ categoryNames: ['Comedy', 'TV Show'] })
      .then((res) => (res.status === 200 ? setComedyTvShow(res.data) : null))
      .catch((e) => console.log(e));
    getMovieByCategory({ categoryNames: ['Horror', 'Thriller', 'Mystery'] })
      .then((res) => (res.status === 200 ? setHorrorMovies(res.data) : null))
      .catch((e) => console.log(e));
  }, []);

  // useEffect(() => {
  //   getMovieByCategory({ categoryNames: ['Superhero'] })
  //     .then((res) => (res.status === 200 ? setSuperheroMovies(res.data) : null))
  //     .catch((e) => console.log(e));

  //   getSeriesByCategory({ categoryNames: ['Documentary'] })
  //     .then((res) => (res.status === 200 ? setMiniDocumentary(res.data) : null))
  //     .catch((e) => console.log(e));
  // }, [allCategories]);

  useEffect(() => {
    setTimeout(() => {
      if (width >= 1800) setItemPerPage(9);
      else if (width >= 1400) setItemPerPage(8);
      else if (width >= 800) setItemPerPage(7);
      else if (width >= 500) setItemPerPage(6);
      else if (width >= 360) setItemPerPage(5);
      else setItemPerPage(9);
    }, 250);
  }, [width]);

  const setItemsPerPage = useCallback(
    (ref: React.MutableRefObject<HTMLDivElement | null>) => {
      if (!ref || !ref.current) {
        setTimeout(() => setItemsPerPage(ref), 150);
        return;
      }
      const value = Number(ref.current.style.getPropertyValue('--item-per-page'));
      if (value === itemPerPage) return;
      ref.current.style.setProperty('--item-per-page', String(itemPerPage));
    },
    [itemPerPage]
  );

  useEffect(() => {
    if (rowVideoContainerRef0) setItemsPerPage(rowVideoContainerRef0);
    if (rowVideoContainerRef1) setItemsPerPage(rowVideoContainerRef1);
    if (rowVideoContainerRef2) setItemsPerPage(rowVideoContainerRef2);
    if (rowVideoContainerRef3) setItemsPerPage(rowVideoContainerRef3);
    if (rowVideoContainerRef4) setItemsPerPage(rowVideoContainerRef4);
    if (rowVideoContainerRef5) setItemsPerPage(rowVideoContainerRef5);
    if (rowVideoContainerRef6) setItemsPerPage(rowVideoContainerRef6);
    if (rowVideoContainerRef7) setItemsPerPage(rowVideoContainerRef7);
    if (rowVideoContainerRef8) setItemsPerPage(rowVideoContainerRef8);
    if (rowVideoContainerRef9) setItemsPerPage(rowVideoContainerRef9);
    if (rowVideoContainerRef10) setItemsPerPage(rowVideoContainerRef10);
    if (rowVideoContainerRef11) setItemsPerPage(rowVideoContainerRef11);
    if (rowVideoContainerRef12) setItemsPerPage(rowVideoContainerRef12);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemPerPage]);

  useEffect(() => {
    if (!searchId.get('contentId') && scrollYOffset) window.scrollTo(0, scrollYOffset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchId]);

  useEffect(() => {
    const htmlTag = document.querySelector('html');
    if (!htmlTag) return;
    if (searchId.get('contentId')) htmlTag.style.overflowY = 'hidden';
    else htmlTag.style.overflowY = 'auto';
  }, [searchId]);

  const skipBack = useCallback(
    (
      state: returnVideosArray | null,
      activePage: number,
      setActivePage: React.Dispatch<React.SetStateAction<number>>
    ) => {
      if (!state) return;

      const nrOfPages = state.length / itemPerPage;
      const nrOfPagesArray = String(state.length / itemPerPage).split('.');

      if (activePage === Number(`${Number(nrOfPagesArray[0]) - 1}.${Number(nrOfPagesArray[1])}`))
        setActivePage(Number(nrOfPagesArray[0]) - 1);
      else if (!activePage) setActivePage(nrOfPages - 1);
      else setActivePage(activePage - 1);
    },
    [itemPerPage]
  );

  const skipForward = useCallback(
    (
      state: returnVideosArray | null,
      activePage: number,
      setActivePage: React.Dispatch<React.SetStateAction<number>>
    ) => {
      if (!state) return;
      const nrOfPages = String(state.length / itemPerPage).split('.');

      if (!nrOfPages[1] && activePage === Number(nrOfPages[0]) - 1) setActivePage(0);
      else if (activePage === Number(nrOfPages[0]) - 1)
        setActivePage(Number(`${activePage}.${Number(nrOfPages[1])}`));
      else if (activePage === Number(`${Number(nrOfPages[0]) - 1}.${Number(nrOfPages[1])}`))
        setActivePage(0);
      else setActivePage(activePage + 1);
    },
    [itemPerPage]
  );

  const renderProgressBar = useCallback(
    (queryStateLength: number, activePage: number, stateLength: number) => {
      let numberOfPages = Number(String(queryStateLength / itemPerPage).split('.')[0]);
      if (Number(String(queryStateLength / itemPerPage).split('.')[1])) numberOfPages += 1;
      const value: number[] = [];
      for (let index = 0; index < numberOfPages; index += 1) value.push(index);
      return value.map((index) => (
        <div
          id={String(index === value.at(-1))}
          key={index}
          style={{
            backgroundColor:
              // eslint-disable-next-line no-nested-ternary
              activePage === index
                ? 'rgba(220, 220, 220, 1)'
                : String(index).split('.'[1]) &&
                  stateLength / itemPerPage - 1 === activePage &&
                  index >= Number(String(value).at(-1))
                ? 'rgba(220, 220, 220, 1)'
                : 'rgba(88, 88, 88, 1)',
          }}
          className="progress-bar-div"
        />
      ));
    },
    [itemPerPage]
  );

  type VideoContainerProps = {
    videoArray: returnVideosArray | null;
    videoRef: React.MutableRefObject<HTMLDivElement | null>;
    videoPage: number;
    setVideoPage: React.Dispatch<React.SetStateAction<number>>;
    title: string;
  };

  const renderVideoContainer = useCallback(
    ({ videoArray, videoRef, videoPage, setVideoPage, title = '' }: VideoContainerProps) =>
      videoArray &&
      videoArray.length && (
        <div ref={videoRef} onChange={() => console.log('change')} className="row-video-container">
          <section className="row-header-section">
            <div className="row-header">
              <h2 className="row-header-text">{title}</h2>
            </div>
            <div className="progress-bar">
              {renderProgressBar(videoArray.length, videoPage, videoArray.length)}
            </div>
          </section>
          <div className="row-content">
            <button
              style={{ visibility: videoArray.length < itemPerPage ? 'hidden' : 'visible' }}
              className="handle left-handle"
              type="button"
              onClick={() => skipBack(videoArray, videoPage, setVideoPage)}
            >
              <p />
            </button>
            <div className="slider" style={{ transform: `translateX(-${videoPage * 100}%)` }}>
              {videoArray.map((video) => (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                <div
                  tabIndex={0}
                  role="button"
                  key={video._id}
                  className="single-video"
                  onClick={() => {
                    setIsMovie(video.isMovie);
                    setScrollYOffset(window.scrollY);
                    setSearchId({ contentId: video._id });
                  }}
                >
                  <div className="holder">
                    <img src={video.displayPicture} alt={`${video.title}-img`} loading="lazy" />
                  </div>
                </div>
              ))}
            </div>
            <button
              style={{ visibility: videoArray.length < itemPerPage ? 'hidden' : 'visible' }}
              className="handle right-handle"
              type="button"
              onClick={() => skipForward(videoArray, videoPage, setVideoPage)}
            >
              <p />
            </button>
          </div>
        </div>
      ),
    [renderProgressBar, itemPerPage, skipBack, setSearchId, skipForward]
  );

  const addToLikedList = useCallback(
    async (videoId: string, action: 'add' | 'remove') => {
      if (!activeProfile?._id) return;
      if (action === 'add') await addIdToLikedList({ profileId: activeProfile._id, videoId });
      if (action === 'remove')
        await removeIdFromLikedList({ profileId: activeProfile._id, videoId });
      refreshToken(currentUser, activeProfile._id);
    },
    [activeProfile?._id, currentUser, refreshToken]
  );

  const renderAddToLikedListButton = useCallback(
    (video: continueWatchingType) => {
      if (activeProfile?.likedList?.find((objectId) => objectId === video?._id))
        return <IsLiked style={{ width: '60%' }} />;
      return <Like style={{ width: '60%' }} />;
    },
    [activeProfile?.likedList]
  );

  type ContinueWatchingProps = {
    videoArray: continueWatchingType[] | null;
    videoRef: React.MutableRefObject<HTMLDivElement | null>;
    videoPage: number;
    setVideoPage: React.Dispatch<React.SetStateAction<number>>;
    title: string;
  };

  const renderContinueWatching = useCallback(
    ({ videoArray, videoRef, videoPage, setVideoPage, title = '' }: ContinueWatchingProps) =>
      videoArray && (
        <div ref={videoRef} onChange={() => console.log('change')} className="row-video-container">
          <section className="row-header-section">
            <div className="row-header">
              <h2 className="row-header-text">{title}</h2>
            </div>
            <div className="progress-bar">
              {renderProgressBar(videoArray.length, videoPage, videoArray.length)}
            </div>
          </section>
          <div className="row-content">
            <button
              style={{ visibility: videoArray.length < itemPerPage ? 'hidden' : 'visible' }}
              className="handle left-handle"
              type="button"
              onClick={() => skipBack(videoArray, videoPage, setVideoPage)}
            >
              <p />
            </button>
            <div className="slider" style={{ transform: `translateX(-${videoPage * 100}%)` }}>
              {videoArray.map((video) => (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                <div
                  tabIndex={0}
                  role="button"
                  key={video._id}
                  className="continue-watching-element"
                  id="continue-watching-element-id"
                  onClick={(event) => {
                    if (document.activeElement?.id === 'continue-watching-element-id') {
                      setIsMovie(video.isMovie);
                      setScrollYOffset(window.scrollY);
                      setSearchId({ contentId: video._id });

                      navigate(
                        `/player/${video.episodeId ? video.episodeId : video._id}?T=${
                          video.isMovie ? 'M' : 'E'
                        }`,
                        {}
                      );
                    }
                    event.nativeEvent.stopImmediatePropagation();
                  }}
                >
                  <div className="holder">
                    <img src={video.displayPicture} alt={`${video.title}-img`} loading="lazy" />
                    <div className="placeholder">
                      <div className="info-section">
                        <div className="video-info">
                          {video.isMovie === false ? (
                            <React.Fragment>
                              <p className="info-text">{video.title}</p>
                              <br />
                              <p className="info-text">
                                {video.sessionNr && `S${video.sessionNr}:`}
                                {video.episodeNr && `E${video.episodeNr}`}{' '}
                              </p>
                              <p className="info-text"> &#34;{video.episodeTitle}&#34;</p>
                            </React.Fragment>
                          ) : (
                            <p className="info-text">{video.title}</p>
                          )}
                        </div>
                      </div>
                      <div className="actions">
                        <div className="actions-buttons">
                          <button
                            className="action-button"
                            type="button"
                            id="play-button"
                            onClick={(event) => {
                              if (document.activeElement?.id === 'play-button')
                                navigate(
                                  `/player/${video.episodeId ? video.episodeId : video._id}?T=${
                                    video.isMovie ? 'M' : 'E'
                                  }`
                                );
                              event.nativeEvent.stopImmediatePropagation();
                            }}
                          >
                            &#9658;
                          </button>
                          <button
                            className="action-button"
                            type="button"
                            id="info-button"
                            onClick={(event) => {
                              if (document.activeElement?.id === 'info-button') {
                                setIsMovie(video.isMovie);
                                setScrollYOffset(window.scrollY);
                                setSearchId({ contentId: video._id });
                              }
                              event.nativeEvent.stopImmediatePropagation();
                            }}
                          >
                            &#8505;
                          </button>
                          <button
                            className="action-button"
                            type="button"
                            id="remove-button"
                            onClick={async (event) => {
                              if (
                                activeProfile?._id &&
                                currentUser?.id &&
                                document.activeElement?.id === 'remove-button'
                              ) {
                                if (video.isMovie) {
                                  await removeMovieWatched({
                                    movieId: video._id,
                                    profileId: activeProfile._id,
                                    userId: currentUser.id,
                                  });
                                  await refreshToken(currentUser, activeProfile._id);
                                } else if (!video.isMovie) {
                                  await removeSeriesWatched({
                                    userId: currentUser.id,
                                    profileId: activeProfile._id,
                                    seriesId: video._id,
                                  });
                                  await refreshToken(currentUser, activeProfile._id);
                                }
                              }
                              event.nativeEvent.stopImmediatePropagation();
                            }}
                          >
                            &#10005;
                          </button>
                          <button
                            key="addToLikedList"
                            type="button"
                            className="action-button"
                            onClick={() => {
                              if (activeProfile?.likedList?.find((u) => u === video?._id))
                                addToLikedList(video._id, 'remove');
                              else addToLikedList(video._id, 'add');
                            }}
                          >
                            {renderAddToLikedListButton(video)}
                          </button>
                        </div>
                        <div className="timeline-section">
                          <div className="timeline">
                            <div
                              className="timeline-track"
                              style={{
                                width: `${((video.trackId * 1000) / video.duration) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              style={{ visibility: videoArray.length < itemPerPage ? 'hidden' : 'visible' }}
              className="handle right-handle"
              type="button"
              onClick={() => skipForward(videoArray, videoPage, setVideoPage)}
            >
              <p />
            </button>
          </div>
        </div>
      ),
    [
      renderProgressBar,
      itemPerPage,
      skipBack,
      renderAddToLikedListButton,
      setSearchId,
      navigate,
      activeProfile?._id,
      activeProfile?.likedList,
      currentUser,
      refreshToken,
      addToLikedList,
      skipForward,
    ]
  );

  return (
    <div className="home-container">
      <Header />
      <div
        style={{
          background: searchId.get('contentId')
            ? 'rgba(42, 42, 42, 0.5)'
            : 'linear-gradient(to right,#24262b 0%,#2e3035 20%,#313644 40%,#333945 60%,#2e3035 80%,#24262b 100% )',
        }}
        className="videos-container"
      >
        {renderVideoContainer({
          videoArray: myList,
          videoRef: rowVideoContainerRef0,
          videoPage: myListPage,
          setVideoPage: setMyListPage,
          title: 'My List',
        })}
        {renderContinueWatching({
          videoArray: continueWatching,
          videoRef: rowVideoContainerRef1,
          videoPage: continueWatchingPage,
          setVideoPage: setContinueWatchingPage,
          title: 'Continue Watching',
        })}

        {renderVideoContainer({
          videoArray: randomMovie,
          videoRef: rowVideoContainerRef2,
          videoPage: randomMoviePage,
          setVideoPage: setRandomMoviePage,
          title: 'Random Movies',
        })}

        {renderVideoContainer({
          videoArray: actionAndAdventure,
          videoRef: rowVideoContainerRef3,
          videoPage: actionAndAdventurePage,
          setVideoPage: setActionAndAdventurePage,
          title: 'Action And Adventure',
        })}

        {renderVideoContainer({
          videoArray: newlyAdded,
          videoRef: rowVideoContainerRef4,
          videoPage: newlyAddedPage,
          setVideoPage: setNewlyAddedPage,
          title: 'Newly Added',
        })}

        {renderVideoContainer({
          videoArray: forYou,
          videoRef: rowVideoContainerRef5,
          videoPage: forYouPage,
          setVideoPage: setForYouPage,
          title: 'For You',
        })}

        {renderVideoContainer({
          videoArray: teenageMovies,
          videoRef: rowVideoContainerRef6,
          videoPage: teenageMoviesPage,
          setVideoPage: setTeenageMoviesPage,
          title: 'Teenage & Coming of Age',
        })}

        {renderVideoContainer({
          videoArray: romCom,
          videoRef: rowVideoContainerRef7,
          videoPage: romComPage,
          setVideoPage: setRomComPage,
          title: 'Romantic Comedy',
        })}

        {renderVideoContainer({
          videoArray: horrorMovies,
          videoRef: rowVideoContainerRef8,
          videoPage: horrorMoviesPage,
          setVideoPage: setHorrorMoviesPage,
          title: 'horror Movies',
        })}

        {renderVideoContainer({
          videoArray: randomSeries,
          videoRef: rowVideoContainerRef9,
          videoPage: randomSeriesPage,
          setVideoPage: setRandomSeriesPage,
          title: 'Random Series',
        })}

        {renderVideoContainer({
          videoArray: superheroActionMovie,
          videoRef: rowVideoContainerRef10,
          videoPage: superheroActionMoviePage,
          setVideoPage: setSuperheroActionMoviePage,
          title: 'Superhero Action Movies',
        })}

        {renderVideoContainer({
          videoArray: familyWeekEndMovie,
          videoRef: rowVideoContainerRef11,
          videoPage: familyWeekEndMoviePage,
          setVideoPage: setFamilyWeekEndMoviePage,
          title: 'Family Movie Night',
        })}

        {renderVideoContainer({
          videoArray: comedyTvShow,
          videoRef: rowVideoContainerRef12,
          videoPage: comedyTvShowPage,
          setVideoPage: setComedyTvShowPage,
          title: 'Comedy Show',
        })}
      </div>
      {searchId.get('contentId') && <VideoInfoScene isMovieProp={isMovie} />}
    </div>
  );
}
