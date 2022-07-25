/* eslint-disable import/no-unresolved */
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';

import { ReactComponent as Plus } from '../asset/svg/plus.svg';

import { usePageTitle, useWindowDimensions } from '../hooks/index';
import Header from '../component/Header';
import { getAllCategory } from '../services';
import { getMovieByCategory, getSeriesByCategory } from '../services/videoService';
import { CategorySchemaType, MovieSchemaType, SeriesSchemaType } from '../utils/types';

import '../styles/HomeSceneStyle.scss';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/bundle';

export default function HomeScene() {
  const [allCategories, setAllCategories] = useState<CategorySchemaType[] | null>(null);
  const [actionCategory, setActionCategory] = useState<MovieSchemaType[] | null>(null);

  const navigate = useNavigate();
  const { width } = useWindowDimensions();
  const { setPageTitle } = usePageTitle();

  const swiperSlidesPerView = useMemo(() => Number(String(width / 400).split('.')[0]), [width]);

  useEffect(() => setPageTitle('Home'), [setPageTitle]);

  useEffect(() => {
    getAllCategory()
      .then((res) => (res.status === 200 ? setAllCategories(res.data) : null))
      .catch((e) => console.log(e));
  }, []);

  useEffect(() => {
    const name = allCategories?.find((category) => category.name === 'Action')?.name;
    if (!name) return;
    getMovieByCategory({ categoryName1: name })
      .then((res) => (res.status === 200 ? setActionCategory(res.data) : null))
      .catch((e) => console.log(e));
  }, [allCategories]);

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

        <div className="category-section">
          <div className="category-title">
            <h2 className="category-title-text">Action</h2>
          </div>
          <Swiper
            slidesPerView={swiperSlidesPerView || 1}
            slidesPerGroup={swiperSlidesPerView || 1}
            spaceBetween={0}
            pagination={{ clickable: true }}
            navigation
            modules={[Navigation]}
            className="video-element-div"
          >
            {actionCategory &&
              actionCategory.map((movie) => {
                if (!movie) return null;
                return (
                  <SwiperSlide key={String(movie._id)} className="swiper-slide">
                    <button
                      type="button"
                      className="single-video-element"
                      onClick={() => navigate(`/player/${movie._id}`, { state: { isMovie: true } })}
                    >
                      <img className="avatar-img" src={movie.displayPicture} alt={movie.title} />
                    </button>
                  </SwiperSlide>
                );
              })}
          </Swiper>
        </div>

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
