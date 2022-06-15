import axios, { AxiosResponse } from 'axios';
import { CategorySchemaType, CurrentUserType } from '../utils/types';

type EndpointType = { url: string; port: string; path: string };

const protocol = 'http';
axios.defaults.withCredentials = true;

// ---------- local ---------- //

const getRequest = async <T>(endpoint: EndpointType): Promise<AxiosResponse<T>> =>
  axios.post(`${protocol}://${endpoint.url}:${endpoint.port}${endpoint.path}`);

const postRequest = async <T>(endpoint: EndpointType, data?: object): Promise<AxiosResponse<T>> =>
  axios.post(`${protocol}://${endpoint.url}:${endpoint.port}${endpoint.path}`, data);

const deleteRequest = async <T>(endpoint: EndpointType, data?: object): Promise<AxiosResponse<T>> =>
  axios.delete(`${protocol}://${endpoint.url}:${endpoint.port}${endpoint.path}`, data);

const nonDataPostRequest = async <T>(endpoint: EndpointType): Promise<AxiosResponse<T>> =>
  axios.post(`${protocol}://${endpoint.url}:${endpoint.port}${endpoint.path}`);

// ---------- local ---------- //

export const loginUser = async (data: { email: string; password: string }) =>
  postRequest<CurrentUserType>({ url: 'localhost', port: '5050', path: '/user/login' }, data);

export const createUser = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => postRequest<CurrentUserType>({ url: 'localhost', port: '5050', path: '/user/create' }, data);

export const logoutUser = () =>
  deleteRequest<CurrentUserType>({ url: 'localhost', port: '5050', path: '/user/logout' });

export const deleteUser = (data: { email: string; password: string; userId: string }) =>
  postRequest<CurrentUserType>({ url: 'localhost', port: '5050', path: '/user/delete' }, data);

export const userRefreshToken = (refreshToken: string) =>
  postRequest<CurrentUserType>(
    { url: 'localhost', port: '5050', path: '/user/refreshToken' },
    { refreshToken }
  );

export const getUser = () =>
  getRequest<CurrentUserType>({ url: 'localhost', port: '5050', path: '/user/getCurrentUser' });

export const addProfile = (data: { profileName: string; avatarURL: string }) =>
  postRequest({ url: 'localhost', port: '5050', path: '/user/addProfile' }, data);

export const uploadSingleCategory = (data: { category: string }) =>
  postRequest({ url: 'localhost', port: '5050', path: '/category/upload/single' }, data);

export const uploadMultipleCategory = (data: { categories: string[] }) =>
  postRequest({ url: 'localhost', port: '5050', path: '/category/upload/multiple' }, data);

export const getSingleCategory = (categoryId: string) =>
  getRequest<CategorySchemaType>({
    url: 'localhost',
    port: '5050',
    path: `/category/${categoryId}`,
  });

export const getAllCategory = () =>
  getRequest<CategorySchemaType>({ url: 'localhost', port: '5050', path: '/category/all' });
