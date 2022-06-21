/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo, useContext, useCallback, useEffect } from 'react';
import { CurrentUserType, ActiveProfileType } from '../utils/types';

export interface TempActiveProfileType {
  activeProfile: ActiveProfileType | null;
}

const UserContext = React.createContext({} as CurrentUserType);
const SetUserContext = React.createContext({} as React.Dispatch<CurrentUserType>);

const UserProfileContext = React.createContext({} as TempActiveProfileType);
const SetUserProfileContext = React.createContext({} as React.Dispatch<ActiveProfileType>);

export const useSetCurrentUser = () => {
  const setUserContext: React.Dispatch<CurrentUserType> = useContext(SetUserContext);
  return [setUserContext];
};

export const useSetActiveProfile = () => {
  const SetProfileContext: React.Dispatch<ActiveProfileType> = useContext(SetUserProfileContext);
  return [SetProfileContext];
};

export const useCurrentUserContext = () => {
  const userContext = useContext(UserContext);

  if (userContext === undefined) {
    throw new Error('auth context error');
  }

  return userContext;
};

export const useProfileContext = () => useContext(UserProfileContext);

export function UserAuth({ children }: { children?: React.ReactNode }): JSX.Element {
  const getStoredUser = useCallback((): CurrentUserType | null => {
    const value = localStorage.getItem('currentUser');
    if (value === null) return null;
    return JSON.parse(value).currentUser;
  }, []);

  const getStoredActiveProfile = useCallback((): CurrentUserType | null => {
    const value = localStorage.getItem('activeProfile');
    if (value === null) return null;
    return JSON.parse(value);
  }, []);

  const [currentUser, setCurrentUser] = useState<any | null>(getStoredUser());
  const [activeProfile, setActiveProfile] = useState<any | null>(getStoredActiveProfile());

  const authState = useMemo(() => ({ currentUser }), [currentUser]);
  const profileState = useMemo(() => ({ activeProfile }), [activeProfile]);

  const updateCurrentUser = useCallback((value: CurrentUserType | null) => {
    setCurrentUser(value?.currentUser);
    if (value?.currentUser) localStorage.setItem('currentUser', JSON.stringify(value));
    else localStorage.removeItem('currentUser');
  }, []);

  const updateActiveProfile = useCallback((value: ActiveProfileType | null) => {
    setActiveProfile(value);
    if (!value) localStorage.removeItem('activeProfile');
    else localStorage.setItem('activeProfile', JSON.stringify(value));
  }, []);

  return (
    <UserContext.Provider value={authState}>
      <SetUserContext.Provider value={updateCurrentUser}>
        <UserProfileContext.Provider value={profileState}>
          <SetUserProfileContext.Provider value={updateActiveProfile}>
            {children}
          </SetUserProfileContext.Provider>
        </UserProfileContext.Provider>
      </SetUserContext.Provider>
    </UserContext.Provider>
  );
}

UserAuth.defaultProps = { children: null };
