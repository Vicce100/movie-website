import React, { useState, useCallback, FormEvent } from 'react';
import { v4 as uuidV4 } from 'uuid';
import { uploadMultipleCategory } from '../services/index';
import '../styles/AdminStyle.scss';

export default function AddCategories() {
  const [categories, setCategories] = useState<{ id: string; value: string }[]>([
    { id: uuidV4(), value: '' },
  ]);

  const submitCategories = useCallback(
    (event: FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault();
      const data = categories.map((category) => category.value);
      if (!data[0]) return;
      uploadMultipleCategory({ categories: data })
        .then((res) => {
          // if (res.status === 200)'
          console.log(res);
          setCategories([{ id: String(uuidV4()), value: '' }]);
          // return navigate(`/`);
        })
        .catch((e) => console.log(e));
    },
    [categories]
  );

  const renderMultipleUpload = useCallback(
    () => (
      <form className="single-category-form" onSubmit={submitCategories}>
        {categories.map((category) => (
          <div key={category.id} className="category-input-div">
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
                  const newCategories = [...categories];
                  newCategories.splice(newCategories.indexOf(category), 1);
                  setCategories(newCategories);
                }}
              >
                remove
              </button>
            </div>
          </div>
        ))}
      </form>
    ),
    [categories, submitCategories]
  );

  return (
    <div className="add-category-container">
      <div className="add-filed-section">
        <div className="add-filed-div">
          <button
            className="add-filed-button"
            type="button"
            onClick={() => {
              setCategories([...categories, { id: uuidV4(), value: '' }]);
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
