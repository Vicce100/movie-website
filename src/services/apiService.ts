/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

import axios, { AxiosResponse } from 'axios';
import {
  CategorySchemaType,
  CurrentUserType,
  ReturnAvatarType,
  UsersRolesType,
  routesString as rs,
  MovieSchemaType,
  EpisodeSchemaType,
  queryPathsString,
  FranchiseSchemaType,
  returnVideosArray,
  ReturnedSeriesSchemaType,
} from '../utils/types';

type EndpointType = { host: string; port: string; path: string };

const protocol = 'http';
const host = 'localhost';
const port = '5050';
export const url = `${protocol}://${host}:${port}`;

axios.defaults.withCredentials = true;

// ---------- local ---------- //

const getRequest = async <T>(endpoint: EndpointType): Promise<AxiosResponse<T>> =>
  axios.get(`${protocol}://${endpoint.host}:${endpoint.port}${endpoint.path}`);

const postRequest = async <T>(endpoint: EndpointType, data?: object): Promise<AxiosResponse<T>> =>
  axios.post(`${protocol}://${endpoint.host}:${endpoint.port}${endpoint.path}`, data);

const deleteRequest = async <T>(endpoint: EndpointType, data?: object): Promise<AxiosResponse<T>> =>
  axios.delete(`${protocol}://${endpoint.host}:${endpoint.port}${endpoint.path}`, data);

const nonDataPostRequest = async <T>(endpoint: EndpointType): Promise<AxiosResponse<T>> =>
  axios.post(`${protocol}://${endpoint.host}:${endpoint.port}${endpoint.path}`);

// ---------- local ---------- //

// ---------- user ---------- //

export const loginUser = async (data: { email: string; password: string }) =>
  postRequest<CurrentUserType>({ host, port, path: '/user/login' }, data);

export const createUser = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => postRequest<CurrentUserType>({ host, port, path: '/user/create' }, data);

export const logoutUser = () =>
  deleteRequest<CurrentUserType>({ host, port, path: '/user/logout' });

export const deleteUser = (data: { email: string; password: string; userId: string }) =>
  postRequest<CurrentUserType>({ host, port, path: '/user/delete' }, data);

export const userRefreshToken = (data: { refreshToken: string }) =>
  postRequest<CurrentUserType>({ host, port, path: '/user/refreshToken' }, data);

export const getUser = () =>
  getRequest<CurrentUserType>({ host, port, path: '/user/getCurrentUser' });

export const addProfile = (data: { profileName: string; avatarURL: string }) =>
  postRequest({ host, port, path: '/user/addProfile' }, data);

// auth
export const checkAuth = () =>
  getRequest<{ isLoggedIn: false }>({ host, port, path: `/user/checkAuth` });

export const checkAuthRole = (roleType: UsersRolesType) =>
  getRequest<{ access: boolean }>({ host, port, path: `/user/checkAuth/${roleType}` });

// ---------- category ---------- //

export const uploadSingleCategory = (data: { category: string }) =>
  postRequest({ host, port, path: `/${rs.category}/${rs.upload}/${rs.single}` }, data);

export const uploadMultipleCategory = (data: { categories: string[] }) =>
  postRequest<{ success: boolean }>(
    { host, port, path: `/${rs.category}/${rs.upload}/${rs.multiple}` },
    data
  );

export const getSingleCategory = (categoryId: string) =>
  getRequest<CategorySchemaType>({ host, port, path: `/${rs.category}/${categoryId}` });

export const getAllCategory = () =>
  getRequest<CategorySchemaType[]>({
    host,
    port,
    path: `/${rs.category}/${rs.get}/${rs.multiple}`,
  });

// ---------- franchise ---------- //

export const uploadSingleFranchise = (data: { Franchise: string }) =>
  postRequest({ host, port, path: `/${rs.franchise}/${rs.upload}/${rs.single}` }, data);

export const uploadMultipleFranchise = (data: { franchises: string[] }) =>
  postRequest<{ success: boolean }>(
    { host, port, path: `/${rs.franchise}/${rs.upload}/${rs.multiple}` },
    data
  );

export const getSingleFranchise = (franchiseId: string) =>
  getRequest<FranchiseSchemaType>({ host, port, path: `/${rs.franchise}/${franchiseId}` });

export const getAllFranchise = () =>
  getRequest<FranchiseSchemaType[]>({
    host,
    port,
    path: `/${rs.franchise}/${rs.get}/${rs.multiple}`,
  });

// ---------- avatar ---------- //

export const getSingleAvatar = (avatarId: string) =>
  getRequest<ReturnAvatarType>({ host, port, path: `/${rs.avatar}/${avatarId}` });

export const getAllAvatars = () =>
  getRequest<ReturnAvatarType[]>({ host, port, path: '/avatar/get/multiple' });

// ---------- video ---------- //

export const getVideosData = <T>(data: { queryName: queryPathsString; profileId?: string }) =>
  postRequest<T>(
    {
      host,
      port,
      path: `/${rs.video}/${rs.data}`,
    },
    data
  );

export const getMovieData = (movieId: string) =>
  getRequest<MovieSchemaType>({
    host,
    port,
    path: `/${rs.video}/${rs.movie}/${rs.data}/${movieId}`,
  });

export const getSeriesData = (seriesId: string) =>
  getRequest<ReturnedSeriesSchemaType>({
    host,
    port,
    path: `/${rs.video}/${rs.series}/${rs.data}/${seriesId}`,
  });

export const getEpisodeData = (episodeId: string) =>
  getRequest<EpisodeSchemaType>({
    host,
    port,
    path: `/${rs.video}/${rs.episode}/${rs.data}/${episodeId}`,
  });

export const getMovieByCategory = (data: { categoryNames: string[]; exudeArray?: string[] }) =>
  postRequest<returnVideosArray>(
    {
      host,
      port,
      path: `/${rs.video}/${rs.movie}/${rs.data}/${rs.category}`,
    },
    data
  );

export const getSeriesByCategory = (data: { categoryNames: string[]; exudeArray?: string[] }) =>
  postRequest<returnVideosArray>(
    {
      host,
      port,
      path: `/${rs.video}/${rs.series}/${rs.data}/${rs.category}`,
    },
    data
  );

export const searchVideo = (searchText: string) =>
  getRequest<returnVideosArray>({
    host,
    port,
    path: `/${rs.video}/${rs.search}?value=${searchText}`,
  });

export const searchMovie = (searchText: string) =>
  getRequest<returnVideosArray | undefined>({
    host,
    port,
    path: `/${rs.video}/${rs.movie}/${rs.search}?value=${searchText}`,
  });

export const searchSeries = (searchText: string) =>
  getRequest<returnVideosArray | undefined>({
    host,
    port,
    path: `/${rs.video}/${rs.series}/${rs.search}?value=${searchText}`,
  });

export const addView = (data: { videoId: string; isMovie: boolean }) =>
  postRequest<{ success: true }>({ host, port, path: `/${rs.video}/${rs.addView}` }, data);

export const addIdToSavedList = (data: { profileId: string; videoId: string }) =>
  postRequest<{ success: true }>(
    { host, port, path: `/${rs.video}/${rs.add}/${rs.savedList}` },
    data
  );

export const removeIdFromSavedList = (data: { profileId: string; videoId: string }) =>
  postRequest<{ success: true }>(
    { host, port, path: `/${rs.video}/${rs.remove}/${rs.savedList}` },
    data
  );

// ffmpeg
export const generateFFmpeg = (videoId: string) =>
  getRequest<{ success: boolean }>({
    host,
    port,
    path: `/${rs.video}/${rs.ffmpeg}/${videoId}`,
  });

export const removeFFmpeg = (videoId: string) =>
  getRequest<{ success: boolean }>({
    host,
    port,
    path: `/${rs.video}/${rs.ffmpeg}/${rs.remove}/${videoId}`,
  });
