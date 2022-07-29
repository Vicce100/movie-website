/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo, useContext, useCallback, useEffect } from 'react';
import { useLocalStorage, useSessionStorage } from '../hooks/index';
import { CurrentUserType, ActiveProfileType } from '../utils/types';

export interface TempActiveProfileType {
  activeProfile: ActiveProfileType | null;
}

const UserContext = React.createContext({} as CurrentUserType);
const SetUserContext = React.createContext({} as React.Dispatch<CurrentUserType | null>);

const UserProfileContext = React.createContext({} as TempActiveProfileType);
const SetUserProfileContext = React.createContext({} as React.Dispatch<ActiveProfileType | null>);

export const useSetCurrentUser = () => {
  const setUserContext: React.Dispatch<CurrentUserType | null> = useContext(SetUserContext);
  return [setUserContext];
};

export const useSetActiveProfile = () => {
  const SetProfileContext: React.Dispatch<ActiveProfileType | null> =
    useContext(SetUserProfileContext);
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
  const { setLocalStorage, getLocalStorage, removeLocalStorage } = useLocalStorage();
  const { setSessionStorage, getSessionStorage, removeSessionStorage } = useSessionStorage();

  const getLocalStoredValue = useCallback(
    (key: string): CurrentUserType | null => {
      const value = getLocalStorage(key);
      if (!value) return null;
      return JSON.parse(value).currentUser;
    },
    [getLocalStorage]
  );

  const getSessionStoredValue = useCallback(
    (key: string): CurrentUserType | null => {
      const value = getSessionStorage(key);
      if (!value) return null;
      return JSON.parse(value);
    },
    [getSessionStorage]
  );

  const [currentUser, setCurrentUser] = useState<any | null>(getLocalStoredValue('currentUser'));
  const [activeProfile, setActiveProfile] = useState<any | null>(
    getSessionStoredValue('activeProfile')
  );

  const authState = useMemo(() => ({ currentUser }), [currentUser]);
  const profileState = useMemo(() => ({ activeProfile }), [activeProfile]);

  const updateCurrentUser = useCallback(
    (value: CurrentUserType | null) => {
      setCurrentUser(value?.currentUser);
      if (value?.currentUser) setLocalStorage('currentUser', JSON.stringify(value));
      else removeLocalStorage('currentUser');
    },
    [removeLocalStorage, setLocalStorage]
  );

  const updateActiveProfile = useCallback(
    (value: ActiveProfileType | null) => {
      setActiveProfile(value);
      if (!value) removeSessionStorage('activeProfile');
      else setSessionStorage('activeProfile', JSON.stringify(value));
    },
    [removeSessionStorage, setSessionStorage]
  );

  // useEffect(() => {
  //   if (currentUser && activeProfile) {
  //     updateActiveProfile(
  //       currentUser.profiles.fund(
  //         ({ _id }: { _id: string }) => _id === activeProfile._id
  //       )
  //     );
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [currentUser]);

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
