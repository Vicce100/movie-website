/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';

import { getSingleVIdeoData } from '../services/index';
import { url } from '../services/apiService';
import { ReturnedVideoData } from '../utils/types';
import { usePageTitle } from '../hooks';

import '../styles/VideoPlayerStyle.scss';

export default function VideoPlayerScene() {
  const [videoData, setVideoData] = useState<ReturnedVideoData | null>(null);

  const videoContainer = useRef<HTMLDivElement | null>(null);
  const video = useRef<HTMLVideoElement | null>(null);

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

  return (
    <div className="video-container" ref={videoContainer}>
      <div className="video-controls-container" />
      <video ref={video} id="videoPlayer" width="650" autoPlay>
        {videoId ? <source src={`${url}/video/${videoId}`} type="video/mp4" /> : null}
        <track kind="captions" src="assets/subtitles.vtt" />
      </video>
    </div>
  );
}
