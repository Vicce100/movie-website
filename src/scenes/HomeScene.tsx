import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../component/Header';

export default function HomeScene() {
  const navigate = useNavigate();
  return (
    <div className="home-container">
      <Header />
      <br />
      <br />
      <br />
      <br />
      <button type="button" onClick={() => navigate('/PostFile')}>
        add new file
      </button>
    </div>
  );
}
