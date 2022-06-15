import React, { useEffect } from 'react';
import { useCurrentUserContext } from '../contexts/UserAuth';
import '../styles/AvatarStyle.scss';

export default function AvatarScene() {
  const { currentUser } = useCurrentUserContext();

  return (
    <div className="avatar-container">
      <h1 className="avatar-h1">AvatarScene</h1>
    </div>
  );
}
