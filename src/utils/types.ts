export const userRole: {
  superAdmin: 'superAdmin';
  admin: 'admin';
  moderator: 'moderator';
  user: 'user';
} = {
  superAdmin: 'superAdmin',
  admin: 'admin',
  moderator: 'moderator',
  user: 'user',
};

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
  title: string;
  episodeTitle: string | undefined;
  sessionNr: number | undefined;
  episodeNr: number | undefined;
  seriesId: string | undefined;
  videoUrl: string;
  displayPicture: string;
};

export interface MovieSchemaType {
  title: string;
  videoUrl: string;
  displayPicture: string;
  // album: string[];
  categories: string[];
  description: string;
  creatorsId: string;
  uploadDate: string;
  releaseDate: string;
}

export interface CategorySchemaType {
  _id: string;
  name: string;
  // url: string;
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
