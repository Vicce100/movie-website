import { AxiosError } from 'axios';
import {
  uploadSingleCategory as singleCategoryUpload,
  uploadMultipleCategory as multipleCategory,
  getSingleCategory as singleCategoryGet,
  getAllCategory as allCategoryGet,
  getSingleAvatar as singleAvatarGet,
  getAllAvatars as allAvatarGet,
  getSingleVIdeoData as singleVIdeoDataGet,
  getVideoByCategory as videoByCategoryGet,
  generateFFmpeg as ffmpegGenerate,
  removeFFmpeg as ffmpegRemove,
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

export const getSingleVIdeoData = (videoId: string) =>
  singleVIdeoDataGet(videoId)
    .then((res) => res)
    .catch((error: AxiosError<ErrorType>) => {
      throw new Error(error.response?.data.message);
    });

export const getVideoByCategory = (categoryName: string) =>
  videoByCategoryGet(categoryName)
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
