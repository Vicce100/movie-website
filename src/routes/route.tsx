import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useCurrentUserContext } from '../contexts/UserAuth';
import { userRole } from '../utils/types';
import Login from '../scenes/Login';
import SignUp from '../scenes/SignUp';
import HomeScene from '../scenes/HomeScene';
import PostFile from '../scenes/PostFile';
import AvatarScene from '../scenes/AvatarScene';
import AdminScene from '../scenes/AdminScene';

function Router() {
  const { currentUser } = useCurrentUserContext();

  return (
    <BrowserRouter>
      {currentUser ? (
        <Routes>
          <Route path="/" element={<HomeScene />} />
          <Route path="/Avatar" element={<AvatarScene />} />
          <Route path="/PostFile" element={<PostFile />} />
          {currentUser.role === userRole.admin ? (
            <Route path="/Admin" element={<AdminScene />} />
          ) : null}
          {/* <Route path="*" element={<ErrorPage />} /> */}
        </Routes>
      ) : (
        <Routes>
          <Route path="*" element={<Navigate replace to="/login" />} />
          <Route path="/" element={<Navigate replace to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default Router;
