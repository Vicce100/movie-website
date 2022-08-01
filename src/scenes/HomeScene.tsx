/* eslint-disable import/no-unresolved */
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { ReactComponent as Plus } from '../asset/svg/plus.svg';

import { usePageTitle, useWindowDimensions } from '../hooks/index';
import Header from '../component/Header';
import { getAllCategory } from '../services';
import { getMovieByCategory, getSeriesByCategory, getVideosData } from '../services/videoService';
import {
  CategorySchemaType,
  MovieSchemaType,
  queryPaths,
  returnVideosArray,
  SeriesSchemaType,
} from '../utils/types';

import '../styles/HomeSceneStyle.scss';

export default function HomeScene() {
  const [allCategories, setAllCategories] = useState<CategorySchemaType[] | null>(null);

  const [actionCategory, setActionCategory] = useState<MovieSchemaType[] | null>(null);
  const [randomMovie, setRandomMovie] = useState<returnVideosArray | null>(null);
  const [actionAndAdventure, setActionAndAdventure] = useState<returnVideosArray | null>(null);
  const [romCom, setRomCom] = useState<returnVideosArray | null>(null);
  const [familyWeekEndMovie, setFamilyWeekEndMovie] = useState<returnVideosArray | null>(null);

  const [randomMoviePage, setRandomMoviePage] = useState<number>(0);
  const [actionAndAdventurePage, setActionAndAdventurePage] = useState<number>(0);
  const [romComPage, setRomComPage] = useState<number>(0);
  const [familyWeekEndMoviePage, setFamilyWeekEndMoviePage] = useState<number>(0);

  const [itemPerPage, setItemPerPage] = useState<number>(6);

  const rowVideoContainerRef1 = useRef<HTMLDivElement | null>(null);
  const rowVideoContainerRef2 = useRef<HTMLDivElement | null>(null);
  const rowVideoContainerRef3 = useRef<HTMLDivElement | null>(null);
  const rowVideoContainerRef4 = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();
  const { width } = useWindowDimensions();
  const { setPageTitle } = usePageTitle();

  useEffect(() => setPageTitle('Home'), [setPageTitle]);

  useEffect(() => {
    getAllCategory()
      .then((res) => (res.status === 200 ? setAllCategories(res.data) : null))
      .catch((e) => console.log(e));
  }, []);

  useEffect(() => {
    const name = allCategories?.find((category) => category.name === 'Action')?.name;
    if (!name) return;
    getMovieByCategory({ categoryNames: [name] })
      .then((res) => (res.status === 200 ? setActionCategory(res.data) : null))
      .catch((e) => console.log(e));
  }, [allCategories]);

  useEffect(() => {
    getVideosData<returnVideosArray>({ queryName: queryPaths.randomMovie })
      .then((res) => (res.status === 200 ? setRandomMovie(res.data) : null))
      .catch((e) => console.log(e));

    getMovieByCategory({ categoryNames: ['Action', 'Adventure'] })
      .then((res) => (res.status === 200 ? setActionAndAdventure(res.data) : null))
      .catch((e) => console.log(e));

    getMovieByCategory({ categoryNames: ['Comedy', 'Romance'] })
      .then((res) => (res.status === 200 ? setRomCom(res.data) : null))
      .catch((e) => console.log(e));

    getMovieByCategory({ categoryNames: ['Family', 'Kids'] })
      .then((res) => (res.status === 200 ? setFamilyWeekEndMovie(res.data) : null))
      .catch((e) => console.log(e));
  }, []);

  // useEffect(() => {
  //   getMovieByCategory({ categoryNames: ['Superhero'] })
  //     .then((res) => (res.status === 200 ? setSuperheroMovies(res.data) : null))
  //     .catch((e) => console.log(e));
  // }, [allCategories]);

  // useEffect(() => {
  //   getSeriesByCategory({ categoryNames: ['Documentary'] })
  //     .then((res) => (res.status === 200 ? setMiniDocumentary(res.data) : null))
  //     .catch((e) => console.log(e));
  // }, [allCategories]);

  // useEffect(() => {
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
    if (rowVideoContainerRef1) setItemsPerPage(rowVideoContainerRef1);
    if (rowVideoContainerRef2) setItemsPerPage(rowVideoContainerRef2);
    if (rowVideoContainerRef3) setItemsPerPage(rowVideoContainerRef3);
    if (rowVideoContainerRef4) setItemsPerPage(rowVideoContainerRef4);
  }, [
    itemPerPage,
    rowVideoContainerRef1,
    rowVideoContainerRef2,
    rowVideoContainerRef3,
    rowVideoContainerRef4,
    setItemsPerPage,
  ]);

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

  return (
    <div className="home-container">
      <Header />
      <div className="videos-container">
        <div className="category-section">
          <div className="category-title">
            <h2 className="category-title-text">My Videos</h2>
          </div>
          <div className="video-element-div">
            <button
              type="button"
              className="add-video-element"
              onClick={() => navigate('/upload/video')}
            >
              <Plus />
            </button>
            <div className="single-video-element" />
            <div className="single-video-element" />
            <div className="single-video-element" />
          </div>
        </div>

        {randomMovie && (
          <div
            ref={rowVideoContainerRef1}
            onChange={() => console.log('change')}
            className="row-video-container"
          >
            <div className="row-header">
              <h2 className="row-header-text">Random Movies</h2>
              <div className="progress-bar">
                {renderProgressBar(randomMovie.length, randomMoviePage)}
              </div>
            </div>
            <div className="row-content">
              <button
                style={{ visibility: randomMovie.length < itemPerPage ? 'hidden' : 'visible' }}
                className="handle left-handle"
                type="button"
                onClick={() => skipBack(randomMovie, randomMoviePage, setRandomMoviePage)}
              >
                <p />
              </button>
              <div
                className="slider"
                style={{ transform: `translateX(-${randomMoviePage * 100}%)` }}
              >
                {randomMovie.map((movie) => (
                  <div key={movie._id} className="single-video">
                    <Link to={`/player/${movie._id}`} state={{ isMovie: true }}>
                      <img src={movie.displayPicture} alt={movie.title} />
                    </Link>
                  </div>
                ))}
              </div>
              <button
                style={{ visibility: randomMovie.length < itemPerPage ? 'hidden' : 'visible' }}
                className="handle right-handle"
                type="button"
                onClick={() => skipForward(randomMovie, randomMoviePage, setRandomMoviePage)}
              >
                <p />
              </button>
            </div>
          </div>
        )}

        {actionAndAdventure && (
          <div
            ref={rowVideoContainerRef2}
            onChange={() => console.log('change')}
            className="row-video-container"
          >
            <div className="row-header">
              <h2 className="row-header-text">Action And Adventure</h2>
              <div className="progress-bar">
                {renderProgressBar(actionAndAdventure.length, actionAndAdventurePage)}
              </div>
            </div>
            <div className="row-content">
              <button
                style={{
                  visibility: actionAndAdventure.length < itemPerPage ? 'hidden' : 'visible',
                }}
                className="handle left-handle"
                type="button"
                onClick={() =>
                  skipBack(actionAndAdventure, actionAndAdventurePage, setActionAndAdventurePage)
                }
              >
                <p />
              </button>
              <div
                className="slider"
                style={{ transform: `translateX(-${actionAndAdventurePage * 100}%)` }}
              >
                {actionAndAdventure.map((movie) => (
                  <div key={movie._id} className="single-video">
                    <Link to={`/player/${movie._id}`} state={{ isMovie: true }}>
                      <img src={movie.displayPicture} alt={movie.title} />
                    </Link>
                  </div>
                ))}
              </div>
              <button
                style={{
                  visibility: actionAndAdventure.length < itemPerPage ? 'hidden' : 'visible',
                }}
                className="handle right-handle"
                type="button"
                onClick={() =>
                  skipForward(actionAndAdventure, actionAndAdventurePage, setActionAndAdventurePage)
                }
              >
                <p />
              </button>
            </div>
          </div>
        )}

        {romCom && (
          <div
            ref={rowVideoContainerRef3}
            onChange={() => console.log('change')}
            className="row-video-container"
          >
            <div className="row-header">
              <h2 className="row-header-text">Romantic Comedy</h2>
              <div className="progress-bar">{renderProgressBar(romCom.length, romComPage)}</div>
            </div>
            <div className="row-content">
              <button
                style={{ visibility: romCom.length < itemPerPage ? 'hidden' : 'visible' }}
                className="handle left-handle"
                type="button"
                onClick={() => skipBack(romCom, romComPage, setRomComPage)}
              >
                <p />
              </button>
              <div className="slider" style={{ transform: `translateX(-${romComPage * 100}%)` }}>
                {romCom.map((movie) => (
                  <div key={movie._id} className="single-video">
                    <Link to={`/player/${movie._id}`} state={{ isMovie: true }}>
                      <img src={movie.displayPicture} alt={movie.title} />
                    </Link>
                  </div>
                ))}
              </div>
              <button
                style={{ visibility: romCom.length < itemPerPage ? 'hidden' : 'visible' }}
                className="handle right-handle"
                type="button"
                onClick={() => skipForward(romCom, romComPage, setRomComPage)}
              >
                <p />
              </button>
            </div>
          </div>
        )}

        {familyWeekEndMovie && (
          <div
            ref={rowVideoContainerRef4}
            onChange={() => console.log('change')}
            className="row-video-container"
          >
            <div className="row-header">
              <h2 className="row-header-text">Week End Family Movies</h2>
              <div className="progress-bar">
                {renderProgressBar(familyWeekEndMovie.length, familyWeekEndMoviePage)}
              </div>
            </div>
            <div className="row-content">
              <button
                style={{
                  visibility: familyWeekEndMovie.length < itemPerPage ? 'hidden' : 'visible',
                }}
                className="handle left-handle"
                type="button"
                onClick={() =>
                  skipBack(familyWeekEndMovie, familyWeekEndMoviePage, setFamilyWeekEndMoviePage)
                }
              >
                <p />
              </button>
              <div
                className="slider"
                style={{ transform: `translateX(-${familyWeekEndMoviePage * 100}%)` }}
              >
                {familyWeekEndMovie.map((movie) => (
                  <div key={movie._id} className="single-video">
                    <Link to={`/player/${movie._id}`} state={{ isMovie: true }}>
                      <img src={movie.displayPicture} alt={movie.title} />
                    </Link>
                  </div>
                ))}
              </div>
              <button
                style={{
                  visibility: familyWeekEndMovie.length < itemPerPage ? 'hidden' : 'visible',
                }}
                className="handle right-handle"
                type="button"
                onClick={() =>
                  skipForward(familyWeekEndMovie, familyWeekEndMoviePage, setFamilyWeekEndMoviePage)
                }
              >
                <p />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
