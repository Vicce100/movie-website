import { AxiosError } from 'axios';
import {
  loginUser,
  createUser,
  logoutUser,
  getUser,
  addProfile as profileAdd,
  userRefreshToken,
  checkAuth as AuthCheck,
  checkAuthRole as authRoleCheck,
} from './apiService';
import { CurrentUserType, UsersRolesType } from '../utils/types';

type SignUpDataType = { firstName: string; lastName: string; email: string; password: string };
type LoginErrorType = { message: string; status: string; currentUser?: CurrentUserType | null };

export const login = (data: { email: string; password: string }) =>
  loginUser(data)
    .then((res) => res)
    .catch((error: AxiosError<LoginErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const signUp = (data: SignUpDataType) =>
  createUser(data)
    .then((res) => res)
    .catch((error: AxiosError<LoginErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const logout = () =>
  logoutUser()
    .then((res) => res)
    .catch((error: AxiosError<LoginErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const refreshToken = (data: { refreshToken: string }) =>
  userRefreshToken(data)
    .then((res) => res)
    .catch((error: AxiosError<LoginErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const getCurrentUser = () =>
  getUser()
    .then((res) => res)
    .catch((error: AxiosError<LoginErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const addProfile = (data: { profileName: string; avatarURL: string }) =>
  profileAdd(data)
    .then((res) => res)
    .catch((error: AxiosError<LoginErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const checkAuth = () =>
  AuthCheck()
    .then((res) => res)
    .catch((error: AxiosError<LoginErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const checkAuthRole = (roleType: UsersRolesType) =>
  authRoleCheck(roleType)
    .then((res) => res)
    .catch((error: AxiosError<LoginErrorType>) => {
      throw new Error(error.response?.data.message);
    });
