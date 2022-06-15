/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo, useContext, useCallback } from 'react';
import { CurrentUserType } from '../utils/types';

const UserContext = React.createContext({} as CurrentUserType);
const SetUserContext = React.createContext({} as React.Dispatch<CurrentUserType>);

export const useSetCurrentUser = () => {
  const setUserContext: React.Dispatch<CurrentUserType> = useContext(SetUserContext);
  return [setUserContext];
};

export const useCurrentUserContext = () => {
  const userContext = useContext(UserContext);

  if (userContext === undefined) {
    throw new Error('auth context error');
  }

  return userContext;
};

export function UserAuth({ children }: { children?: React.ReactNode }): JSX.Element {
  const getStoredUser = useCallback((): CurrentUserType | null => {
    const value = localStorage.getItem('currentUser');
    if (value === null) return null;
    return JSON.parse(value).currentUser;
  }, []);

  const [currentUser, setCurrentUser] = useState<any | null>(getStoredUser());

  const authState = useMemo(() => ({ currentUser }), [currentUser]);

  const updateCurrentUser = useCallback((value: CurrentUserType | null) => {
    setCurrentUser(value?.currentUser);
    if (value?.currentUser) localStorage.setItem('currentUser', JSON.stringify(value));
    else localStorage.removeItem('currentUser');
  }, []);

  return (
    <UserContext.Provider value={authState}>
      <SetUserContext.Provider value={updateCurrentUser}>{children}</SetUserContext.Provider>
    </UserContext.Provider>
  );
}

UserAuth.defaultProps = { children: null };
