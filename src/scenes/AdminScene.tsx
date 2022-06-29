import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { usePageTitle } from '../hooks/index';
import AddAvatar from '../component/AddAvatar';
import AddCategories from '../component/AddCategories';
import '../styles/AdminStyle.scss';

export default function AdminScene() {
  const [showAddCategories, setShowAddCategories] = useState<boolean>(false);
  const [showAddAvatar, setShowAddAvatar] = useState<boolean>(false);
  const [showVideo, setShowVideo] = useState<boolean>(false);
  const [showAddUser, setShowAddUser] = useState<boolean>(false);
  const { setPageTitle } = usePageTitle();

  const navigate = useNavigate();

  useEffect(() => setPageTitle('Admin'), [setPageTitle]);

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
          }}
        >
          <h3 className="options-box-heading">Add Video</h3>
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
      </div>
    </div>
  );
}
