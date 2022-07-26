// export const userRoles = Object.freeze({})
export const userRoles = {
  user: 'user' as const,
  moderator: 'moderator' as const,
  admin: 'admin' as const,
  superAdmin: 'superAdmin' as const,
};

export const routesString = Object.freeze({
  video: 'video',
  category: 'category',
  franchise: 'franchise',
  avatar: 'avatar',
  user: 'user',
  movie: 'movie',
  episode: 'episode',
  series: 'series',
  upload: 'upload',
  single: 'single',
  multiple: 'multiple',
  data: 'data',
  addView: 'addView',
  ffmpeg: 'ffmpeg',
  create: 'create',
  login: 'login',
  logout: 'logout',
  refreshToken: 'refreshToken',
  addProfile: 'addProfile',
  getCurrentUser: 'getCurrentUser',
  checkAuth: 'checkAuth',
  get: 'get',
  delete: 'delete',
  remove: 'remove',
  videoId: 'videoId',
  movieId: 'movieId',
  episodeId: 'episodesId',
  seriesId: 'seriesId',
  categoryId: 'categoryId',
  franchiseId: 'franchiseId',
  avatarId: 'avatarId',
  categoryName: 'categoryName',
  roleType: 'roleType',
});

export const queryPaths = Object.freeze({
  myList: 'myList',
  continueWatching: 'continueWatching',
  watchAged: 'watchAged',
  becauseYouWatch: 'becauseYouWatch',
  becauseYouLiked: 'becauseYouLiked',
  forYou: 'forYou',
  newlyAdded: 'newlyAdded',
  popular: 'popular',
  top10movies: 'top10movies',
  top10series: 'top10series',
  randomMovie: 'randomMovie',
  randomSeries: 'randomSeries',
});

export type queryPathsString =
  | 'myList'
  | 'continueWatching'
  | 'watchAged'
  | 'becauseYouWatch'
  | 'becauseYouLiked'
  | 'forYou'
  | 'newlyAdded'
  | 'popular'
  | 'top10movies'
  | 'top10series'
  | 'randomMovie'
  | 'randomSeries';

export type UsersRolesType = 'user' | 'moderator' | 'admin' | 'superAdmin';
export type UserStatusType = 'active' | 'disabled';

export type ReturnedVideoDataByCategory = {
  _id: string;
  title: string;
  displayPicture: string;
}[];

export type ReturnedVideoData = {
  _id: string;
  isMovie: boolean;
  previewImagesUrl: string[];
  title: string;
  episodeTitle: string | undefined;
  sessionNr: number | undefined;
  episodeNr: number | undefined;
  seriesId: string | undefined;
  videoUrl: string;
  displayPicture: string;
};

export interface SeriesSchemaType {
  _id: string;
  title: string;
  displayPicture: string;
  views: number;
  monthlyViews: number;
  public: boolean;
  categories: string[];
  franchise: string[];
  description: string;
  uploadDate: string;
  creationDate: string;
  latestDate: string;
  episodesId: string[];
  amountOfSessions: number;
  creatorsId: string;
}

export interface EpisodeSchemaType {
  _id: string;
  sessionNr: number;
  episodeNr: number;
  seriesId: string;
  seriesTitle: string;
  episodeTitle: string;
  public: boolean;
  videoUrl: string;
  previewImagesUrl: string[];
  displayPicture: string;
  description: string;
  creatorsId: string;
  uploadDate: string;
  releaseDate: string;
}

export interface MovieSchemaType {
  _id: string;
  title: string;
  videoUrl: string;
  previewImagesUrl: string[];
  displayPicture: string;
  public: boolean;
  categories: string[];
  franchise: string[];
  description: string;
  views: number;
  monthlyViews: number;
  creatorsId: string;
  uploadDate: string;
  releaseDate: string;
}

export interface CategorySchemaType {
  _id: string;
  name: string;
  // url: string;
}

export interface FranchiseSchemaType {
  _id: string;
  name: string;
}

export interface ReturnAvatarType {
  id: string;
  categories: string[];
  name: string;
  url: string;
  urlPath: string;
}

export interface AvatarSchemaType {
  _id: string;
  categories: string[];
  name: string;
  url: string;
}

export interface ActiveProfileType {
  _id: string;
  profileName: string;
  avatarURL: string;
}

export type ProfileType = {
  _id: string;
  profileName: string;
  avatarURL: string;
  savedList?: string[];
  likedList?: string[];
  hasWatch?: string[];
}[];

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface CurrentUserType {
  currentUser: {
    id: string;
    email: string;
    createdAt: string;
    refreshToken: string;
    firstName: string;
    lastName: string;
    profiles: ProfileType;
    role: UsersRolesType;
    userStatus: UserStatusType;
  } | null;
}
