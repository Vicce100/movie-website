import React, { useState, useCallback, useEffect } from 'react';
import { v4 as uuidV4 } from 'uuid';
import { getAllCategory } from '../services/index';
import '../styles/AdminStyle.scss';
import { CategorySchemaType } from '../utils/types';

export default function AddAvatar() {
  const [multipleUpload, setMultipleUpload] = useState<boolean>(false);
  const [allCategories, setAllCategories] = useState<CategorySchemaType[] | null>(null);

  const [singleAvatarFile, setSingleAvatarFile] = useState<string | Blob | null>(null);
  const [singleAvatarName, setSingleAvatarName] = useState<string>('');
  const [singleAvatarCategories, setSingleAvatarCategories] = useState<string[]>([]);

  const [multipleAvatar, setMultipleAvatar] = useState<
    { id: string; file: string | Blob | null; name: string }[]
  >([{ id: uuidV4(), file: null, name: '' }]);
  const [multipleAvatarCategories, setMultipleAvatarCategories] = useState<string[]>([]);

  useEffect(() => {
    getAllCategory()
      .then((res) => (res.status === 200 ? setAllCategories(res.data) : null))
      .catch((e) => console.log(e));
  }, []);

  const checkSelectedCategories = useCallback((arrayToCheck: string[], name: string) => {
    if (!arrayToCheck.includes(name)) return '#4c525e';
    return '#fc7ae2';
  }, []);

  const uploadSingleAvatar = useCallback(
    async (
      e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      e.preventDefault();
      if (!singleAvatarFile || !singleAvatarName || !singleAvatarCategories?.length) return;
      const formData = new FormData();
      formData.append('avatarImage', singleAvatarFile);
      formData.append('name', singleAvatarName);
      singleAvatarCategories.forEach((category) => {
        formData.append('category', category);
      });
      const options: RequestInit = { method: 'POST', body: formData, credentials: 'include' };

      try {
        const res = await fetch('http://localhost:5050/avatar/upload/single', options);
        if (res.status === 201) {
          setSingleAvatarFile(null);
          setSingleAvatarName('');
          setSingleAvatarCategories([]);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [singleAvatarCategories, singleAvatarFile, singleAvatarName]
  );

  const uploadMultipleAvatars = useCallback(
    async (
      e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      e.preventDefault();
      if (!multipleAvatar[0].file || !multipleAvatar[0].name || !multipleAvatarCategories?.length)
        return;
      const formData = new FormData();
      multipleAvatar.forEach((avatar) => {
        if (avatar.file) formData.append('avatarImage', avatar.file);
        formData.append('name', avatar.name);
      });
      multipleAvatarCategories.forEach((category) => formData.append('categories', category));

      const options: RequestInit = { method: 'POST', body: formData, credentials: 'include' };
      try {
        const res = await fetch('http://localhost:5050/avatar/upload/multiple', options);
        if (res.status === 201) {
          setMultipleAvatar([{ id: uuidV4(), file: null, name: '' }]);
          setMultipleAvatarCategories([]);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [multipleAvatar, multipleAvatarCategories]
  );

  const renderSingleUpload = useCallback(
    () => (
      <div className="single-form-upload-div">
        <form onSubmit={uploadSingleAvatar} className="single-form-upload-form">
          <div className="single-form-upload-sub-div">
            <label htmlFor="name" className="single-form-upload-label">
              Name
            </label>
            <input
              className="single-form-upload-input"
              type="text"
              name="name"
              placeholder="Name"
              id="name"
              value={singleAvatarName}
              onChange={(e) => setSingleAvatarName(e.target.value)}
            />
            <label htmlFor="singleAvatarImage" className="single-form-upload-label">
              Upload Image
            </label>
            <input
              id="singleAvatarImage"
              className="single-form-upload-file"
              type="file"
              accept="image/*"
              name="avatarImage"
              onChange={(e) => setSingleAvatarFile(e.target.files && e.target.files[0])}
            />
          </div>
          <div className="single-form-upload-category-parent">
            {allCategories &&
              allCategories.map((category) => (
                <div
                  key={category._id}
                  className="single-form-upload-category-div"
                  style={{
                    backgroundColor: checkSelectedCategories(singleAvatarCategories, category.name),
                  }}
                >
                  <input
                    className="single-form-upload-category-checkbox"
                    type="checkbox"
                    name="category"
                    value={category.name}
                    id={category._id}
                    onChange={() => {
                      if (!singleAvatarCategories.includes(category.name))
                        setSingleAvatarCategories([...singleAvatarCategories, category.name]);
                      else
                        setSingleAvatarCategories(
                          singleAvatarCategories.filter((c) => c !== category.name)
                        );
                    }}
                  />
                  <label htmlFor={category._id}>{category.name}</label>
                </div>
              ))}
          </div>
        </form>
      </div>
    ),
    [
      allCategories,
      checkSelectedCategories,
      singleAvatarCategories,
      singleAvatarName,
      uploadSingleAvatar,
    ]
  );

  const renderMultipleUpload = useCallback(
    () => (
      <div className="multiple-form-upload-div">
        <form onSubmit={uploadSingleAvatar} className="multiple-form-upload-form">
          {multipleAvatar.map((avatar, index) => (
            <div key={avatar.id} className="multiple-form-key-div">
              <p>#{index + 1}</p>
              <br />
              <div className="multiple-form-upload-sub-div">
                <label htmlFor="name" className="multiple-form-upload-label">
                  Name
                </label>
                <input
                  className="multiple-form-upload-input"
                  type="text"
                  name="name"
                  placeholder="Name"
                  id="name"
                  value={avatar.name}
                  onChange={(e) => {
                    const newAvatar = [...multipleAvatar];
                    newAvatar[multipleAvatar.indexOf(avatar)].name = e.target.value;
                    setMultipleAvatar(newAvatar);
                  }}
                />
                <label htmlFor="multipleAvatarImage" className="multiple-form-upload-label">
                  Upload Image
                </label>
                <input
                  id="multipleAvatarImage"
                  className="multiple-form-upload-file"
                  type="file"
                  name="avatarImage"
                  onChange={(e) => {
                    const newAvatar = [...multipleAvatar];
                    newAvatar[multipleAvatar.indexOf(avatar)].file =
                      e.target.files && e.target.files[0];
                    setMultipleAvatar(newAvatar);
                  }}
                />
              </div>
              <div className="multiple-form-upload-category-parent">
                {allCategories &&
                  allCategories.map((category) => (
                    <div
                      key={category._id}
                      className="multiple-form-upload-category-div"
                      style={{
                        backgroundColor: checkSelectedCategories(
                          multipleAvatarCategories,
                          `${index}/${category.name}`
                        ),
                      }}
                    >
                      <input
                        className="multiple-form-upload-category-checkbox"
                        type="checkbox"
                        name="category"
                        value={`${index}/${category.name}`}
                        id={index + category._id}
                        onChange={() => {
                          if (!multipleAvatarCategories.includes(`${index}/${category.name}`))
                            setMultipleAvatarCategories([
                              ...multipleAvatarCategories,
                              `${index}/${category.name}`,
                            ]);
                          else
                            setMultipleAvatarCategories(
                              multipleAvatarCategories.filter(
                                (c) => c !== `${index}/${category.name}`
                              )
                            );
                        }}
                      />
                      <label htmlFor={index + category._id}>{category.name}</label>
                    </div>
                  ))}
              </div>
              <div className="remove-upload-form-div">
                <button
                  type="button"
                  className="remove-upload-form-button"
                  onClick={() => {
                    // remove avatar from array
                    const newAvatar = [...multipleAvatar];
                    newAvatar.splice(multipleAvatar.indexOf(avatar), 1);
                    setMultipleAvatar(newAvatar);
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </form>
      </div>
    ),
    [
      allCategories,
      checkSelectedCategories,
      multipleAvatar,
      multipleAvatarCategories,
      uploadSingleAvatar,
    ]
  );

  return (
    <div className="add-avatar-container">
      <div className="switch-div-section">
        <div className="switch-div-box">
          <h1 className="add-avatar-header-text">Add single</h1>
          <input
            className="switch-input"
            type="checkbox"
            name="switch-input"
            id="switch-input"
            onChange={(e) => setMultipleUpload(e.target.checked)}
            // disabled
          />
          <label htmlFor="switch-input" />
          <h1 className="add-avatar-header-text">Add multiple</h1>
        </div>
      </div>
      <div className="main-content">
        <div className="form-parent-div">
          {!multipleUpload ? renderSingleUpload() : renderMultipleUpload()}
          <div className="submit-filed-div">
            <button
              type="button"
              className="submit-avatar-upload-button"
              onClick={(e) => (!multipleUpload ? uploadSingleAvatar(e) : uploadMultipleAvatars(e))}
            >
              Submit
            </button>
            {multipleUpload && (
              <button
                type="button"
                className="submit-avatar-upload-button"
                onClick={() =>
                  setMultipleAvatar([...multipleAvatar, { id: uuidV4(), name: '', file: null }])
                }
              >
                Add Field
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
