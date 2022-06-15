export const userRole: {
  admin: 'admin';
  user: 'user';
} = {
  admin: 'admin',
  user: 'user',
};

type UsersRolesType = 'admin' | 'user';
type UserStatusType = 'active' | 'disabled';

export interface CategorySchemaType {
  _id: string;
  name: string;
  // url: string;
}

export interface AvatarSchemaType {
  _id: string;
  category: string;
  name: string;
  url: string;
}

export type ProfileType = {
  id: string;
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
