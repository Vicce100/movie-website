/* eslint-disable import/no-unresolved */
import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';

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

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/bundle';

export default function HomeScene() {
  const [allCategories, setAllCategories] = useState<CategorySchemaType[] | null>(null);

  const [actionCategory, setActionCategory] = useState<MovieSchemaType[] | null>(null);
  const [randomMovie, setRandomMovie] = useState<returnVideosArray | null>(null);
  const [romCom, setRomCom] = useState<returnVideosArray | null>(null);

  const [randomMoviePage, setRandomMoviePage] = useState<number>(0);
  const [romComPage, setRomComPage] = useState<number>(0);

  const [itemPerPage, setItemPerPage] = useState<number>(6);

  const rowVideoContainerRef1 = useRef<HTMLDivElement | null>(null);
  const rowVideoContainerRef2 = useRef<HTMLDivElement | null>(null);

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
    (async () => {
      try {
        const { data } = await getVideosData<returnVideosArray>({
          queryName: queryPaths.randomMovie,
        });
        setRandomMovie(data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    const name = allCategories?.find((category) => category.name === 'Action')?.name;
    if (!name) return;
    getMovieByCategory({ categoryNames: [name] })
      .then((res) => (res.status === 200 ? setActionCategory(res.data) : null))
      .catch((e) => console.log(e));
  }, [allCategories]);

  useEffect(() => {
    getMovieByCategory({ categoryNames: ['Comedy', 'Romance'] })
      .then((res) => (res.status === 200 ? setRomCom(res.data) : null))
      .catch((e) => console.log(e));
  }, [allCategories]);

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
    setItemsPerPage(rowVideoContainerRef1);
  }, [itemPerPage, rowVideoContainerRef1, setItemsPerPage]);

  useEffect(() => {
    setItemsPerPage(rowVideoContainerRef2);
  }, [itemPerPage, rowVideoContainerRef2, setItemsPerPage]);

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
                    <Link to={`/player/${movie._id}`}>
                      <img src={movie.displayPicture} alt={movie.title} />
                    </Link>
                  </div>
                ))}
              </div>
              <button
                className="handle right-handle"
                type="button"
                onClick={() => skipForward(randomMovie, randomMoviePage, setRandomMoviePage)}
              >
                <p />
              </button>
            </div>
          </div>
        )}

        {romCom && (
          <div
            ref={rowVideoContainerRef2}
            onChange={() => console.log('change')}
            className="row-video-container"
          >
            <div className="row-header">
              <h2 className="row-header-text">Romantic Comedy</h2>
              <div className="progress-bar">{renderProgressBar(romCom.length, romComPage)}</div>
            </div>
            <div className="row-content">
              <button
                className="handle left-handle"
                type="button"
                onClick={() => skipBack(romCom, romComPage, setRomComPage)}
              >
                <p />
              </button>
              <div className="slider" style={{ transform: `translateX(-${romComPage * 100}%)` }}>
                {romCom.map((movie) => (
                  <div key={movie._id} className="single-video">
                    <Link to={`/player/${movie._id}`}>
                      <img src={movie.displayPicture} alt={movie.title} />
                    </Link>
                  </div>
                ))}
              </div>
              <button
                className="handle right-handle"
                type="button"
                onClick={() => skipForward(romCom, romComPage, setRomComPage)}
              >
                <p />
              </button>
            </div>
          </div>
        )}

        <div className="category-section">
          <div className="category-title">
            <h2 className="category-title-text">My Videos</h2>
          </div>
          <div className="video-element-div">
            <div className="single-video-element" />
            <div className="single-video-element" />
            <div className="single-video-element" />
            <div className="single-video-element" />
          </div>
        </div>
      </div>
    </div>
  );
}
