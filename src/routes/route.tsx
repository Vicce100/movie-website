import React, { Fragment } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useCurrentUserContext, useProfileContext } from '../contexts/UserAuth';
import { userRoles } from '../utils/types';
import Login from '../scenes/Login';
import SignUp from '../scenes/SignUp';
import HomeScene from '../scenes/HomeScene';
import UploadVideo from '../scenes/UploadVideoScene';
import AdminScene from '../scenes/AdminScene';
import ProfileScene from '../scenes/ProfileScene';
import VideoPlayerScene from '../scenes/VideoPlayerScene';

function Router() {
  const { currentUser } = useCurrentUserContext();
  const { activeProfile } = useProfileContext();

  return (
    <BrowserRouter>
      {currentUser ? (
        <Routes>
          {!activeProfile ? (
            <Fragment>
              <Route path="*" element={<Navigate replace to="/Profile" />} />
              {/* add outer components */}
            </Fragment>
          ) : (
            <Fragment>
              <Route path="/" element={<HomeScene />} />
              <Route path="/home" element={<Navigate replace to="/" />} />
              <Route path="/upload/video" element={<UploadVideo />} />
              <Route path="/player/:videoId" element={<VideoPlayerScene isMovie />} />
            </Fragment>
          )}
          <Route path="/Profile" element={<ProfileScene />} />
          {currentUser.role === (userRoles.admin || userRoles.superAdmin) && (
            <Route path="/Admin" element={<AdminScene />} />
          )}
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
