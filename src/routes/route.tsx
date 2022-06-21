import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useCurrentUserContext, useProfileContext } from '../contexts/UserAuth';
import { userRole } from '../utils/types';
import Login from '../scenes/Login';
import SignUp from '../scenes/SignUp';
import HomeScene from '../scenes/HomeScene';
import UploadVideo from '../scenes/UploadVideoScene';
import AvatarScene from '../scenes/AvatarScene';
import AdminScene from '../scenes/AdminScene';
import ProfileScene from '../scenes/ProfileScene';

function Router() {
  const { currentUser } = useCurrentUserContext();
  const { activeProfile } = useProfileContext();

  return (
    <BrowserRouter>
      {currentUser ? (
        <Routes>
          {!activeProfile ? (
            <React.Fragment>
              <Route path="/" element={<Navigate replace to="/Profile" />} />
              {/* add outer components */}
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Route path="/" element={<HomeScene />} />
              <Route path="/UploadVideo" element={<UploadVideo />} />
            </React.Fragment>
          )}
          {/* <Route path="/" element={<HomeScene />} /> */}
          <Route path="/Avatar" element={<AvatarScene />} />
          <Route path="/Profile" element={<ProfileScene />} />
          {currentUser.role === (userRole.admin || userRole.superAdmin) && (
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
