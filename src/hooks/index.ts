import { useCallback, useEffect, useState } from 'react';

const getWindowDimensions = () => ({
  width: window.innerWidth,
  height: window.innerHeight,
});

const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    const handleResize = () => setWindowDimensions(getWindowDimensions());

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
};

const useLocalStorage = () => {
  const setLocalStorage = useCallback(
    (key: string, value: string) => localStorage.setItem(key, value),
    []
  );

  const removeLocalStorage = useCallback((key: string) => localStorage.removeItem(key), []);

  const getLocalStorage = useCallback((key: string) => localStorage.getItem(key), []);

  return { getLocalStorage, setLocalStorage, removeLocalStorage };
};

const useSessionStorage = () => {
  const setSessionStorage = useCallback((key: string, value: string) => {
    sessionStorage.setItem(key, value);
  }, []);

  const removeSessionStorage = useCallback((key: string) => {
    sessionStorage.removeItem(key);
  }, []);

  const getSessionStorage = useCallback((key: string) => sessionStorage.getItem(key), []);

  return { getSessionStorage, setSessionStorage, removeSessionStorage };
};

const usePageTitle = () => {
  const setPageTitle = useCallback((value: string) => {
    const title = document.querySelector('title');
    if (title) title.innerText = `${value} | Movie Website`;
  }, []);

  return { setPageTitle };
};

export { useWindowDimensions, useLocalStorage, useSessionStorage, usePageTitle };
