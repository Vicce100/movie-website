/* eslint-disable import/no-unresolved */
/* eslint-disable arrow-body-style */
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { ReactComponent as Plus } from '../asset/svg/plus.svg';
import { ReactComponent as Home } from '../asset/svg/home_white_36dp.svg';

import Header from '../component/Header';

import {
  useCurrentUserContext,
  useSetActiveProfile,
  useSetCurrentUser,
} from '../contexts/UserAuth';
import { addProfile, getCurrentUser } from '../services/userService';
import { getAllAvatars, getAllFranchise } from '../services';
import { useWindowDimensions, usePageTitle } from '../hooks/index';
import { ReturnAvatarType, ProfileType, returnVideosArray } from '../utils/types';

import '../styles/ProfileStyle.scss';

type AvatarType = {
  _id: string;
  name: string;
  activePage: number;
  avatars: ReturnAvatarType[];
}[];

export default function ProfileScene() {
  const [profiles, setProfiles] = useState<ProfileType | null>(null);
  const [avatarsFormFranchise, setAvatarsFormFranchise] = useState<AvatarType | null>(null);
  const [newProfileName, setNewProfileName] = useState<string>('');
  const [profileToEdit, setProfileToEdit] = useState<ProfileType | null>(null);

  const [isAddingProfile, setIsAddingProfile] = useState<boolean>(false);
  const [isEnditingProfiles, setIsEditingProfiles] = useState<boolean>(false);
  const [isChoosingAvatar, setIsChoosingAvatar] = useState<boolean>(false);

  const [itemPerPage, setItemPerPage] = useState<number>(6);

  const addingProfileRef = useRef<HTMLInputElement | null>(null);

  const rowVideoContainerRef1 = useRef<HTMLDivElement | null>(null);

  const { currentUser } = useCurrentUserContext();
  const [setActiveProfile] = useSetActiveProfile();
  const [setUserContext] = useSetCurrentUser();

  const { width } = useWindowDimensions();
  const { setPageTitle } = usePageTitle();
  const navigate = useNavigate();

  useEffect(() => setPageTitle('Profile'), [setPageTitle]);

  useEffect(() => {
    if (width >= 1800) setItemPerPage(8);
    else if (width >= 1500) setItemPerPage(7);
    else if (width >= 1200) setItemPerPage(6);
    else if (width >= 1000) setItemPerPage(5);
    else if (width >= 800) setItemPerPage(4);
    else if (width >= 500) setItemPerPage(3);
    else if (width >= 360) setItemPerPage(2);
  }, [width]);

  const setItemsPerPage = useCallback(
    (ref: React.MutableRefObject<HTMLDivElement | null>) => {
      if (!ref || !ref.current) {
        setTimeout(() => setItemsPerPage(ref), 150);
        return;
      }
      const value = Number(ref.current.style.getPropertyValue('--item-per-page'));
      if (value === itemPerPage) return;
      ref.current.style.setProperty('--item-per-page', String(itemPerPage));
    },
    [itemPerPage]
  );

  useEffect(() => {
    if (rowVideoContainerRef1) setItemsPerPage(rowVideoContainerRef1);
  }, [itemPerPage, rowVideoContainerRef1, setItemsPerPage]);

  useEffect(() => {
    (async () => {
      try {
        const { data: FranchiseData } = await getAllFranchise();
        const { data: avatarData } = await getAllAvatars();

        setAvatarsFormFranchise(
          FranchiseData.map((category) => ({
            ...category,
            activePage: 0,
            avatars: avatarData.filter((avatar) => avatar.franchise.includes(category.name)),
          }))
        );
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    if (currentUser) setProfiles(currentUser.profiles);
  }, [currentUser]);

  const handleAddProfile = useCallback(
    async (avatarURL: string) => {
      try {
        await addProfile({ profileName: newProfileName, avatarURL });

        const { data: userData } = await getCurrentUser();
        setUserContext({ currentUser: userData.currentUser });
        setIsChoosingAvatar(false);
        setNewProfileName('');
      } catch (error) {
        console.log(error);
      }
    },
    [newProfileName, setUserContext]
  );

  const renderDefault = useCallback(
    () => (
      <div className="all-profile-div">
        {profiles &&
          [...profiles].map((profile) => (
            <div key={profile._id} className="profile-div">
              <button
                type="button"
                className="profile-card-button"
                onClick={() => {
                  setActiveProfile(profile);
                  navigate('/');
                }}
              >
                <img src={profile.avatarURL} alt="profile.profileName" />
              </button>
              {profile.profileName}
            </div>
          ))}
        <div className="add-profile-div">
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <button
            type="button"
            className="add-profile-button"
            onClick={() => setIsAddingProfile(!isAddingProfile)}
          >
            <div>
              <Plus />
            </div>
          </button>
          <p>Add Profile</p>
        </div>
      </div>
    ),
    [isAddingProfile, navigate, profiles, setActiveProfile]
  );

  const renderAddingProfile = useCallback(
    () => (
      <div className="adding-profile-container">
        <form className="adding-profile-div">
          <input
            type="text"
            placeholder="Profile Name"
            className="adding-profile-input"
            ref={addingProfileRef}
          />
          <button
            type="submit"
            className="adding-profile-button"
            onClick={(e) => {
              e.preventDefault();
              if (
                !addingProfileRef.current?.value ||
                !currentUser?.profiles ||
                currentUser?.profiles
                  .map((profile) => {
                    if (profile.profileName === addingProfileRef.current?.value) return true;
                    return false;
                  })
                  .includes(true)
              )
                return;
              setNewProfileName(addingProfileRef.current?.value);
              setIsAddingProfile(false);
              setIsChoosingAvatar(!isChoosingAvatar);
            }}
          >
            next
          </button>
        </form>
      </div>
    ),
    [currentUser?.profiles, isChoosingAvatar]
  );

  const skipBack = useCallback(
    (
      state: {
        _id: string;
        name: string;
        activePage: number;
        avatars: ReturnAvatarType[];
      } | null
    ) => {
      if (!state || !avatarsFormFranchise) return;
      const newAvatarsFormFranchise = [...avatarsFormFranchise];
      const nrOfPages = String(state.avatars.length / itemPerPage).split('.');

      if (state.activePage)
        newAvatarsFormFranchise[avatarsFormFranchise.indexOf(state)].activePage =
          state.activePage - 1;
      else if (!Number(nrOfPages[1]))
        newAvatarsFormFranchise[avatarsFormFranchise.indexOf(state)].activePage =
          Number(nrOfPages[0]) - 1;
      else
        newAvatarsFormFranchise[avatarsFormFranchise.indexOf(state)].activePage = Number(
          nrOfPages[0]
        );

      setAvatarsFormFranchise(newAvatarsFormFranchise);
    },
    [avatarsFormFranchise, itemPerPage]
  );

  const skipForward = useCallback(
    (
      state: {
        _id: string;
        name: string;
        activePage: number;
        avatars: ReturnAvatarType[];
      } | null
    ) => {
      if (!state || !avatarsFormFranchise) return;
      const newAvatarsFormFranchise = [...avatarsFormFranchise];

      const nrOfPages = String(state.avatars.length / itemPerPage).split('.');
      const number = Number(nrOfPages[1]) ? 0 : 1;
      if (state.activePage === Number(nrOfPages[0]) - number)
        newAvatarsFormFranchise[avatarsFormFranchise.indexOf(state)].activePage = 0;
      else
        newAvatarsFormFranchise[avatarsFormFranchise.indexOf(state)].activePage =
          state.activePage + 1;
    },
    [avatarsFormFranchise, itemPerPage]
  );

  const renderVideoContainer = useCallback(
    (
      state: {
        _id: string;
        name: string;
        activePage: number;
        avatars: ReturnAvatarType[];
      } | null,
      videoRef: React.MutableRefObject<HTMLDivElement | null>
    ) =>
      state?.avatars && (
        <div
          key={state._id}
          ref={videoRef}
          onChange={() => console.log('change')}
          className="row-video-container"
        >
          <div className="row-header">
            <h2 className="row-header-text">{state.name}</h2>
          </div>
          <div className="row-content">
            <button
              style={{ visibility: state.avatars.length < itemPerPage ? 'hidden' : 'visible' }}
              className="handle left-handle"
              type="button"
              onClick={() => skipBack(state)}
            >
              <p />
            </button>
            <div
              className="slider"
              style={{ transform: `translateX(-${state.activePage * 100}%)` }}
            >
              {state.avatars.map((avatar) => (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                <div
                  tabIndex={0}
                  role="button"
                  key={avatar._id}
                  className="single-video"
                  onClick={() => newProfileName && handleAddProfile(avatar.url)}
                  // onClick={() => {
                  //   document.documentElement.style.setProperty('--scroll-bar-visibility', 'hidden');
                  // }}
                >
                  <img src={avatar.url} alt={avatar.name} />
                </div>
              ))}
            </div>
            <button
              style={{ visibility: state.avatars.length < itemPerPage ? 'hidden' : 'visible' }}
              className="handle right-handle"
              type="button"
              onClick={() => skipForward(state)}
            >
              <p />
            </button>
          </div>
        </div>
      ),
    [itemPerPage, skipBack, newProfileName, handleAddProfile, skipForward]
  );

  const renderChoosingAvatar = useCallback(
    () => (
      <div className="choose-avatar-container">
        {avatarsFormFranchise &&
          avatarsFormFranchise.map((franchise) => {
            if (!franchise.avatars.length) return null;
            return renderVideoContainer(franchise, rowVideoContainerRef1);
          })}
      </div>
    ),
    [avatarsFormFranchise, renderVideoContainer]
  );

  const renderEditing = useCallback(
    () => (
      <div className="all-profile-div">
        {profiles &&
          [...profiles].map((profile) => (
            <button
              type="button"
              className="profile-card-button"
              key={profile._id}
              // onClick={() => setActiveProfile({ activeProfile: profile })}
            >
              {profile.profileName}
            </button>
          ))}
        <div className="add-profile-div">
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <button type="button" className="add-profile-button" />
        </div>
      </div>
    ),
    [profiles]
  );

  const componentToRender = useCallback(() => {
    if (isAddingProfile) return renderAddingProfile();
    if (isEnditingProfiles) return renderEditing();
    if (isChoosingAvatar) return renderChoosingAvatar();
    return renderDefault();
  }, [
    isAddingProfile,
    isChoosingAvatar,
    isEnditingProfiles,
    renderAddingProfile,
    renderChoosingAvatar,
    renderDefault,
    renderEditing,
  ]);

  return (
    <div className="profile-container">
      {/*
      <div className="profile-header">
        <Link className="navigate-home-button" to="/" state={{ isMovie: true }}>
          <Home />
        </Link>
         <button
          type="button"
          className="navigate-home-button"
          onClick={() => navigate('/')}
        ></button> 
      </div>
        */}
      <Header />
      {componentToRender()}
    </div>
  );
}
