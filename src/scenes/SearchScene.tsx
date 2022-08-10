import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import Header from '../component/Header';
import { usePageTitle, useShuffleArray } from '../hooks';
import { searchVideo } from '../services/videoService';
import '../styles/SearchStyles.scss';
import { returnVideos, returnVideosArray } from '../utils/types';
import VideoInfoScene from './VideoInfoScene';

export default function SearchScene() {
  const [searchParams, setSearchParams] = useSearchParams({ searchId: '', contentId: '' });

  const [searchString, setSearchString] = useState('');
  const [searchResponse, setSearchResponse] = useState<returnVideosArray | undefined>(undefined);
  const [isMovie, setIsMovie] = useState<boolean>(true);

  const { setPageTitle } = usePageTitle();

  useEffect(() => setPageTitle('search'), [setPageTitle]);
  // const shuffleArray = useShuffleArray();

  useEffect(() => {
    const value = searchParams.get('searchId');
    if (!value) return;
    searchVideo(value)
      .then((res) => res.data && setSearchResponse(res.data))
      .catch((e) => console.log(e));
  }, [searchParams]);

  return (
    <div className="search-container">
      <Header />
      <div
        className="search-container-content"
        style={{
          background: searchParams.get('contentId')
            ? 'rgba(42, 42, 42, 0.5)'
            : 'linear-gradient(to right, #31343a 0%, #52555d 20%, #43495c 40%, #4a4e57 60%, #3b3e47 80%, #31343a 100% )',
          position: searchParams.get('contentId') ? 'fixed' : 'relative',
        }}
      >
        <input
          type="text"
          name="search-value"
          id="search-value"
          placeholder="Search for movies and series..."
          value={searchString}
          onChange={(e) => {
            setSearchParams({ searchId: e.target.value });
            setSearchString(e.target.value);
          }}
        />
        {searchResponse && searchParams.get('searchId') && (
          <div className="search-value-container">
            {searchResponse.map((video: returnVideos) => (
              <div className="search-value-element" key={video._id}>
                <button
                  type="button"
                  className="search-value-element-button"
                  onClick={() => {
                    setIsMovie(video.isMovie);
                    setSearchParams({ searchId: searchString, contentId: video._id });
                  }}
                >
                  <img src={video.displayPicture} alt={video.title} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {searchParams.get('contentId') && <VideoInfoScene isMovieProp={isMovie} />}
    </div>
  );
}
