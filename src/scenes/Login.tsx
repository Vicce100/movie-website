import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/userService';
// import { useWindowDimensions } from '../hooks';
import '../styles/LoginStyle.scss';
import { useSetCurrentUser } from '../contexts/UserAuth';

const Login = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // const { width, height } = useWindowDimensions();

  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwdRef = useRef<HTMLInputElement | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (error) setTimeout(() => setError(null), 5000);
  }, [error]);

  // const handleError = useCallback((e) => {
  //   const errorCases = {
  //     password: 'auth/wrong-password',
  //     notFound: 'auth/user-not-found',
  //     disabled: 'auth/user-disabled',
  //     invalidEmail: 'auth/invalid-email',
  //   };
  //   switch (e.code) {
  //     case errorCases.password:
  //       setError('Wrong email or password');
  //       break;
  //     case errorCases.notFound:
  //       setError('User not found');
  //       break;
  //     case errorCases.disabled:
  //       setError('User has been disabled');
  //       break;
  //     case errorCases.invalidEmail:
  //       setError('Email invalid');
  //       break;

  //     default:
  //       setError(e.message);
  //       break;
  //   }
  // }, []);

  const [setUserContext] = useSetCurrentUser();

  const submitLogin = useCallback(
    async (event: { preventDefault: () => void }) => {
      event.preventDefault();
      if (!email || !password) return;
      setIsLoggingIn(true);

      login({ email, password })
        .then((res) => {
          if (res.status === 200) setUserContext({ currentUser: res.data.currentUser });
          // if (!res.ok) return setError(res.statusText);
          if (passwdRef.current?.value) passwdRef.current.value = '';
          if (emailRef.current?.value) emailRef.current.value = '';
          setEmail('');
          setPassword('');
          setIsLoggingIn(false);
          return navigate(`/`);
        })
        .catch((e: string) => {
          setError(e);
          console.log(e);
        });
    },
    [navigate, password, setUserContext, email]
  );

  return (
    <div>
      <div className="Login-container">
        <div className="Login-div-for-form">
          <h1 className="page-title">Login Page</h1>
          <form onSubmit={submitLogin} className="login-form">
            <div className="input-div">
              <input
                className="input-field"
                ref={emailRef}
                onChange={({ target }) => setEmail(target.value)}
                onClick={() => setError(null)}
                type="email"
                defaultValue=""
                placeholder="email"
                name="email"
              />
              <input
                className="input-field"
                ref={passwdRef}
                onChange={({ target }) => setPassword(target.value)}
                onClick={() => setError(null)}
                type="password"
                defaultValue=""
                placeholder="password"
                name="password"
              />
            </div>
            <button className="submit-button" type="submit">
              login
            </button>
            {/* <h4>{error || null}</h4> */}
          </form>
          <button className="navigation-link" type="button" onClick={() => navigate(`/signUp`)}>
            Go To Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
