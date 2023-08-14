import { AxiosError, AxiosRequestHeaders } from 'axios';
import { queryPathsString } from '../utils/types';
import {
  updateMovieDate as movieUpdateDate,
  uploadMovieObject as uploadObjectMovie,
  uploadMovieChunk as uploadChunkMovie,
  deleteMovie as movieDelete,
  getVideosData as videosDataGet,
  getMovieData as movieDataGet,
  getSeriesData as seriesDataGet,
  getSeriesEpisodes as seriesEpisodesGet,
  getEpisodeData as episodeDataGet,
  getSeriesByCategory as seriesByCategoryGet,
  getMovieByCategory as movieByCategoryGet,
  searchVideo as videoSearch,
  searchMovie as movieSearch,
  searchSeries as seriesSearch,
  addIdToSavedList as addToSavedList,
  removeIdFromSavedList as removeFromSavedList,
  addIdToLikedList as addToLikedList,
  removeIdFromLikedList as removeFromLikedList,
  generateFFmpeg as ffmpegGenerate,
  removeFFmpeg as ffmpegRemove,
  addView as viewAdd,
  addToMoviesWatched as toMoviesWatched,
  updateMoviesWatched as doUpdateMoviesWatched,
  removeMovieWatched as doRemoveMovieWatched,
  addToSeriesWatched as addSeriesWatched,
  removeSeriesWatched as doRemoveSeriesWatched,
  removeEpisodeWatched as doRemoveEpisodeWatched,
  setSeriesWatchedActiveEpisode as seriesWatchedActiveEpisode,
  updateSeriesWatchedActiveEpisode as doUpdateSeriesWatchedActiveEpisode,
  addToSeriesWatchedEpisodes as addSeriesWatchedEpisodes,
  updateSeriesWatchedEpisode as doUpdateSeriesWatchedEpisode,
  getMoviesInfinityScroll as moviesGetInfinityScroll,
  getSeriesInfinityScroll as seriesGetInfinityScroll,
  searchMoviesInfinityScroll as moviesSearchInfinityScroll,
  searchSeriesInfinityScroll as seriesSearchInfinityScroll,
} from './apiService';

type ErrorType = { message: string; status: string };

export const updateMovieDate = <T>(data: {
  title: string | undefined | null;
  creditsDurationInMs: number | undefined | null;
  isPublic: boolean | undefined | null;
  categories: string[] | undefined | null;
  franchise: string[] | undefined | null;
  description: string | undefined | null;
  releaseDate: string | undefined | null;
  videoId: string | undefined | null;
  displayPictureUrl: string;
  backdropPath: string;
}) =>
  movieUpdateDate<T>(data)
    .then((res) => res)
    .catch((error: AxiosError<ErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const uploadMovieObject = (data: {
  displayPictureUrl: string;
  backdropPath: string;
  releaseDate: string;
  title: string;
  description: string;
  isPublic: boolean;
  categories: string[];
  franchise: string[];
}) =>
  uploadObjectMovie(data)
    .then((res) => res)
    .catch((error: AxiosError<ErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const uploadMovieChunk = <T>(
  URL: string,
  data: string | ArrayBuffer,
  headers: AxiosRequestHeaders
) =>
  uploadChunkMovie<T>(URL, data, headers)
    .then((res) => res)
    .catch((error: AxiosError<ErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const deleteMovie = (movieId: string) =>
  movieDelete(movieId)
    .then((res) => res)
    .catch((error: AxiosError<ErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const getVideosData = <T>(data: { queryName: queryPathsString; profileId?: string }) =>
  videosDataGet<T>(data)
    .then((res) => res)
    .catch((error: AxiosError<ErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const getMovieData = (movieId: string) =>
  movieDataGet(movieId)
    .then((res) => res)
    .catch((error: AxiosError<ErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const getSeriesData = (seriesId: string) =>
  seriesDataGet(seriesId)
    .then((res) => res)
    .catch((error: AxiosError<ErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const getSeriesEpisodes = (seriesId: string) =>
  seriesEpisodesGet(seriesId)
    .then((res) => res)
    .catch((error: AxiosError<ErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const getEpisodeData = (episodeId: string) =>
  episodeDataGet(episodeId)
    .then((res) => res)
    .catch((error: AxiosError<ErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const getSeriesByCategory = (data: {
  categoryNames: string[];
  exudeArray?: string[];
  limit?: number;
}) =>
  seriesByCategoryGet(data)
    .then((res) => res)
    .catch((error: AxiosError<ErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const getMovieByCategory = (data: {
  categoryNames: string[];
  exudeArray?: string[];
  limit?: number;
}) =>
  movieByCategoryGet(data)
    .then((res) => res)
    .catch((error: AxiosError<ErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const searchVideo = (searchText: string) =>
  videoSearch(searchText.replaceAll(' ', '%20'))
    .then((res) => res)
    .catch((error: AxiosError<ErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const searchMovie = (searchText: string) =>
  movieSearch(searchText.replaceAll(' ', '%20'))
    .then((res) => res)
    .catch((error: AxiosError<ErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const searchSeries = (searchText: string) =>
  seriesSearch(searchText.replaceAll(' ', '%20'))
    .then((res) => res)
    .catch((error: AxiosError<ErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const addIdToSavedList = (data: { profileId: string; videoId: string }) =>
  addToSavedList(data)
    .then((res) => res)
    .catch((error: AxiosError<ErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const removeIdFromSavedList = (data: { profileId: string; videoId: string }) =>
  removeFromSavedList(data)
    .then((res) => res)
    .catch((error: AxiosError<ErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const addIdToLikedList = (data: { profileId: string; videoId: string }) =>
  addToLikedList(data)
    .then((res) => res)
    .catch((error: AxiosError<ErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const removeIdFromLikedList = (data: { profileId: string; videoId: string }) =>
  removeFromLikedList(data)
    .then((res) => res)
    .catch((error: AxiosError<ErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const generateFFmpeg = (videoId: string) =>
  ffmpegGenerate(videoId)
    .then((res) => res)
    .catch((error: AxiosError<ErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const removeFFmpeg = (videoId: string) =>
  ffmpegRemove(videoId)
    .then((res) => res)
    .catch((error: AxiosError<ErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const addView = (data: { videoId: string; isMovie: boolean }) =>
  viewAdd(data)
    .then((res) => res)
    .catch((error: AxiosError<ErrorType>) => {
      throw new Error(error.response?.data.message);
    });

// videos watched -->

export const addToMoviesWatched = (data: {
  userId: string;
  profileId: string;
  data: { movieId: string; trackId: number };
}) =>
  toMoviesWatched(data)
    .then((res) => res)
    .catch((error: AxiosError<ErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const updateMoviesWatched = (data: {
  userId: string;
  profileId: string;
  movieId: string;
  trackId: number;
}) =>
  doUpdateMoviesWatched(data)
    .then((res) => res)
    .catch((error: AxiosError<ErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const removeMovieWatched = (data: { userId: string; profileId: string; movieId: string }) =>
  doRemoveMovieWatched(data)
    .then((res) => res)
    .catch((error: AxiosError<ErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const addToSeriesWatched = (data: {
  userId: string;
  profileId: string;
  data: {
    seriesId: string;
    activeEpisode: { episodeId: string; trackId: number };
    watchedEpisodes: { episodeId: string; trackId: number }[];
  };
}) =>
  addSeriesWatched(data)
    .then((res) => res)
    .catch((error: AxiosError<ErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const removeSeriesWatched = (data: {
  userId: string;
  profileId: string;
  seriesId: string;
}) =>
  doRemoveSeriesWatched(data)
    .then((res) => res)
    .catch((error: AxiosError<ErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const removeEpisodeWatched = (data: {
  userId: string;
  profileId: string;
  data: { userId: string; profileId: string; seriesId: string };
}) =>
  doRemoveEpisodeWatched(data)
    .then((res) => res)
    .catch((error: AxiosError<ErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const setSeriesWatchedActiveEpisode = (data: {
  userId: string;
  profileId: string;
  data: {
    userId: string;
    profileId: string;
    seriesId: string;
    activeEpisode: { episodeId: string; trackId: number };
  };
}) =>
  seriesWatchedActiveEpisode(data)
    .then((res) => res)
    .catch((error: AxiosError<ErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const updateSeriesWatchedActiveEpisode = (data: {
  userId: string;
  profileId: string;
  seriesId: string;
  trackId: number;
}) =>
  doUpdateSeriesWatchedActiveEpisode(data)
    .then((res) => res)
    .catch((error: AxiosError<ErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const addToSeriesWatchedEpisodes = (data: {
  userId: string;
  profileId: string;
  data: {
    userId: string;
    profileId: string;
    seriesId: string;
    data: { episodeId: string; trackId: number };
  };
}) =>
  addSeriesWatchedEpisodes(data)
    .then((res) => res)
    .catch((error: AxiosError<ErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const updateSeriesWatchedEpisode = (data: {
  userId: string;
  profileId: string;
  seriesId: string;
  episodeId: string;
  trackId: number;
}) =>
  doUpdateSeriesWatchedEpisode(data)
    .then((res) => res)
    .catch((error: AxiosError<ErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const getMoviesInfinityScroll = (data: { skip: number; limit: number }) =>
  moviesGetInfinityScroll(data)
    .then((res) => res)
    .catch((error: AxiosError<ErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const getSeriesInfinityScroll = (data: { skip: number; limit: number }) =>
  seriesGetInfinityScroll(data)
    .then((res) => res)
    .catch((error: AxiosError<ErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const searchMoviesInfinityScroll = (data: {
  searchId: string;
  skip: number;
  limit: number;
}) =>
  moviesSearchInfinityScroll(data)
    .then((res) => res)
    .catch((error: AxiosError<ErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const searchSeriesInfinityScroll = (data: {
  searchId: string;
  skip: number;
  limit: number;
}) =>
  seriesSearchInfinityScroll(data)
    .then((res) => res)
    .catch((error: AxiosError<ErrorType>) => {
      throw new Error(error.response?.data.message);
    });
