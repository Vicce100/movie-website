// export const userRoles = Object.freeze({})
export const userRoles = {
  user: 'user' as const,
  moderator: 'moderator' as const,
  admin: 'admin' as const,
  superAdmin: 'superAdmin' as const,
};

export const routesString = {
  video: 'video' as const,
  category: 'category' as const,
  franchise: 'franchise' as const,
  avatar: 'avatar' as const,
  user: 'user' as const,
  movie: 'movie' as const,
  episode: 'episode' as const,
  episodes: 'episodes' as const,
  series: 'series' as const,
  upload: 'upload' as const,
  single: 'single' as const,
  multiple: 'multiple' as const,
  data: 'data' as const,
  search: 'search' as const,
  searchId: 'searchId' as const,
  searchText: 'searchText' as const,
  addView: 'addView' as const,
  ffmpeg: 'ffmpeg' as const,
  create: 'create' as const,
  add: 'add' as const,
  all: 'all' as const,
  savedList: 'savedList' as const,
  login: 'login' as const,
  logout: 'logout' as const,
  refreshToken: 'refreshToken' as const,
  addProfile: 'addProfile' as const,
  getCurrentUser: 'getCurrentUser' as const,
  checkAuth: 'checkAuth' as const,
  get: 'get' as const,
  delete: 'delete' as const,
  remove: 'remove' as const,
  videoId: 'videoId' as const,
  movieId: 'movieId' as const,
  episodeId: 'episodeId' as const,
  seriesId: 'seriesId' as const,
  categoryId: 'categoryId' as const,
  franchiseId: 'franchiseId' as const,
  avatarId: 'avatarId' as const,
  categoryName: 'categoryName' as const,
  roleType: 'roleType' as const,
};

export const queryPaths = {
  myList: 'myList' as const,
  continueWatching: 'continueWatching' as const,
  watchAged: 'watchAged' as const,
  becauseYouWatch: 'becauseYouWatch' as const,
  becauseYouLiked: 'becauseYouLiked' as const,
  forYou: 'forYou' as const,
  newlyAdded: 'newlyAdded' as const,
  popular: 'popular' as const,
  top10movies: 'top10movies' as const,
  top10series: 'top10series' as const,
  randomMovie: 'randomMovie' as const,
  randomSeries: 'randomSeries' as const,
};

export const descriptionMaxLength = 400;

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

export type returnVideos = {
  _id: string;
  title: string;
  isMovie: boolean;
  displayPicture: string;
};

export type returnVideosArray = {
  _id: string;
  title: string;
  isMovie: boolean;
  displayPicture: string;
}[];

export type ReturnedVideoData = {
  _id: string;
  isMovie: boolean;
  previewImagesUrl: string[];
  title: string;
  episodeTitle: string | undefined;
  session: number | undefined;
  episode: number | undefined;
  seriesId: string | undefined;
};

export interface ReturnedSeriesSchemaType {
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
  episodes: {
    episodeId: string;
    episodeTitle: string;
    episodeDisplayPicture: string;
    episodeDescription: string;
    durationInMs: number;
    seasonNr: number;
    episodeNr: number;
  }[][];
  amountOfSessions: number;
  amountOfEpisodes: number;
  creatorsId: string;
}

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
  episodes: string[];
  amountOfSessions: number;
  amountOfEpisodes: number;
  creatorsId: string;
}

export interface EpisodeSchemaType {
  _id: string;
  seasonNr: number;
  episodeNr: number;
  seriesId: string;
  seriesTitle: string;
  episodeTitle: string;
  durationInMs: number;
  views: number;
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
  durationInMs: number;
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
}

export interface FranchiseSchemaType {
  _id: string;
  name: string;
}

export interface ReturnAvatarType {
  _id: string;
  name: string;
  url: string;
  franchise: string[];
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
  savedList?: string[];
  likedList?: string[];
  hasWatch?: string[];
}

export type ProfileType =
  | {
      _id: string;
      profileName: string;
      avatarURL: string;
      savedList?: string[];
      likedList?: string[];
      hasWatch?: string[];
    }[]
  | undefined;

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
    moviesUploaded: string[];
    seriesUploaded: string[];
  } | null;
}
