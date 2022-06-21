/* eslint-disable import/no-unresolved */
/* eslint-disable arrow-body-style */
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper';

import {
  useCurrentUserContext,
  useSetActiveProfile,
  useSetCurrentUser,
} from '../contexts/UserAuth';
import { addProfile, getCurrentUser } from '../services/userService';
import { getAllAvatars, getAllCategory } from '../services';
import { useWindowDimensions } from '../hooks/index';
import { ReturnAvatarType, ProfileType } from '../utils/types';

import { ReactComponent as Plus } from '../svg/plus.svg';
import { ReactComponent as Home } from '../svg/home_white_36dp.svg';
import '../styles/ProfileStyle.scss';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/bundle';

type AvatarType = {
  _id: string;
  name: string;
  avatars: ReturnAvatarType[];
}[];

export default function ProfileScene() {
  const [profiles, setProfiles] = useState<ProfileType | null>(null);
  const [avatarsFormCategories, setAvatarsFormCategories] = useState<AvatarType | null>(null);
  const [newProfileName, setNewProfileName] = useState<string>('');
  const [profileToEdit, setProfileToEdit] = useState<ProfileType | null>(null);

  const [isAddingProfile, setIsAddingProfile] = useState<boolean>(false);
  const [isEnditingProfiles, setIsEditingProfiles] = useState<boolean>(false);
  const [isChoosingAvatar, setIsChoosingAvatar] = useState<boolean>(false);

  const addingProfileRef = useRef<HTMLInputElement | null>(null);

  const { currentUser } = useCurrentUserContext();
  const [setActiveProfile] = useSetActiveProfile();

  const { width } = useWindowDimensions();
  const navigate = useNavigate();
  const [setUserContext] = useSetCurrentUser();

  const swiperSlidesPerView = useMemo(() => Number(String(width / 250).split('.')[0]), [width]);

  useEffect(() => {
    async function getAvatarsForCategories() {
      try {
        const { data: categoryData } = await getAllCategory();
        const { data: avatarData } = await getAllAvatars();

        setAvatarsFormCategories(
          categoryData.map((category) => ({
            ...category,
            avatars: avatarData.filter((avatar) => avatar.category.includes(category.name)),
          }))
        );
      } catch (error) {
        console.log(error);
      }
    }
    getAvatarsForCategories();
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
                onClick={() => setActiveProfile(profile)}
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
    [isAddingProfile, profiles, setActiveProfile]
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
              if (!addingProfileRef.current?.value) return;
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
    [isChoosingAvatar]
  );

  const renderChoosingAvatar = useCallback(
    () => (
      <div className="choose-avatar-container">
        {avatarsFormCategories &&
          avatarsFormCategories.map((category) => {
            if (!category.avatars.length) return null;
            return (
              <div className="avatar-category-div" key={category._id}>
                <h3 className="avatar-category-title">{category.name}</h3>
                <div className="swiper-container">
                  <Swiper
                    slidesPerView={swiperSlidesPerView || 1}
                    slidesPerGroup={swiperSlidesPerView || 1}
                    spaceBetween={20}
                    pagination={{ clickable: true }}
                    navigation
                    modules={[Pagination, Navigation]}
                    className="swiper-wrapper"
                  >
                    {category.avatars.map((avatar) => {
                      if (!avatar || avatar === undefined) return null;
                      return (
                        <SwiperSlide
                          key={String(avatar.id + category._id)}
                          className="swiper-slide"
                        >
                          <button
                            type="button"
                            className="swiper-button"
                            onClick={() => {
                              if (newProfileName) handleAddProfile(avatar.urlPath);
                            }}
                          >
                            <img className="avatar-img" src={avatar.url} alt={avatar.name} />
                          </button>
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                </div>
              </div>
            );
          })}
      </div>
    ),
    [avatarsFormCategories, handleAddProfile, newProfileName, swiperSlidesPerView]
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
      <div className="profile-header">
        <button type="button" className="navigate-home-button" onClick={() => navigate('/')}>
          <Home />
        </button>
      </div>
      {componentToRender()}
    </div>
  );
}
