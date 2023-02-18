// export const userRoles = Object.freeze({})

export const [PRODUCTION_STATUS, TMDB_BASE_URL, TMDB_IMAGE_URL, TMDB_API_KEY]: [
  'production' | 'develop',
  'https://api.themoviedb.org/3',
  'https://image.tmdb.org/t/p/original',
  'api_key=fb6a3f12eb4c66cf62d83119c53cb4ad'
] = [
  'develop',
  'https://api.themoviedb.org/3',
  'https://image.tmdb.org/t/p/original',
  'api_key=fb6a3f12eb4c66cf62d83119c53cb4ad',
];

export const [searchMovieString, searchSeriesString, getMovieGenre]: [
  '/search/movie?query=',
  '/search/tv?query=',
  '/genre/movie/list'
] = ['/search/movie?query=', '/search/tv?query=', '/genre/movie/list'];

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
  episodes: 'episodes',
  series: 'series',
  upload: 'upload',
  single: 'single',
  multiple: 'multiple',
  data: 'data',
  update: 'update',
  search: 'search',
  searchId: 'searchId',
  searchText: 'searchText',
  addView: 'addView',
  ffmpeg: 'ffmpeg',
  create: 'create',
  add: 'add',
  all: 'all',
  savedList: 'savedList',
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
  episodeId: 'episodeId',
  seriesId: 'seriesId',
  categoryId: 'categoryId',
  franchiseId: 'franchiseId',
  avatarId: 'avatarId',
  categoryName: 'categoryName',
  roleType: 'roleType',
});

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

export const isWatchingPaths = Object.freeze({
  addToMoviesWatched: 'addToMoviesWatched',
  addToSeriesWatched: 'addToSeriesWatched',
  removeSeriesWatched: 'removeSeriesWatched',
  removeEpisodeWatched: 'removeEpisodeWatched',
  setSeriesWatchedActiveEpisode: 'setSeriesWatchedActiveEpisode',
  updateSeriesWatchedActiveEpisode: 'updateSeriesWatchedActiveEpisode',
  addToSeriesWatchedEpisodes: 'addToSeriesWatchedEpisodes',
  updateSeriesWatchedEpisode: 'updateSeriesWatchedEpisode',
  updateMoviesWatched: 'updateMoviesWatched',
  removeMovieWatched: 'removeMovieWatched',
});

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

export type continueWatchingType = {
  _id: string; // ## movieId or seriesId
  episodeId: string | null;
  title: string;
  episodeTitle: string | null;
  sessionNr: number | null;
  episodeNr: number | null;
  trackId: number;
  duration: number;
  isMovie: boolean;
  displayPicture: string;
  episodeDisplayPicture: string | null;
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
  backdropPath: string;
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
  isWatchingMovie?: {
    movieId: string;
    trackId: number;
  }[];
  isWatchingSeries?: [
    {
      seriesId: string;
      activeEpisode: {
        episodeId: string;
        trackId: number;
      };
      watchedEpisodes: {
        episodeId: string;
        trackId: number;
      }[];
    }
  ];
}

export type ProfileType =
  | {
      _id: string;
      profileName: string;
      avatarURL: string;
      savedList?: string[];
      likedList?: string[];
      hasWatch?: string[];
      isWatchingMovie?: {
        movieId: string;
        trackId: number;
      }[];
      isWatchingSeries?: [
        {
          seriesId: string;
          activeEpisode: {
            episodeId: string;
            trackId: number;
          };
          watchedEpisodes: {
            episodeId: string;
            trackId: number;
          }[];
        }
      ];
    }[]
  | undefined;

export type CurrentUser = {
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
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface CurrentUserType {
  currentUser: CurrentUser | null;
}
