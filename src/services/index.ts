import { AxiosError } from 'axios';
import { CurrentUserType } from '../utils/types';
import {
  uploadSingleCategory as singleCategoryUpload,
  uploadMultipleCategory as multipleCategory,
  getSingleCategory as singleCategoryGet,
  getAllCategory as allCategoryGet,
} from './apiService';

type LoginErrorType = { message: string; status: string; currentUser?: CurrentUserType | null };

export const uploadSingleCategory = (data: { category: string }) =>
  singleCategoryUpload(data)
    .then((res) => res)
    .catch((error: AxiosError<LoginErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const uploadMultipleCategory = (data: { categories: string[] }) =>
  multipleCategory(data)
    .then((res) => res)
    .catch((error: AxiosError<LoginErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const getSingleCategory = (categoryId: string) =>
  singleCategoryGet(categoryId)
    .then((res) => res)
    .catch((error: AxiosError<LoginErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const getAllCategory = () =>
  allCategoryGet()
    .then((res) => res)
    .catch((error: AxiosError<LoginErrorType>) => {
      throw new Error(error.response?.data.message);
    });
