import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { generateFFmpeg, removeFFmpeg as fetchRemoveFFmpeg } from '../../services/videoService';
import { usePageTitle } from '../../hooks/index';
import { useCurrentUserContext } from '../../contexts/UserAuth';
import { checkAuthRole } from '../../services/userService';

import Movies from './component/Movies';
import MovieUpload from './component/MovieUpload';
import CreateSeries from './component/CreateSeries';
import EpisodeUpload from './component/EpisodeUpload';
import AddAvatar from './component/AddAvatar';
import AddCategories from './component/AddCategories';
import AddFranchise from './component/AddFranchise';

import './styles/index.scss';

// queryStringVariable | QSV
const QSV = {
  showRemoveFFmpeg: 'showRemoveFFmpeg' as const,
  showFFmpeg: 'showFFmpeg' as const,
  showFranchise: 'showFranchise' as const,
  showAddUser: 'showAddUser' as const,
  showAddAvatar: 'showAddAvatar' as const,
  showAddCategories: 'showAddCategories' as const,
  showMovieUpload: 'showMovieUpload' as const,
  showMovies: 'showMovies' as const,
  showCreateSeries: 'showCreateSeries' as const,
  showAddEpisode: 'showAddEpisode' as const,
};

export default function AdminScene() {
  const [currentQueryString, setCurrentQueryString] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const ffmpegVideoIdRef = useRef<HTMLInputElement | null>(null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setPageTitle } = usePageTitle();
  const { currentUser } = useCurrentUserContext();

  useEffect(() => setPageTitle('Admin'), [setPageTitle]);
  useEffect(() => setCurrentQueryString(searchParams.get('operation')), [searchParams]);

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

  type NewType = {
    queryString:
      | 'showRemoveFFmpeg'
      | 'showFFmpeg'
      | 'showFranchise'
      | 'showAddUser'
      | 'showAddAvatar'
      | 'showAddCategories'
      | 'showMovieUpload'
      | 'showMovies'
      | 'showCreateSeries'
      | 'showAddEpisode'
      | null;
    title: string;
  };

  const renderButton = useCallback(
    ({ queryString, title }: NewType) => (
      <button
        style={{ border: currentQueryString === queryString ? '1px solid #fff' : 'none' }}
        type="button"
        className="options-button-box"
        onClick={() => {
          if (searchParams.get('operation') === queryString) navigate(`/Admin/`);
          else navigate(`/Admin/?operation=${queryString}`);
        }}
      >
        <h3 className="options-box-heading">{title}</h3>
      </button>
    ),
    [currentQueryString, navigate, searchParams]
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
        {renderButton({ queryString: QSV.showMovies, title: 'Movies' })}
        {renderButton({ queryString: QSV.showMovieUpload, title: 'Upload Movie' })}
        {renderButton({ queryString: QSV.showCreateSeries, title: 'Create Series' })}
        {renderButton({ queryString: QSV.showAddEpisode, title: 'Add Episodes' })}
        {renderButton({ queryString: QSV.showAddCategories, title: 'Add Categories' })}
        {renderButton({ queryString: QSV.showFranchise, title: 'Add Franchise' })}
        {renderButton({ queryString: QSV.showAddAvatar, title: 'Add Avatar' })}
        {renderButton({ queryString: QSV.showFFmpeg, title: 'Add FFmpeg Movie' })}
        {renderButton({ queryString: QSV.showRemoveFFmpeg, title: 'Remove FFmpeg Movie' })}
        {/* {renderButton({ queryString: QSV.showAddUser, title: 'Add User' })} */}
      </div>
      <div className="main-section">
        {currentQueryString === QSV.showMovies && <Movies />}
        {currentQueryString === QSV.showMovieUpload && <MovieUpload />}
        {currentQueryString === QSV.showCreateSeries && <CreateSeries />}
        {currentQueryString === QSV.showAddEpisode && <EpisodeUpload />}
        {currentQueryString === QSV.showAddCategories && <AddCategories />}
        {currentQueryString === QSV.showFranchise && <AddFranchise />}
        {currentQueryString === QSV.showAddAvatar && <AddAvatar />}
        {/* {currentQueryStringQSV.=== QSV.showAddUser && <AddUser />} */}
        {currentQueryString === QSV.showFFmpeg && addFFmpeg()}
        {currentQueryString === QSV.showRemoveFFmpeg && removeFFmpeg()}
      </div>
    </div>
  );
}
