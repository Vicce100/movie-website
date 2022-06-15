import { AxiosError } from 'axios';
import { loginUser, createUser, logoutUser, getUser, addProfile as profileAdd } from './apiService';
import { CurrentUserType } from '../utils/types';

type SignUpDataType = { firstName: string; lastName: string; email: string; password: string };
type LoginErrorType = { message: string; status: string; currentUser?: CurrentUserType | null };

export const login = async (data: { email: string; password: string }) =>
  loginUser(data)
    .then((res) => res)
    .catch((error: AxiosError<LoginErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const signUp = async (data: SignUpDataType) =>
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

export const getCurrentUser = () =>
  getUser()
    .then((res) => res)
    .catch((error: AxiosError<LoginErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const addProfile = async (data: { profileName: string; avatarURL: string }) =>
  profileAdd(data)
    .then((res) => res)
    .catch((error: AxiosError<LoginErrorType>) => {
      throw new Error(error.response?.data.message);
    });
