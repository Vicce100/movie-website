import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { getSingleVIdeoData } from '../services/index';
import { url } from '../services/apiService';
import { ReturnedVideoData } from '../utils/types';
import { usePageTitle } from '../hooks';

import { ReactComponent as PlayIcon } from '../asset/svg/videoPlayer/play.svg';
import { ReactComponent as PauseIcon } from '../asset/svg/videoPlayer/pause.svg';
import { ReactComponent as GoBack } from '../asset/svg/left-arrow-white.svg';

import '../styles/VideoPlayerStyle.scss';

export default function VideoPlayerScene() {
  const [videoData, setVideoData] = useState<ReturnedVideoData | null>(null);
  const [videoIsPlaying, setVideoIsPlaying] = useState<boolean>(false);

  const videoContainer = useRef<HTMLDivElement | null>(null);
  const video = useRef<HTMLVideoElement | null>(null);

  const navigate = useNavigate();
  const { videoId } = useParams();
  const { setPageTitle } = usePageTitle();

  useEffect(() => setPageTitle('video player'), [setPageTitle]);

  useEffect(() => {
    if (!videoId) return;
    const fetchVideoData = async () => {
      try {
        setVideoData((await getSingleVIdeoData(videoId)).data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchVideoData();
  }, [videoId]);

  const togglePlay = useCallback(() => {
    if (!video.current) return;
    if (video.current.paused) video.current.play();
    else video.current.pause();
  }, [video]);

  useEffect(() => () => video.current?.addEventListener('play', () => setVideoIsPlaying(true)), []);
  useEffect(
    () => () => video.current?.addEventListener('pause', () => setVideoIsPlaying(false)),
    []
  );

  useEffect(() => video.current?.addEventListener('click', togglePlay), [togglePlay]);
  useEffect(() => videoContainer.current?.addEventListener('click', togglePlay), [togglePlay]);

  const toggleFullScreenMode = useCallback(() => {
    if (!videoContainer.current) return;
    if (!document.fullscreenElement) videoContainer.current.requestFullscreen();
    else document.exitFullscreen();
  }, [videoContainer]);

  const skip = useCallback(
    (duration: number) => {
      if (!video.current) return;
      const time = video.current.currentTime;
      video.current.currentTime = time + duration;
    },
    [video]
  );

  const toggleMute = useCallback(() => {
    if (!video.current) return;
    video.current.muted = !video.current.muted;
  }, [video]);

  const increaseVolume = useCallback(() => {
    if (!video.current || video.current.volume >= 1) return;
    const currentVolume = video.current.volume;
    if (video.current.muted) toggleMute();
    else video.current.volume = currentVolume + 0.1;
  }, [toggleMute]);

  const decreaseVolume = useCallback(() => {
    if (!video.current || video.current.volume <= 0) return;
    const currentVolume = video.current.volume;
    if (video.current.volume <= 0.1001) toggleMute();
    else video.current.volume = currentVolume - 0.1;
  }, [toggleMute]);

  const skipTo = useCallback(
    (number: number) => {
      if (!video.current) return;
      video.current.currentTime = video.current.duration * number;
    },
    [video]
  );

  const keyPress = useCallback(
    (e: KeyboardEvent) => {
      if (document.activeElement?.tagName.toLowerCase() === 'input') return;
      if (document.activeElement?.tagName.toLowerCase() === 'button') return;
      switch (e.key.toLowerCase()) {
        case ' ': // a space should be the space key
          if (document.activeElement?.tagName.toLowerCase() === 'button') return;
          togglePlay();
          break;
        case 'k':
          togglePlay();
          break;
        case 'f':
          toggleFullScreenMode();
          break;
        case 't':
          // toggleTheaterMode();
          break;
        case 'i':
          // toggleMiniPlayerMode();
          break;
        case 'm':
          toggleMute();
          break;
        case 'arrowleft':
          skip(-5);
          break;
        case 'arrowright':
          skip(5);
          break;
        case 'arrowup':
          increaseVolume();
          break;
        case 'arrowdown':
          decreaseVolume();
          break;
        case 'c':
          // toggleCaptions();
          break;
        case '1':
          skipTo(0.1);
          break;
        case '2':
          skipTo(0.2);
          break;
        case '3':
          skipTo(0.3);
          break;
        case '4':
          skipTo(0.4);
          break;
        case '5':
          skipTo(0.5);
          break;
        case '6':
          skipTo(0.6);
          break;
        case '7':
          skipTo(0.7);
          break;
        case '8':
          skipTo(0.8);
          break;
        case '9':
          skipTo(0.9);
          break;
        case '0':
          skipTo(0.0);
          break;
        default:
          break;
      }
    },
    [decreaseVolume, increaseVolume, skip, skipTo, toggleFullScreenMode, toggleMute, togglePlay]
  );

  useEffect(() => {
    document.addEventListener('keyup', keyPress);
    return () => document.removeEventListener('keydown', keyPress);
  }, [keyPress]);

  const renderPlayIcon = useCallback(() => {
    if (videoIsPlaying) return <PauseIcon className="play-pause-icon" />;
    return <PlayIcon className="play-pause-icon" />;
  }, [videoIsPlaying]);

  return (
    <div className="video-container" ref={videoContainer}>
      {video.current && (
        <div className="video-controls-container">
          <div className="navigate-back-to-home">
            <button type="button" className="go-back" onClick={() => navigate(-1)}>
              <GoBack className="go-back-icon" />
            </button>
            <div className="title-div">
              {videoData && <h1 className="title">{videoData.title}</h1>}
              {videoData?.episodeTitle && (
                <h2 className="episode-title">{videoData.episodeTitle}</h2>
              )}
            </div>
          </div>
          <div className="controls">
            <button type="button" className="play-pause-button">
              {renderPlayIcon()}
            </button>
          </div>
        </div>
      )}
      <video ref={video} id="videoPlayer" width="650" autoPlay>
        {videoId ? <source src={`${url}/video/${videoId}`} type="video/mp4" /> : null}
        <track kind="captions" src="assets/subtitles.vtt" />
      </video>
    </div>
  );
}
