/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback, useRef, useEffect, ReactElement } from 'react';
import { CSSTransition } from 'react-transition-group';
import { Link, useNavigate } from 'react-router-dom';

import {
  useCurrentUserContext,
  useSetCurrentUser,
  useProfileContext,
  useSetActiveProfile,
  useSetUserData,
} from '../contexts/UserAuth';
import { logout } from '../services/userService';
import { useRefreshToken } from '../hooks/index';

import { ReactComponent as LogoutWhite } from '../asset/svg/logout_white_36dp.svg';
import { ReactComponent as Plus } from '../asset/svg/plus.svg';
import { ReactComponent as DownArrow } from '../asset/svg/down-arrow-white.svg';
import { ReactComponent as SettingsWhite } from '../asset/svg/settings_white_36dp.svg';
import { ReactComponent as RightArrowWhite } from '../asset/svg/right-arrow-white.svg';
import { ReactComponent as LeftArrowWhite } from '../asset/svg/left-arrow-white.svg';
import { ReactComponent as Manager } from '../asset/svg/manager-9650.svg';
import { ReactComponent as Cookie } from '../asset/svg/cookie.svg';
import { ReactComponent as Home } from '../asset/svg/home_white_36dp.svg';
import { ReactComponent as Search } from '../asset/svg/search.svg';

import { ReactComponent as ArrowIcon } from '../asset/svg/arrow.svg';
import { ReactComponent as BoltIcon } from '../asset/svg/bolt.svg';

import { userRoles } from '../utils/types';
import '../styles/HeaderStyle.scss';

type MenuTypes = 'main' | 'profiles' | 'settings';

const menuOptions: {
  main: 'main';
  profiles: 'profiles';
  settings: 'settings';
} = {
  main: 'main',
  profiles: 'profiles',
  settings: 'settings',
};

function DropdownMenu() {
  const [activeMenu, setActiveMenu] = useState<MenuTypes>(menuOptions.main);
  const [menuHeight, setMenuHeight] = useState<number | null>(null);
  const dropdownRef = useRef<any>(null);

  const navigate = useNavigate();
  const [SetProfileContext] = useSetActiveProfile();
  const setUserData = useSetUserData();
  const { currentUser } = useCurrentUserContext();
  const { activeProfile } = useProfileContext();
  const callRefreshToken = useRefreshToken();

  useEffect(() => setMenuHeight(dropdownRef.current?.firstChild.offsetHeight), []);

  const calcHeight = useCallback(
    (el: { offsetHeight: React.SetStateAction<number | null> }) => setMenuHeight(el.offsetHeight),
    []
  );

  const DropdownItem = useCallback(
    (props: {
      children: ReactElement<any, any> | string;
      displayIcon?: any;
      extendIcon?: any;
      goToMenu?: MenuTypes;
      functionCall?: () => void;
    }) => (
      <button
        type="button"
        className="dropdown-item"
        onClick={() => {
          if (props.goToMenu) setActiveMenu(props.goToMenu);
          else if (props.functionCall) props.functionCall();
        }}
      >
        <span className="icon-button">{props.displayIcon}</span>
        {props.children}
        <span className="extend-icon">{props.extendIcon}</span>
      </button>
    ),
    []
  );

  const callLogout = useCallback(() => {
    logout()
      .then((res) => {
        console.log(res);
        if (res.status === 200) setUserData(null, null);
        window.location.reload();
        return navigate(`/`);
      })
      .catch((err) => {
        console.log(err);
        setUserData(null, null);
        window.location.reload();
      });
  }, [navigate, setUserData]);

  const callRefreshTokenHere = useCallback(() => {
    if (!activeProfile?._id) return;
    callRefreshToken(currentUser, activeProfile._id);
  }, [activeProfile?._id, callRefreshToken, currentUser]);

  return (
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    <div className="dropdown-div" style={{ height: menuHeight! }} ref={dropdownRef}>
      <CSSTransition
        in={activeMenu === menuOptions.main}
        timeout={500}
        classNames="menu-primary"
        unmountOnExit
        onEnter={calcHeight}
      >
        <div className="menu">
          <DropdownItem>
            <strong>Options</strong>
          </DropdownItem>
          <DropdownItem
            displayIcon={
              <img
                src={activeProfile?.avatarURL}
                alt={activeProfile?.profileName}
                className="menu-profile-avatar"
              />
            }
            extendIcon={<RightArrowWhite />}
            goToMenu={menuOptions.profiles}
          >
            profiles
          </DropdownItem>
          <DropdownItem
            displayIcon={<SettingsWhite />}
            extendIcon={<RightArrowWhite />}
            goToMenu={menuOptions.settings}
          >
            Settings
          </DropdownItem>
          <DropdownItem displayIcon={<Cookie />} functionCall={callRefreshTokenHere}>
            Update Auth Cookie
          </DropdownItem>
          {currentUser?.role === userRoles.admin ||
            currentUser?.role === userRoles.moderator ||
            (currentUser?.role === userRoles.superAdmin && (
              <DropdownItem displayIcon={<Manager />} functionCall={() => navigate('/admin')}>
                Admin Page
              </DropdownItem>
            ))}
          <DropdownItem displayIcon={<LogoutWhite />} functionCall={callLogout}>
            Logout
          </DropdownItem>
        </div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === menuOptions.settings}
        timeout={500}
        classNames="menu-secondary"
        unmountOnExit
        onEnter={calcHeight}
      >
        <div className="menu">
          <DropdownItem goToMenu="main" displayIcon={<ArrowIcon />}>
            <h2>My Tutorial</h2>
          </DropdownItem>
          <DropdownItem displayIcon={<BoltIcon />}>HTML</DropdownItem>
          <DropdownItem displayIcon={<BoltIcon />}>CSS</DropdownItem>
          <DropdownItem displayIcon={<BoltIcon />}>JavaScript</DropdownItem>
          <DropdownItem displayIcon={<BoltIcon />}>Awesome!</DropdownItem>
        </div>
      </CSSTransition>
      <CSSTransition
        in={activeMenu === menuOptions.profiles}
        unmountOnExit
        timeout={500}
        className="menu-secondary"
        onEnter={calcHeight}
      >
        <div className="menu">
          <DropdownItem displayIcon={<LeftArrowWhite />} goToMenu={menuOptions.main}>
            <strong>Profile</strong>
          </DropdownItem>
          {currentUser?.profiles &&
            currentUser?.profiles.map((profile) => (
              <DropdownItem
                key={profile._id}
                displayIcon={
                  <img
                    src={profile.avatarURL}
                    alt={profile.profileName}
                    className="menu-profile-avatar"
                  />
                }
                functionCall={() => {
                  SetProfileContext(profile);
                  window.location.reload();
                }}
              >
                {profile.profileName}
              </DropdownItem>
            ))}
          <DropdownItem displayIcon={<Plus />} functionCall={() => navigate('/Profile')}>
            Add Profile
          </DropdownItem>
        </div>
      </CSSTransition>
    </div>
  );
}

export default function Header() {
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);

  const navigate = useNavigate();
  const { currentUser } = useCurrentUserContext();
  if (!currentUser) return null;
  return (
    <div className="header-container">
      <div className="header-div">
        <div style={{ width: 50 }} />
        <button type="button" className="navigate-home-button" onClick={() => navigate('/')}>
          <Home />
        </button>
        <div style={{ flexDirection: 'row', display: 'flex' }}>
          <div className="search-link-div">
            <Link
              className="search-link"
              to="/search"
              onChange={(event) => event.nativeEvent.stopImmediatePropagation()}
            >
              <Search />
            </Link>
          </div>
          <button
            type="button"
            className="dropdown-button"
            onClick={() => setOpenDropdown(!openDropdown)}
          >
            <DownArrow />
          </button>
          {openDropdown ? <DropdownMenu /> : null}
        </div>
      </div>
    </div>
  );
}
