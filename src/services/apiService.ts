/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

import axios, { AxiosResponse } from 'axios';
import {
  CategorySchemaType,
  CurrentUserType,
  ReturnAvatarType,
  ReturnedVideoData,
  ReturnedVideoDataByCategory,
  UsersRolesType,
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

export const uploadSingleCategory = (data: { category: string }) =>
  postRequest({ host, port, path: '/category/upload/single' }, data);

export const uploadMultipleCategory = (data: { categories: string[] }) =>
  postRequest({ host, port, path: '/category/upload/multiple' }, data);

export const getSingleCategory = (categoryId: string) =>
  getRequest<CategorySchemaType>({ host, port, path: `/category/${categoryId}` });

export const getAllCategory = () =>
  getRequest<CategorySchemaType[]>({ host, port, path: '/category/get/multiple' });

export const getSingleAvatar = (avatarId: string) =>
  getRequest<ReturnAvatarType>({ host, port, path: `/avatar/${avatarId}` });

export const getAllAvatars = () =>
  getRequest<ReturnAvatarType[]>({ host, port, path: '/avatar/get/multiple' });

export const getSingleVIdeoData = (videoId: string) =>
  getRequest<ReturnedVideoData>({ host, port, path: `/video/data/${videoId}` });

export const getVideoByCategory = (categoryName: string) =>
  getRequest<ReturnedVideoDataByCategory>({
    host,
    port,
    path: `/video/data/category/${categoryName}`,
  });

export const generateFFmpeg = (videoId: string) =>
  getRequest<{ success: boolean }>({
    host,
    port,
    path: `/video/ffmpeg/${videoId}`,
  });

export const checkAuth = () =>
  getRequest<{ isLoggedIn: false }>({ host, port, path: `/user/checkAuth` });

export const checkAuthRole = (roleType: UsersRolesType) =>
  getRequest<{ access: boolean }>({ host, port, path: `/user/checkAuth/${roleType}` });
