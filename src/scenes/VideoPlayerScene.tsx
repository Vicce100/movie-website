/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

import { assertsValueToType } from '../utils/assert';
import { getMovieData, addView, getEpisodeData } from '../services/videoService';
import { url } from '../services/apiService';
import { EpisodeSchemaType, MovieSchemaType, routesString as rs } from '../utils/types';
import { usePageTitle, useFormateTime } from '../hooks';

import { ReactComponent as PlayIcon } from '../asset/svg/videoPlayer/play.svg';
import { ReactComponent as PauseIcon } from '../asset/svg/videoPlayer/pause.svg';
import { ReactComponent as GoBack } from '../asset/svg/left-arrow-white.svg';
import { ReactComponent as VolumeHigh } from '../asset/svg/videoPlayer/volumeHigh.svg';
import { ReactComponent as VolumeLow } from '../asset/svg/videoPlayer/volumeLow.svg';
import { ReactComponent as VolumeMuted } from '../asset/svg/videoPlayer/volumeMuted.svg';
import { ReactComponent as OpenFullScreen } from '../asset/svg/videoPlayer/openFullScreen.svg';
import { ReactComponent as CloseFullScreen } from '../asset/svg/videoPlayer/closeFullScreen.svg';
import { ReactComponent as SkipBackward } from '../asset/svg/videoPlayer/skipBackward.svg';
import { ReactComponent as SkipForward } from '../asset/svg/videoPlayer/skipForward.svg';

import '../styles/VideoPlayerStyle.scss';

export default function VideoPlayerScene() {
  const [videoData, setVideoData] = useState<MovieSchemaType | EpisodeSchemaType | null>(null);

  const [volumeStatus, setVolumeStatus] = useState<'high' | 'low' | 'muted'>('high');
  const [volumeCount, setVolumeCount] = useState<number>(1);
  const [videoIsPlaying, setVideoIsPlaying] = useState<boolean>(false);
  const [videoIsFullscreen, setVideoIsFullscreen] = useState<boolean>(false);
  const [hoverOverVideo, setHoverOverVideo] = useState<boolean>(false);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [videoCurrentTime, setVideoCurrentTime] = useState<number>(0);
  const [isScrubbing, setIsScrubbing] = useState<boolean>(false);
  const [previewImageIndex, setPreviewImageIndex] = useState<number>(0);
  const [previewImageDuration, setPreviewImageDuration] = useState<number>(0);
  const [watchTime, setWatchTime] = useState<number>(0);

  const videoContainer = useRef<HTMLDivElement | null>(null);
  const video = useRef<HTMLVideoElement | null>(null);
  const middleControllerRef = useRef<HTMLButtonElement | null>(null);
  const playButton = useRef<HTMLButtonElement | null>(null);
  const fullscreenButton = useRef<HTMLButtonElement | null>(null);
  const totalTimeRef = useRef<HTMLDivElement | null>(null);
  const durationContainer = useRef<HTMLDivElement | null>(null);
  const timelineContainer = useRef<HTMLButtonElement | null>(null);
  const previewImageRef = useRef<HTMLImageElement | null>(null);
  const skipBackwardButtonRef = useRef<HTMLButtonElement | null>(null);
  const skipForwardButtonRef = useRef<HTMLButtonElement | null>(null);
  const mouseMoveRef = useRef<NodeJS.Timeout | null>(null);
  const watchTimerRef = useRef<NodeJS.Timeout | null>(null);

  const navigate = useNavigate();
  const { videoId } = useParams();
  const { setPageTitle } = usePageTitle();
  const { formateTime } = useFormateTime();

  const { state } = useLocation();
  assertsValueToType<{ isMovie: boolean } | undefined>(state);

  // useEffect(() => console.log(state), [state]);

  useEffect(() => setPageTitle('video player'), [setPageTitle]);

  // useEffect(() => (typeof isMovie !== 'boolean' ? navigate('/') : undefined), [isMovie, navigate]);

  useEffect(
    () => () => {
      if (!videoId || !state) {
        navigate('/');
        return;
      }
      const callSeries = (value) =>
        getEpisodeData(value)
          .then((res) => (res.status === 200 ? setVideoData(res.data) : null))
          .catch((e) => {
            if (e) navigate('/');
          });
      const callMovie = (value) =>
        getMovieData(value)
          .then((res) => (res.status === 200 ? setVideoData(res.data) : null))
          .catch(() => {
            callSeries(value);
            // setIsMovie(false);
          });
      if (state.isMovie) callMovie(videoId);
      else callSeries(videoId);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [videoId]
  );

  const startWatchTimer = useCallback(() => {
    // if (watchTime >= 120) return;
    watchTimerRef.current = setInterval(() => setWatchTime((v) => v + 1), 1000);
    // if (i >= 120 && watchTimerRef?.current) {
    //   clearInterval(watchTimerRef.current);
    // }
  }, []);

  useEffect(
    () => () => startWatchTimer(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    (() => {
      if (watchTime === 120 && videoData && state !== undefined) {
        // if (watchTimerRef.current) clearInterval(watchTimerRef.current);
        // const response = (await addView({ videoId: _id, state?.isMovie })).data;
        addView({ videoId: videoData._id, isMovie: state.isMovie });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchTime]);

  useEffect(
    () => () =>
      document.addEventListener('fullscreenchange', () =>
        document.fullscreenElement ? setVideoIsFullscreen(true) : setVideoIsFullscreen(false)
      ),
    []
  );

  const togglePlay = useCallback(() => {
    if (!video.current) return;
    if (video.current.paused) {
      video.current.play();
      // if (watchTime <= 120) startWatchTimer();
      startWatchTimer();
    } else {
      video.current.pause();
      if (watchTimerRef.current) clearInterval(watchTimerRef.current);
    }
  }, [startWatchTimer]);

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
    if (video.current?.muted) return;
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

  const onMouseInactivity = useCallback(() => {
    if (mouseMoveRef.current) clearTimeout(mouseMoveRef.current);
    mouseMoveRef.current = setTimeout(() => setHoverOverVideo(false), 3000);
  }, []);

  const keyPress = useCallback(
    (e: KeyboardEvent) => {
      if (document.activeElement?.tagName.toLowerCase() === 'input') return;
      if (document.activeElement?.tagName.toLowerCase() === 'button') return;
      setHoverOverVideo(true);
      onMouseInactivity();
      switch (e.key.toLowerCase()) {
        case ' ': // a space should be the space key
          if (document.activeElement?.tagName.toLowerCase() === 'button') {
            if (mouseMoveRef.current) clearTimeout(mouseMoveRef.current);
            return;
          }
          togglePlay();
          break;
        case 'k':
          togglePlay();
          break;
        case 'f':
          toggleFullScreenMode();
          break;
        case 'm':
          toggleMute();
          break;
        case 'arrowleft':
          skip(-10);
          break;
        case 'arrowright':
          skip(10);
          break;
        case 'arrowup':
          increaseVolume();
          break;
        case 'arrowdown':
          decreaseVolume();
          break;
        case 'c':
          // toggleCaptions();
          if (mouseMoveRef.current) clearTimeout(mouseMoveRef.current);
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
          if (mouseMoveRef.current) clearTimeout(mouseMoveRef.current);
          break;
      }
    },
    [
      decreaseVolume,
      increaseVolume,
      onMouseInactivity,
      skip,
      skipTo,
      toggleFullScreenMode,
      toggleMute,
      togglePlay,
    ]
  );

  useEffect(() => {
    document.addEventListener('keydown', keyPress);
    return () => document.removeEventListener('keydown', keyPress);
  }, [keyPress]);

  const handleTimelineUpdate = useCallback(
    (e: MouseEvent | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (!timelineContainer.current || !video.current) return;
      const rect = timelineContainer.current.getBoundingClientRect();
      const percent = Math.min(Math.max(0, e.clientX - rect.x), rect.width) / rect.width;
      setPreviewImageDuration(percent * video.current.duration);
      setPreviewImageIndex(Math.max(1, Math.floor((percent * video.current.duration) / 10)));
      timelineContainer.current.style.setProperty('--preview-position', String(percent));

      if (isScrubbing)
        timelineContainer.current.style.setProperty('--progress-position', String(percent));
      timelineContainer.current.blur();
    },
    [isScrubbing]
  );

  const resetTimeLine = useCallback(() => {
    if (!video.current) return;
    const percent = video.current.currentTime / video.current.duration;
    timelineContainer.current?.style.setProperty('--preview-position', String(percent));
  }, []);

  const toggleScrubbing = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | MouseEvent) => {
      if (!timelineContainer.current || !videoContainer.current || !video.current) return;
      const rect = timelineContainer.current.getBoundingClientRect();
      const percent = Math.min(Math.max(0, e.clientX - rect.x), rect.width) / rect.width;
      setIsScrubbing((e.buttons && 1) === 1);
      videoContainer.current.classList.toggle('scrubbing', isScrubbing);
      video.current.currentTime = percent * video.current.duration;
      if (!videoIsPlaying) video.current.play();

      handleTimelineUpdate(e);
    },
    [handleTimelineUpdate, isScrubbing, videoIsPlaying]
  );

  useEffect(() => {
    document.onmouseup = (e) => isScrubbing && toggleScrubbing(e);
  }, [isScrubbing, toggleScrubbing]);

  useEffect(() => {
    document.onmouseover = (e) => isScrubbing && handleTimelineUpdate(e);
  }, [handleTimelineUpdate, isScrubbing]);

  const renderPlayIcon = useCallback(() => {
    if (videoIsPlaying) return <PauseIcon className="play-pause-icon" />;
    return <PlayIcon className="play-pause-icon" />;
  }, [videoIsPlaying]);

  const renderVolumeIcon = useCallback(() => {
    if (volumeStatus === 'high') return <VolumeHigh className="volume-icon" />;
    if (volumeStatus === 'low') return <VolumeLow className="volume-icon" />;
    return <VolumeMuted className="volume-icon" />;
  }, [volumeStatus]);

  const renderFullscreenIcon = useCallback(() => {
    if (!videoIsFullscreen) return <OpenFullScreen className="fullscreen-icon" />;
    return <CloseFullScreen className="fullscreen-icon" />;
  }, [videoIsFullscreen]);

  const renderTitle = useCallback(() => {
    if (state?.isMovie && videoData) {
      assertsValueToType<MovieSchemaType>(videoData);
      return (
        <div className="title-div">
          <h1 className="title">{videoData.title}</h1>
        </div>
      );
    }
    if (videoData) {
      assertsValueToType<EpisodeSchemaType>(videoData);
      return (
        <div className="title-div">
          <h1 className="title">{videoData.seriesTitle}</h1>
          <h2 className="episode-title">{videoData?.episodeTitle}</h2>
        </div>
      );
    }
    return undefined;
  }, [state?.isMovie, videoData]);

  return (
    <div className="video-container" ref={videoContainer}>
      {video.current && (
        <div
          onMouseMove={() => {
            setHoverOverVideo(true);
            onMouseInactivity();
          }}
          // onMouseOver={() => setHoverOverVideo(true)}
          onFocus={() => setHoverOverVideo(true)}
          onMouseLeave={onMouseInactivity}
          onBlur={onMouseInactivity}
          className="video-controls-container"
          style={{ opacity: video.current?.paused || hoverOverVideo ? 1 : 0 }}
        >
          <div className="navigate-back-to-home">
            <button
              type="button"
              className="go-back"
              onClick={() => {
                navigate(-1);
                // if (watchTimerRef.current) clearInterval(watchTimerRef.current);
              }}
            >
              <GoBack className="go-back-icon" />
            </button>
            {renderTitle()}
          </div>
          <button
            type="button"
            ref={middleControllerRef}
            onClick={() => {
              togglePlay();
              middleControllerRef.current?.blur();
              setHoverOverVideo(true);
            }}
            className="middle-controller"
            style={{ cursor: hoverOverVideo ? 'default' : 'none' }}
          >
            <div />
          </button>
          <div className="controls">
            <div className="main-controls">
              <div className="main-controls-section">
                <div className="duration-container" ref={durationContainer}>
                  <p className="current-time">
                    {videoCurrentTime ? formateTime(videoCurrentTime) : '0:00'}
                  </p>
                  <p>/</p>
                  <p className="total-time" ref={totalTimeRef}>
                    {formateTime(videoDuration)}
                  </p>
                </div>
                <div className="volume-container">
                  <button type="button" className="volume-button" onClick={toggleMute}>
                    {renderVolumeIcon()}
                  </button>
                  <input
                    className="volume-slider"
                    type="range"
                    min="0"
                    max="1"
                    step="any"
                    onChange={(e) => {
                      if (Number(e.target.value) <= 0.001) toggleMute();
                      else if (video.current?.muted === true) video.current.muted = false;
                      if (video.current) video.current.volume = Number(e.target.value);
                      setVolumeCount(Number(e.target.value) <= 0.001 ? 0 : Number(e.target.value));
                    }}
                    value={volumeCount}
                  />
                </div>
              </div>
              <div className="main-controls-section">
                <button
                  ref={skipForwardButtonRef}
                  className="skip-button"
                  type="button"
                  onClick={() => {
                    skip(-10);
                    skipForwardButtonRef.current?.blur();
                  }}
                >
                  <SkipBackward className="skip-icon-button" />
                </button>
                <button
                  ref={playButton}
                  type="button"
                  className="play-pause-button"
                  onClick={() => {
                    togglePlay();
                    playButton.current?.blur();
                    setHoverOverVideo(true);
                  }}
                >
                  {renderPlayIcon()}
                </button>
                <button
                  ref={skipBackwardButtonRef}
                  className="skip-button"
                  type="button"
                  onClick={() => {
                    skip(10);
                    skipBackwardButtonRef.current?.blur();
                    setHoverOverVideo(true);
                  }}
                >
                  <SkipForward className="skip-icon-button" />
                </button>
              </div>
              <div className="main-controls-section fullscreen-section">
                <button
                  ref={fullscreenButton}
                  type="button"
                  className="fullscreen-button"
                  onClick={() => {
                    toggleFullScreenMode();
                    fullscreenButton.current?.blur();
                  }}
                >
                  {renderFullscreenIcon()}
                </button>
              </div>
            </div>
            <button
              type="button"
              className="timeline-container"
              ref={timelineContainer}
              onMouseMove={handleTimelineUpdate}
              onMouseLeave={resetTimeLine}
              onBlur={resetTimeLine}
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              onFocus={() => {}}
              onMouseDown={toggleScrubbing}
            >
              <div className="timeline">
                <div className="preview-img-div">
                  <img
                    ref={previewImageRef}
                    src={videoData ? videoData.previewImagesUrl[previewImageIndex] : '*'}
                    alt={videoData ? videoData.previewImagesUrl[previewImageIndex] : '*'}
                  />
                  <h4 className="preview-image-duration">{formateTime(previewImageDuration)}</h4>
                </div>
                <div className="thumb-indicator" />
              </div>
            </button>
          </div>
        </div>
      )}
      <video
        ref={video}
        id="videoPlayer"
        width="650"
        autoPlay
        onTimeUpdate={() => {
          if (!video.current) return;
          setVideoCurrentTime(video.current?.currentTime);
          const percent = video.current.currentTime / video.current.duration;
          timelineContainer.current?.style.setProperty('--progress-position', String(percent));

          // const { duration } = video.current;
          // const { currentTime } = video.current;
        }}
        onLoadedData={() => setVideoDuration(video.current?.duration || 0)}
        onPlay={() => setVideoIsPlaying(true)}
        onPause={() => setVideoIsPlaying(false)}
        onVolumeChange={(e) => {
          setVolumeCount(e.currentTarget.muted ? 0 : e.currentTarget.volume);
          if (e.currentTarget.muted) setVolumeStatus('muted');
          else if (e.currentTarget.volume >= 0.5) setVolumeStatus('high');
          else setVolumeStatus('low');
        }}
      >
        {videoId ? (
          state?.isMovie ? (
            <source src={`${url}/${rs.video}/${rs.movie}/${videoId}`} type="video/mp4" />
          ) : (
            <source src={`${url}/${rs.video}/${rs.episode}/${videoId}`} type="video/mp4" />
          )
        ) : null}
        <track kind="captions" src="assets/subtitles.vtt" />
      </video>
    </div>
  );
}
