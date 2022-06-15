import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SignupStyle.scss';
import { signUp } from '../services/userService';
import { useSetCurrentUser } from '../contexts/UserAuth';

const SignUp = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  const lastNameRef = useRef<HTMLInputElement | null>(null);
  const firstNameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const navigate = useNavigate();
  const [setUserContext] = useSetCurrentUser();

  useEffect(() => {
    if (!error) return;
    setTimeout(() => setError(null), 5000);
  }, [error]);

  // const handleError = useCallback(
  //   (e: { code: number | string; message: React.SetStateAction<string | null> }) => {
  //     const errorCases = {
  //       alreadyInUse: 'auth/email-already-in-use',
  //       notValidEmail: 'auth/invalid-email',
  //       notValidPassword: 'auth/weak-password',
  //     };
  //     switch (e.code) {
  //       case errorCases.alreadyInUse:
  //         setError('This email is already in use');
  //         break;
  //       case errorCases.notValidEmail:
  //         setError('This email is not valid');
  //         break;
  //       case errorCases.notValidPassword:
  //         setError('This password is not strong enough');
  //         break;

  //       default:
  //         setError(e.message);
  //         break;
  //     }
  //   },
  //   []
  // );

  const submitSignUp = useCallback(
    (event: { preventDefault: () => void }) => {
      event.preventDefault();
      if (!firstName || !lastName || !email || !password) return;
      setIsLoggingIn(true);

      signUp({ firstName, lastName, email, password })
        .then((res) => {
          if (res.status === 200) setUserContext({ currentUser: res.data.currentUser });
          if (passwordRef.current?.value) passwordRef.current.value = '';
          if (emailRef.current?.value) emailRef.current.value = '';
          setEmail('');
          setPassword('');
          setIsLoggingIn(false);
          return navigate(`/`);
        })
        .catch((e) => {
          setError(e);
          console.log(e);
        });
    },
    [firstName, lastName, email, password, setUserContext, navigate]
  );

  const renderInput = useCallback(
    (
      ref: React.MutableRefObject<HTMLInputElement | null>,
      setStateValue: React.Dispatch<React.SetStateAction<string | null>>,
      text: string
    ) => (
      <input
        className="input-field"
        onClick={() => setError(null)}
        ref={ref}
        onChange={({ target }) => setStateValue(target.value)}
        type={text}
        defaultValue=""
        placeholder={text}
        name={text}
      />
    ),
    []
  );

  return (
    <div className="SignUp-container">
      <div className="SignUp-div-for-form">
        <h1 className="page-title">SignUp Page</h1>
        <form onSubmit={submitSignUp} className="SignUp-form">
          <div className="input-div">
            {renderInput(firstNameRef, setFirstName, 'firstName')}
            {renderInput(lastNameRef, setLastName, 'lastName')}
            {renderInput(emailRef, setEmail, 'email')}
            {renderInput(passwordRef, setPassword, 'password')}
          </div>
          <button className="submit-button" type="submit">
            SignUp
          </button>
          {/* <h4>{error || null}</h4> */}
        </form>
        <button className="navigation-link" type="button" onClick={() => navigate(`/login`)}>
          Go To Login
        </button>
      </div>
    </div>
  );
};

export default SignUp;
