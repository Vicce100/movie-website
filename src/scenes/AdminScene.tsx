import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { generateFFmpeg } from '../services/index';
import { usePageTitle } from '../hooks/index';
import AddAvatar from '../component/AddAvatar';
import AddCategories from '../component/AddCategories';
import { checkAuthRole } from '../services/userService';
import { useCurrentUserContext } from '../contexts/UserAuth';

import '../styles/AdminStyle.scss';

export default function AdminScene() {
  const [showAddCategories, setShowAddCategories] = useState<boolean>(false);
  const [showAddAvatar, setShowAddAvatar] = useState<boolean>(false);
  const [showVideo, setShowVideo] = useState<boolean>(false);
  const [showFFmpeg, setShowFFmpeg] = useState<boolean>(false);
  const [showAddUser, setShowAddUser] = useState<boolean>(false);

  const [isUploading, setIsUploading] = useState<boolean>(false);

  const ffmpegVideoIdRef = useRef<HTMLInputElement | null>(null);

  const { setPageTitle } = usePageTitle();
  const { currentUser } = useCurrentUserContext();

  const navigate = useNavigate();

  useEffect(() => setPageTitle('Admin'), [setPageTitle]);
  useEffect(() => {
    if (!currentUser || !currentUser.role) navigate('/');
    else {
      const run = async () =>
        !(await checkAuthRole(currentUser.role)).data.access ? navigate('/') : null;
      run();
    }
  }, [currentUser, navigate]);

  const addFFmpeg = useCallback(
    () => (
      <div className="ffmpeg-container">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!ffmpegVideoIdRef.current?.value) return;
            setIsUploading(true);
            generateFFmpeg(ffmpegVideoIdRef.current.value)
              .finally(() => setIsUploading(false))
              .then(({ data }) => {
                if (data.success && ffmpegVideoIdRef.current?.value)
                  ffmpegVideoIdRef.current.value = '';
              });
          }}
        >
          <label htmlFor="ffmpegForm">Video Id</label>
          <input
            type="text"
            name="ffmpeg"
            id="ffmpegForm"
            placeholder="Video Id"
            ref={ffmpegVideoIdRef}
          />
          <button type="submit" disabled={!!isUploading}>
            {!isUploading ? <p>Submit</p> : <div className="submit-video-button-loader" />}
          </button>
        </form>
      </div>
    ),
    [isUploading]
  );

  return (
    <div className="admin-container">
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
          style={{
            border: showAddCategories ? '1px solid #fff' : 'none',
          }}
          type="button"
          className="options-button-box"
          onClick={() => {
            setShowAddCategories(!showAddCategories);
            setShowAddUser(false);
            setShowVideo(false);
            setShowAddAvatar(false);
            setShowFFmpeg(false);
          }}
        >
          <h3 className="options-box-heading">Add categories</h3>
        </button>
        <button
          style={{
            border: showAddAvatar ? '1px solid #fff' : 'none',
          }}
          type="button"
          className="options-button-box"
          onClick={() => {
            setShowAddAvatar(!showAddAvatar);
            setShowAddUser(false);
            setShowVideo(false);
            setShowAddCategories(false);
            setShowFFmpeg(false);
          }}
        >
          <h3 className="options-box-heading">Add Avatars</h3>
        </button>
        <button
          style={{
            border: showVideo ? '1px solid #fff' : 'none',
          }}
          type="button"
          className="options-button-box"
          onClick={() => {
            setShowVideo(!showVideo);
            setShowAddUser(false);
            setShowAddAvatar(false);
            setShowAddCategories(false);
            setShowFFmpeg(false);
          }}
        >
          <h3 className="options-box-heading">Add Video</h3>
        </button>
        <button
          style={{
            border: showFFmpeg ? '1px solid #fff' : 'none',
          }}
          type="button"
          className="options-button-box"
          onClick={() => {
            setShowFFmpeg(!showFFmpeg);
            setShowAddUser(false);
            setShowAddAvatar(false);
            setShowVideo(false);
            setShowAddCategories(false);
          }}
        >
          <h3 className="options-box-heading">Add ffmpeg to video</h3>
        </button>
        <button
          style={{
            border: showAddUser ? '1px solid #fff' : 'none',
          }}
          type="button"
          className="options-button-box"
          onClick={() => {
            setShowAddUser(!showAddUser);
            setShowAddAvatar(false);
            setShowVideo(false);
            setShowAddCategories(false);
            setShowFFmpeg(false);
          }}
        >
          <h3 className="options-box-heading">Add User</h3>
        </button>
      </div>
      <div className="main-section">
        {showAddCategories && <AddCategories />}
        {showAddAvatar && <AddAvatar />}
        {/* {showVideo && <AddVideo />} */}
        {/* {showAddUser && <AddUser />} */}
        {showFFmpeg && addFFmpeg()}
      </div>
    </div>
  );
}
