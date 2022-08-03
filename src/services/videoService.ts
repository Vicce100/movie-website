import { AxiosError } from 'axios';
import { queryPathsString } from '../utils/types';
import {
  getVideosData as videosDataGet,
  getMovieData as movieDataGet,
  getSeriesData as seriesDataGet,
  getEpisodeData as episodeDataGet,
  getSeriesByCategory as seriesByCategoryGet,
  getMovieByCategory as movieByCategoryGet,
  searchVideo as videoSearch,
  searchMovie as movieSearch,
  searchSeries as seriesSearch,
  generateFFmpeg as ffmpegGenerate,
  removeFFmpeg as ffmpegRemove,
  addView as viewAdd,
} from './apiService';

type ErrorType = { message: string; status: string };

export const getVideosData = <T>(data: { queryName: queryPathsString; profileId?: string }) =>
  videosDataGet<T>(data)
    .then((res) => res)
    .catch((error: AxiosError<ErrorType>) => {
      console.log(error);
      throw new Error(error.response?.data.message);
    });

export const getMovieData = (movieId: string) =>
  movieDataGet(movieId)
    .then((res) => res)
    .catch((error: AxiosError<ErrorType>) => {
      console.log(error);
      throw new Error(error.response?.data.message);
    });

export const getSeriesData = (seriesId: string) =>
  seriesDataGet(seriesId)
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

export const getSeriesByCategory = (data: { categoryNames: string[] }) =>
  seriesByCategoryGet(data)
    .then((res) => res)
    .catch((error: AxiosError<ErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const getMovieByCategory = (data: { categoryNames: string[] }) =>
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
