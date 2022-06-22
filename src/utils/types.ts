export const userRole: {
  superAdmin: 'superAdmin';
  admin: 'admin';
  user: 'user';
} = {
  superAdmin: 'superAdmin',
  admin: 'admin',
  user: 'user',
};

type UsersRolesType = 'superAdmin' | 'admin' | 'user';
type UserStatusType = 'active' | 'disabled';

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
