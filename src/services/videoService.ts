import { AxiosError } from 'axios';
import {
  getVideosData as videosDataGet,
  getMovieData as movieDataGet,
  getEpisodeData as episodeDataGet,
  getSeriesByCategory as seriesByCategoryGet,
  getMovieByCategory as movieByCategoryGet,
  generateFFmpeg as ffmpegGenerate,
  removeFFmpeg as ffmpegRemove,
  addView as viewAdd,
} from './apiService';

type ErrorType = { message: string; status: string };

export const getMovieData = (movieId: string) =>
  movieDataGet(movieId)
    .then((res) => res)
    .catch((error: AxiosError<ErrorType>) => {
      console.log(error);
      throw new Error(error.response?.data.message);
    });

export const getEpisodeData = (movieId: string) =>
  episodeDataGet(movieId)
    .then((res) => res)
    .catch((error: AxiosError<ErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const getSeriesByCategory = (data: {
  categoryName1: string;
  categoryName2?: string;
  categoryName3?: string;
}) =>
  seriesByCategoryGet(data)
    .then((res) => res)
    .catch((error: AxiosError<ErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const getMovieByCategory = (data: {
  categoryName1: string;
  categoryName2?: string;
  categoryName3?: string;
}) =>
  movieByCategoryGet(data)
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
