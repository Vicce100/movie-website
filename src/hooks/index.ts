import { useCallback, useEffect, useState } from 'react';

const getWindowDimensions = () => ({
  width: window.innerWidth,
  height: window.innerHeight,
});

export const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    const handleResize = () => setWindowDimensions(getWindowDimensions());

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
};

export const useLocalStorage = () => {
  const setLocalStorage = useCallback(
    (key: string, value: string) => localStorage.setItem(key, value),
    []
  );

  const removeLocalStorage = useCallback((key: string) => localStorage.removeItem(key), []);

  const getLocalStorage = useCallback((key: string) => localStorage.getItem(key), []);

  return { getLocalStorage, setLocalStorage, removeLocalStorage };
};

export const useSessionStorage = () => {
  const setSessionStorage = useCallback((key: string, value: string) => {
    sessionStorage.setItem(key, value);
  }, []);

  const removeSessionStorage = useCallback((key: string) => {
    sessionStorage.removeItem(key);
  }, []);

  const getSessionStorage = useCallback((key: string) => sessionStorage.getItem(key), []);

  return { getSessionStorage, setSessionStorage, removeSessionStorage };
};

export const usePageTitle = () => {
  const setPageTitle = useCallback((value: string) => {
    const title = document.querySelector('title');
    if (title) title.innerText = `${value} | Movie Website`;
  }, []);

  return { setPageTitle };
};

export const useFormateTime = () => {
  const formateTimeFromMilliseconds = useCallback((timeInMilliseconds: number) => {
    const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
      minimumIntegerDigits: 2,
    });

    const seconds = Math.floor(timeInMilliseconds % 60);
    const minutes = Math.floor(timeInMilliseconds / 60) % 60;
    const hours = Math.floor(timeInMilliseconds / 3600);
    if (hours === 0) return `${minutes}:${leadingZeroFormatter.format(seconds)}`;

    return `${hours}:${leadingZeroFormatter.format(minutes)}:${leadingZeroFormatter.format(
      seconds
    )}`;
  }, []);
  return { formateTime: formateTimeFromMilliseconds };
};

export const useAsync = (callback: () => Promise<unknown>, dependencies: unknown[] = []) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);
  const [value, setValue] = useState<unknown>(null);

  const callbackMemoized = useCallback(() => {
    setIsLoading(true);
    setError(undefined);
    setValue(undefined);
    callback()
      .then(setValue)
      .catch(setError)
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies, callback]);

  useEffect(() => {
    callbackMemoized();
  }, [callbackMemoized]);

  return { isLoading, error, value };
};

const DEFAULT_OPTIONS: RequestInit = {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
};

export const useFetch1 = (url: string, options: RequestInit = {}, dependencies: unknown[] = []) =>
  useAsync(
    () =>
      fetch(url, { ...DEFAULT_OPTIONS, ...options }).then(async (res) => {
        if (res.ok) return res.json();
        throw new Error(await res.json());
      }),
    dependencies
  );

export const useFetch2 = <T>(url: string, options: RequestInit = {}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);
  const [value, setValue] = useState<T | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const response: T = await (await fetch(url, { ...DEFAULT_OPTIONS, ...options })).json();
      setValue(response);
    } catch (tempError) {
      setError(tempError);
    }
    setIsLoading(false);
  }, [options, url]);

  useEffect(() => {
    fetchData();
  }, [fetchData, options, url]);

  return { isLoading, error, value };
};
