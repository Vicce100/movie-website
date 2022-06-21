import axios, { AxiosResponse } from 'axios';
import { CategorySchemaType, CurrentUserType, ReturnAvatarType } from '../utils/types';

type EndpointType = { url: string; port: string; path: string };

const protocol = 'http';
const url = 'localhost';
const port = '5050';
axios.defaults.withCredentials = true;

// ---------- local ---------- //

const getRequest = async <T>(endpoint: EndpointType): Promise<AxiosResponse<T>> =>
  axios.get(`${protocol}://${endpoint.url}:${endpoint.port}${endpoint.path}`);

const postRequest = async <T>(endpoint: EndpointType, data?: object): Promise<AxiosResponse<T>> =>
  axios.post(`${protocol}://${endpoint.url}:${endpoint.port}${endpoint.path}`, data);

const deleteRequest = async <T>(endpoint: EndpointType, data?: object): Promise<AxiosResponse<T>> =>
  axios.delete(`${protocol}://${endpoint.url}:${endpoint.port}${endpoint.path}`, data);

const nonDataPostRequest = async <T>(endpoint: EndpointType): Promise<AxiosResponse<T>> =>
  axios.post(`${protocol}://${endpoint.url}:${endpoint.port}${endpoint.path}`);

// ---------- local ---------- //

export const loginUser = async (data: { email: string; password: string }) =>
  postRequest<CurrentUserType>({ url, port, path: '/user/login' }, data);

export const createUser = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => postRequest<CurrentUserType>({ url, port, path: '/user/create' }, data);

export const logoutUser = () => deleteRequest<CurrentUserType>({ url, port, path: '/user/logout' });

export const deleteUser = (data: { email: string; password: string; userId: string }) =>
  postRequest<CurrentUserType>({ url, port, path: '/user/delete' }, data);

export const userRefreshToken = (data: { refreshToken: string }) =>
  postRequest<CurrentUserType>({ url, port, path: '/user/refreshToken' }, data);

export const getUser = () =>
  getRequest<CurrentUserType>({ url, port, path: '/user/getCurrentUser' });

export const addProfile = (data: { profileName: string; avatarURL: string }) =>
  postRequest({ url, port, path: '/user/addProfile' }, data);

export const uploadSingleCategory = (data: { category: string }) =>
  postRequest({ url, port, path: '/category/upload/single' }, data);

export const uploadMultipleCategory = (data: { categories: string[] }) =>
  postRequest({ url, port, path: '/category/upload/multiple' }, data);

export const getSingleCategory = (categoryId: string) =>
  getRequest<CategorySchemaType>({ url, port, path: `/category/${categoryId}` });

export const getAllCategory = () =>
  getRequest<CategorySchemaType[]>({ url, port, path: '/category/get/multiple' });

export const getSingleAvatar = (avatarId: string) =>
  getRequest<ReturnAvatarType>({ url, port, path: `/avatar/${avatarId}` });

export const getAllAvatars = () =>
  getRequest<ReturnAvatarType[]>({ url, port, path: '/avatar/get/multiple' });
