import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../component/Header';
import { ReactComponent as Plus } from '../svg/plus.svg';

import '../styles/HomeSceneStyle.scss';

export default function HomeScene() {
  const navigate = useNavigate();
  return (
    <div className="home-container">
      <Header />
      <div className="video-container">
        <div className="category-section">
          <div className="category-title">
            <h2 className="category-title-text">My Videos</h2>
          </div>
          <div className="video-element-div">
            <button
              type="button"
              className="add-video-element"
              onClick={() => navigate('/UploadVideo')}
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
