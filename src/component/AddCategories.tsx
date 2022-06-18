import React, { useState, useCallback, FormEvent } from 'react';
import { v4 as uuidV4 } from 'uuid';
import { uploadMultipleCategory } from '../services/index';
import '../styles/AdminStyle.scss';

export default function AddCategories() {
  const [categories, setCategories] = useState<
    { id: string; value: string; isRemoving: boolean }[]
  >([{ id: uuidV4(), value: '', isRemoving: false }]);

  const submitCategories = useCallback(
    (event: FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault();
      const data = categories.map((category) => category.value);
      if (!data[0]) return;
      uploadMultipleCategory({ categories: data })
        .then(() => setCategories([{ id: String(uuidV4()), value: '', isRemoving: false }]))
        .catch((e) => console.log(e));
    },
    [categories]
  );

  const checkRemovingStatus = useCallback(
    (boolean: boolean) => (boolean ? '#3d424e' : '#373c46'),
    []
  );

  const renderMultipleUpload = useCallback(
    () => (
      <form className="category-form" onSubmit={submitCategories}>
        {categories.map((category) => (
          <div
            key={category.id}
            className="category-input-div"
            style={{ backgroundColor: checkRemovingStatus(category.isRemoving) }}
          >
            <label htmlFor={category.id}>Category ID</label>
            <div className="category-input-sub-div">
              <input
                className="single-category-form-input"
                type="text"
                name="category"
                placeholder="category"
                id={category.id}
                value={category.value}
                onChange={(e) => {
                  const newCategories = [...categories];
                  newCategories[newCategories.indexOf(category)].value = e.target.value;
                  setCategories(newCategories);
                }}
              />
              <button
                className="remove-category-button"
                type="button"
                onClick={() => {
                  const newCategories1 = [...categories];
                  newCategories1[newCategories1.indexOf(category)].isRemoving = true;
                  setCategories(newCategories1);
                  setTimeout(() => {
                    const newCategories = [...categories];
                    newCategories.splice(newCategories.indexOf(category), 1);
                    setCategories(newCategories);
                  }, 40);
                }}
              >
                remove
              </button>
            </div>
          </div>
        ))}
      </form>
    ),
    [categories, checkRemovingStatus, submitCategories]
  );

  return (
    <div className="add-category-container">
      <div className="add-filed-section">
        <div className="add-filed-div">
          <button
            className="add-filed-button"
            type="button"
            onClick={() => {
              setCategories([...categories, { id: uuidV4(), value: '', isRemoving: false }]);
            }}
          >
            Add Field
          </button>
          <button className="add-filed-button" type="button" onClick={submitCategories}>
            Submit
          </button>
        </div>
      </div>

      <div className="main-content">
        <div className="form-parent-div">{renderMultipleUpload()}</div>
      </div>
    </div>
  );
}
