import React, { Fragment } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useCurrentUserContext, useProfileContext } from '../contexts/UserAuth';
import { userRoles } from '../utils/types';
import Login from '../scenes/Login';
import SignUp from '../scenes/SignUp';
import HomeScene from '../scenes/HomeScene';
import AdminScene from '../scenes/AdminScene/index';
import ProfileScene from '../scenes/ProfileScene';
// import VideoInfoScene from '../scenes/VideoInfoScene';
import VideoPlayerScene from '../scenes/VideoPlayerScene';
import SearchScene from '../scenes/SearchScene';

function Router() {
  const { currentUser } = useCurrentUserContext();
  const { activeProfile } = useProfileContext();

  const urlPath = window.location.href.replace(window.location.origin, '');

  return (
    <BrowserRouter>
      {currentUser ? (
        <Routes>
          {!activeProfile ? (
            <Fragment>
              <Route
                path="*"
                element={<Navigate replace to="/Profile" state={{ previousPath: urlPath }} />}
              />
              {/* add outer components */}
            </Fragment>
          ) : (
            <Fragment>
              <Route path="/" element={<Navigate replace to="browse" />} />
              <Route path="/browse" element={<HomeScene />} />
              <Route path="/player/:videoId" element={<VideoPlayerScene />} />
              <Route path="/search" element={<SearchScene />} />
            </Fragment>
          )}
          <Route path="/Profile" element={<ProfileScene />} />
          {currentUser.role === userRoles.admin ||
            currentUser.role === userRoles.moderator ||
            (currentUser.role === userRoles.superAdmin && (
              <Route path="/Admin" element={<AdminScene />} />
            ))}
          {/* <Route path="*" element={<ErrorPage />} /> */}
          <Route path="*" element={<Navigate replace to="/" />} /> {/* ErrorPageScene */}
        </Routes>
      ) : (
        <Routes>
          <Route path="*" element={<Navigate replace to="/Login" />} />
          <Route path="/" element={<Navigate replace to="/Login" />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/SignUp" element={<SignUp />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default Router;
