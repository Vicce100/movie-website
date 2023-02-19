import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { generateFFmpeg, removeFFmpeg as fetchRemoveFFmpeg } from '../../services/videoService';
import { usePageTitle } from '../../hooks/index';
import { useCurrentUserContext } from '../../contexts/UserAuth';
import { checkAuthRole } from '../../services/userService';

import MovieUpload from './component/MovieUpload';
import CreateSeries from './component/CreateSeries';
import EpisodeUpload from './component/EpisodeUpload';
import AddAvatar from './component/AddAvatar';
import AddCategories from './component/AddCategories';
import AddFranchise from './component/AddFranchise';

import './styles/index.scss';

export default function AdminScene() {
  const [showAddCategories, setShowAddCategories] = useState<boolean>(false);
  const [showAddAvatar, setShowAddAvatar] = useState<boolean>(false);
  const [showFranchise, setShowFranchise] = useState<boolean>(false);
  const [showFFmpeg, setShowFFmpeg] = useState<boolean>(false);
  const [showRemoveFFmpeg, setShowRemoveFFmpeg] = useState<boolean>(false);
  const [showAddUser, setShowAddUser] = useState<boolean>(false);
  const [showMovieUpload, setShowMovieUpload] = useState<boolean>(false);
  const [showCreateSeries, setShowCreateSeries] = useState<boolean>(false);
  const [showAddEpisode, setShowAddEpisode] = useState<boolean>(false);

  const [isUploading, setIsUploading] = useState<boolean>(false);

  const ffmpegVideoIdRef = useRef<HTMLInputElement | null>(null);

  const { setPageTitle } = usePageTitle();
  const { currentUser } = useCurrentUserContext();

  const navigate = useNavigate();

  useEffect(() => setPageTitle('Admin'), [setPageTitle]);
  useEffect(() => {
    if (!currentUser || !currentUser.role) navigate('/');
    else
      (async () => (!(await checkAuthRole(currentUser.role)).data.access ? navigate('/') : null))();
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
              })
              .catch((error) => console.log(error));
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

  const removeFFmpeg = useCallback(
    () => (
      <div className="ffmpeg-container">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!ffmpegVideoIdRef.current?.value) return;
            setIsUploading(true);
            fetchRemoveFFmpeg(ffmpegVideoIdRef.current.value)
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

  const selectField = useCallback(
    // eslint-disable-next-line no-unused-vars
    (setValue: (value: React.SetStateAction<boolean>) => void, value: boolean) => {
      setShowRemoveFFmpeg(false);
      setShowFFmpeg(false);
      setShowFranchise(false);
      setShowAddUser(false);
      setShowAddAvatar(false);
      setShowAddCategories(false);
      setShowMovieUpload(false);
      setShowCreateSeries(false);
      setShowAddEpisode(false);
      setValue(!value);
    },
    []
  );

  type NewType = {
    value: boolean;
    setValue: React.Dispatch<React.SetStateAction<boolean>>;
    title: string;
  };

  const renderButton = useCallback(
    ({ value, setValue, title }: NewType) => (
      <button
        style={{ border: value ? '1px solid #fff' : 'none' }}
        type="button"
        className="options-button-box"
        onClick={() => selectField(setValue, value)}
      >
        <h3 className="options-box-heading">{title}</h3>
      </button>
    ),
    [selectField]
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
        {renderButton({
          value: showMovieUpload,
          setValue: setShowMovieUpload,
          title: 'Upload Movie',
        })}
        {renderButton({
          value: showCreateSeries,
          setValue: setShowCreateSeries,
          title: 'Create Series',
        })}
        {renderButton({
          value: showAddEpisode,
          setValue: setShowAddEpisode,
          title: 'Add Episodes',
        })}
        {renderButton({
          value: showAddCategories,
          setValue: setShowAddCategories,
          title: 'Add Categories',
        })}
        {renderButton({ value: showFranchise, setValue: setShowFranchise, title: 'Add Franchise' })}
        {renderButton({ value: showAddAvatar, setValue: setShowAddAvatar, title: 'Add Avatar' })}
        {renderButton({ value: showFFmpeg, setValue: setShowFFmpeg, title: 'Add FFmpeg Movie' })}
        {renderButton({
          value: showRemoveFFmpeg,
          setValue: setShowRemoveFFmpeg,
          title: 'Remove FFmpeg Movie',
        })}
        {renderButton({ value: showAddUser, setValue: setShowAddUser, title: 'Add User' })}
      </div>
      <div className="main-section">
        {showMovieUpload && <MovieUpload />}
        {showCreateSeries && <CreateSeries />}
        {showAddEpisode && <EpisodeUpload />}
        {showAddCategories && <AddCategories />}
        {showFranchise && <AddFranchise />}
        {showAddAvatar && <AddAvatar />}
        {/* {showAddUser && <AddUser />} */}
        {showFFmpeg && addFFmpeg()}
        {showRemoveFFmpeg && removeFFmpeg()}
      </div>
    </div>
  );
}
