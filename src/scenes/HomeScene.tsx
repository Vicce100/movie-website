import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Link, /* useLocation, */ useSearchParams } from 'react-router-dom';

import VideoInfoScene from './VideoInfoScene';
import Header from '../component/Header';

import { usePageTitle, useShuffleArray, useWindowDimensions } from '../hooks/index';
import { getMovieByCategory, getSeriesByCategory, getVideosData } from '../services/videoService';
import { queryPaths, returnVideosArray } from '../utils/types';

import { ReactComponent as Plus } from '../asset/svg/plus.svg';

import '../styles/HomeSceneStyle.scss';
import { useProfileContext } from '../contexts/UserAuth';

export default function HomeScene() {
  const [myList, setMyList] = useState<returnVideosArray | null>(null);
  const [randomMovie, setRandomMovie] = useState<returnVideosArray | null>(null);
  const [randomSeries, setRandomSeries] = useState<returnVideosArray | null>(null);
  const [actionAndAdventure, setActionAndAdventure] = useState<returnVideosArray | null>(null);
  const [romCom, setRomCom] = useState<returnVideosArray | null>(null);
  const [familyWeekEndMovie, setFamilyWeekEndMovie] = useState<returnVideosArray | null>(null);
  const [comedyTvShow, setComedyTvShow] = useState<returnVideosArray | null>(null);

  const [myListPage, setMyListPage] = useState<number>(0);
  const [randomMoviePage, setRandomMoviePage] = useState<number>(0);
  const [randomSeriesPage, setRandomSeriesPage] = useState<number>(0);
  const [actionAndAdventurePage, setActionAndAdventurePage] = useState<number>(0);
  const [romComPage, setRomComPage] = useState<number>(0);
  const [familyWeekEndMoviePage, setFamilyWeekEndMoviePage] = useState<number>(0);
  const [comedyTvShowPage, setComedyTvShowPage] = useState<number>(0);

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

  const [searchId, setSearchId] = useSearchParams({ contentId: '' });

  // const location = useLocation();
  const { width } = useWindowDimensions();
  const { activeProfile } = useProfileContext();
  const { setPageTitle } = usePageTitle();
  const shuffleArray = useShuffleArray();

  useEffect(() => setPageTitle('Home'), [setPageTitle, searchId]);

  useEffect(() => {
    if (activeProfile)
      getVideosData<returnVideosArray>({
        queryName: queryPaths.myList,
        profileId: activeProfile._id,
      })
        .then((res) => (res.status === 200 ? setMyList(shuffleArray(res.data)) : null))
        .catch((e) => console.log(e));
  }, [activeProfile, shuffleArray]);

  useEffect(() => {
    getVideosData<returnVideosArray>({ queryName: queryPaths.randomMovie })
      .then((res) => (res.status === 200 ? setRandomMovie(res.data) : null))
      .catch((e) => console.log(e));

    getVideosData<returnVideosArray>({ queryName: queryPaths.randomSeries })
      .then((res) => (res.status === 200 ? setRandomSeries(res.data) : null))
      .catch((e) => console.log(e));

    getMovieByCategory({ categoryNames: ['Action', 'Adventure'] })
      .then((res) => (res.status === 200 ? setActionAndAdventure(res.data) : null))
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
  }, []);

  // useEffect(() => {
  //   console.log(location);
  // }, [location]);

  // useEffect(() => {
  //   getMovieByCategory({ categoryNames: ['Superhero'] })
  //     .then((res) => (res.status === 200 ? setSuperheroMovies(res.data) : null))
  //     .catch((e) => console.log(e));

  //   getSeriesByCategory({ categoryNames: ['Documentary'] })
  //     .then((res) => (res.status === 200 ? setMiniDocumentary(res.data) : null))
  //     .catch((e) => console.log(e));

  //   getSeriesByCategory({ categoryNames: ['Teenage'] })
  //     .then((res) => (res.status === 200 ? setTeenageSeries(res.data) : null))
  //     .catch((e) => console.log(e));
  // }, [allCategories]);

  useEffect(() => {
    if (width >= 1800) setItemPerPage(8);
    else if (width >= 1500) setItemPerPage(7);
    else if (width >= 1200) setItemPerPage(6);
    else if (width >= 1000) setItemPerPage(5);
    else if (width >= 800) setItemPerPage(4);
    else if (width >= 500) setItemPerPage(3);
    else if (width >= 360) setItemPerPage(2);
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
  }, [
    itemPerPage,
    rowVideoContainerRef0,
    rowVideoContainerRef1,
    rowVideoContainerRef2,
    rowVideoContainerRef3,
    rowVideoContainerRef4,
    rowVideoContainerRef5,
    rowVideoContainerRef6,
    setItemsPerPage,
  ]);

  useEffect(() => {
    if (!searchId.get('contentId') && scrollYOffset) window.scrollTo(0, scrollYOffset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchId]);

  const skipBack = useCallback(
    (
      state: returnVideosArray | null,
      activePage: number,
      setActivePage: React.Dispatch<React.SetStateAction<number>>
    ) => {
      if (!state) return;
      const nrOfPages = String(state.length / itemPerPage).split('.');
      if (activePage) setActivePage(activePage - 1);
      else if (!Number(nrOfPages[1])) setActivePage(Number(nrOfPages[0]) - 1);
      else setActivePage(Number(nrOfPages[0]));
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
      const number = Number(nrOfPages[1]) ? 0 : 1;
      if (activePage === Number(nrOfPages[0]) - number) setActivePage(0);
      else setActivePage(activePage + 1);
    },
    [itemPerPage]
  );

  const renderProgressBar = useCallback(
    (queryStateLength: number, activePage: number) => {
      let numberOfPages = Number(String(queryStateLength / itemPerPage).split('.')[0]);
      if (Number(String(queryStateLength / itemPerPage).split('.')[1])) numberOfPages += 1;
      const value: number[] = [];
      for (let index = 0; index < numberOfPages; index += 1) value.push(index);
      return value.map((index) => (
        <div
          key={index}
          style={{
            backgroundColor:
              activePage === index ? 'rgba(220, 220, 220, 1)' : 'rgba(88, 88, 88, 1)',
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
      videoArray && (
        <div ref={videoRef} onChange={() => console.log('change')} className="row-video-container">
          <div className="row-header">
            <h2 className="row-header-text">{title}</h2>
            <div className="progress-bar">{renderProgressBar(videoArray.length, videoPage)}</div>
          </div>
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
              {videoArray.map((video, index) => {
                if (
                  video._id ===
                    'this-is-my-list-1-this-is-my-list-2-this-is-my-list-3-this-is-my-list-4' &&
                  index === 0
                )
                  return (
                    <Link
                      key={`${video._id}-first-element-in-my-list`}
                      className="add-video-element"
                      to="/upload/video"
                    >
                      <Plus />
                    </Link>
                  );
                return (
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
                    <img src={video.displayPicture} alt={`${video.title}-img`} />
                  </div>
                );
              })}
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

  return (
    <div className="home-container">
      <Header />
      <div
        style={{
          background: searchId.get('contentId')
            ? 'rgba(42, 42, 42, 0.5)'
            : 'linear-gradient(to right, #31343a 0%, #52555d 20%, #43495c 40%, #4a4e57 60%, #3b3e47 80%, #31343a 100% )',
          position: searchId.get('contentId') ? 'fixed' : 'relative',
        }}
        className="videos-container"
      >
        {myList &&
          renderVideoContainer({
            videoArray: [
              {
                _id: 'this-is-my-list-1-this-is-my-list-2-this-is-my-list-3-this-is-my-list-4',
                title: '',
                isMovie: true,
                displayPicture: '',
              },
              ...myList,
            ],
            videoRef: rowVideoContainerRef0,
            videoPage: myListPage,
            setVideoPage: setMyListPage,
            title: 'My List',
          })}

        {renderVideoContainer({
          videoArray: randomMovie,
          videoRef: rowVideoContainerRef1,
          videoPage: randomMoviePage,
          setVideoPage: setRandomMoviePage,
          title: 'Random Movies',
        })}

        {renderVideoContainer({
          videoArray: randomSeries,
          videoRef: rowVideoContainerRef6,
          videoPage: randomSeriesPage,
          setVideoPage: setRandomSeriesPage,
          title: 'Random Series',
        })}

        {renderVideoContainer({
          videoArray: actionAndAdventure,
          videoRef: rowVideoContainerRef2,
          videoPage: actionAndAdventurePage,
          setVideoPage: setActionAndAdventurePage,
          title: 'Action And Adventure',
        })}

        {renderVideoContainer({
          videoArray: comedyTvShow,
          videoRef: rowVideoContainerRef3,
          videoPage: comedyTvShowPage,
          setVideoPage: setComedyTvShowPage,
          title: 'Comedy Show',
        })}

        {renderVideoContainer({
          videoArray: romCom,
          videoRef: rowVideoContainerRef4,
          videoPage: romComPage,
          setVideoPage: setRomComPage,
          title: 'Romantic Comedy',
        })}

        {renderVideoContainer({
          videoArray: familyWeekEndMovie,
          videoRef: rowVideoContainerRef5,
          videoPage: familyWeekEndMoviePage,
          setVideoPage: setFamilyWeekEndMoviePage,
          title: 'Family Movie Night',
        })}
      </div>
      {searchId.get('contentId') && <VideoInfoScene isMovieProp={isMovie} />}
    </div>
  );
}
