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
  SeriesSchemaType,
  queryPathsString,
  FranchiseSchemaType,
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
  postRequest({ host, port, path: '/category/upload/single' }, data);

export const uploadMultipleCategory = (data: { categories: string[] }) =>
  postRequest<{ success: boolean }>({ host, port, path: '/category/upload/multiple' }, data);

export const getSingleCategory = (categoryId: string) =>
  getRequest<CategorySchemaType>({ host, port, path: `/category/${categoryId}` });

export const getAllCategory = () =>
  getRequest<CategorySchemaType[]>({ host, port, path: '/category/get/multiple' });

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
    path: `/${rs.franchiseId}/${rs.get}/${rs.multiple}`,
  });

// ---------- avatar ---------- //

export const getSingleAvatar = (avatarId: string) =>
  getRequest<ReturnAvatarType>({ host, port, path: `/${rs.avatar}/${avatarId}` });

export const getAllAvatars = () =>
  getRequest<ReturnAvatarType[]>({ host, port, path: '/avatar/get/multiple' });

// ---------- video ---------- //

export const getVideosData = (data: { queryName: queryPathsString; profileId: string }) =>
  postRequest<unknown[]>(
    {
      host,
      port,
      path: `/${rs.video}/${rs.data}}`,
    },
    data
  );

export const getMovieData = (movieId: string) =>
  getRequest<MovieSchemaType>({
    host,
    port,
    path: `/${rs.video}/${rs.movie}/${rs.data}/${movieId}`,
  });

export const getEpisodeData = (episodeId: string) =>
  getRequest<EpisodeSchemaType>({
    host,
    port,
    path: `/${rs.video}/${rs.episode}/${rs.data}/${episodeId}`,
  });

export const getMovieByCategory = (data: {
  categoryName1: string;
  categoryName2?: string;
  categoryName3?: string;
}) =>
  postRequest<MovieSchemaType[]>(
    {
      host,
      port,
      path: `/${rs.video}/${rs.movie}/${rs.data}/${rs.category}`,
    },
    data
  );

export const getSeriesByCategory = (data: {
  categoryName1: string;
  categoryName2?: string;
  categoryName3?: string;
}) =>
  postRequest<SeriesSchemaType[]>(
    {
      host,
      port,
      path: `/${rs.video}/${rs.series}/${rs.data}/${rs.category}`,
    },
    data
  );

export const addView = (data: { videoId: string; isMovie: boolean }) =>
  postRequest<{ success: true }>({ host, port, path: `/${rs.video}/${rs.addView}` }, data);

// ffmpeg
export const generateFFmpeg = (videoId: string) =>
  getRequest<{ success: boolean }>({
    host,
    port,
    path: `/video/ffmpeg/${videoId}`,
  });

export const removeFFmpeg = (videoId: string) =>
  getRequest<{ success: boolean }>({
    host,
    port,
    path: `/video/ffmpeg/remove/${videoId}`,
  });
