import { AxiosError } from 'axios';
import {
  uploadSingleCategory as singleCategoryUpload,
  uploadMultipleCategory as multipleCategory,
  getSingleCategory as singleCategoryGet,
  getAllCategory as allCategoryGet,
  uploadSingleFranchise as singleFranchiseUpload,
  uploadMultipleFranchise as multipleFranchiseUpload,
  getSingleFranchise as singleFranchiseGet,
  getAllFranchise as allFranchiseGet,
  getSingleAvatar as singleAvatarGet,
  getAllAvatars as allAvatarGet,
} from './apiService';

type ErrorType = { message: string; status: string };

export const uploadSingleCategory = (data: { category: string }) =>
  singleCategoryUpload(data)
    .then((res) => res)
    .catch((error: AxiosError<ErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const uploadMultipleCategory = (data: { categories: string[] }) =>
  multipleCategory(data)
    .then((res) => res)
    .catch((error: AxiosError<ErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const getSingleCategory = (categoryId: string) =>
  singleCategoryGet(categoryId)
    .then((res) => res)
    .catch((error: AxiosError<ErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const getAllCategory = () =>
  allCategoryGet()
    .then((res) => res)
    .catch((error: AxiosError<ErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const uploadSingleFranchise = (data: { Franchise: string }) =>
  singleFranchiseUpload(data)
    .then((res) => res)
    .catch((error: AxiosError<ErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const uploadMultipleFranchise = (data: { franchises: string[] }) =>
  multipleFranchiseUpload(data)
    .then((res) => res)
    .catch((error: AxiosError<ErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const getSingleFranchise = (franchiseId: string) =>
  singleFranchiseGet(franchiseId)
    .then((res) => res)
    .catch((error: AxiosError<ErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const getAllFranchise = () =>
  allFranchiseGet()
    .then((res) => res)
    .catch((error: AxiosError<ErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const getSingleAvatar = (avatarId: string) =>
  singleAvatarGet(avatarId)
    .then((res) => res)
    .catch((error: AxiosError<ErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const getAllAvatars = () =>
  allAvatarGet()
    .then((res) => res)
    .catch((error: AxiosError<ErrorType>) => {
      throw new Error(error.response?.data.message);
    });
