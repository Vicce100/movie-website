import React, { useState, useCallback, FormEvent } from 'react';
import { v4 as uuidV4 } from 'uuid';
import { uploadMultipleFranchise } from '../../../services/index';

import '../styles/AddCategories.scss';

export default function AddFranchise() {
  const [franchise, setFranchise] = useState<{ id: string; value: string; isRemoving: boolean }[]>([
    { id: uuidV4(), value: '', isRemoving: false },
  ]);

  const submitCategories = useCallback(
    (event: FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault();
      const data = franchise.map((category) => category.value);
      if (!data.length) return;
      uploadMultipleFranchise({ franchises: data })
        .then(() => setFranchise([{ id: String(uuidV4()), value: '', isRemoving: false }]))
        .catch((e) => console.log(e));
    },
    [franchise]
  );

  const checkRemovingStatus = useCallback(
    (boolean: boolean) => (boolean ? '#3d424e' : '#373c46'),
    []
  );

  const renderMultipleUpload = useCallback(
    () => (
      <form className="category-form" onSubmit={submitCategories}>
        {franchise.map((category) => (
          <div
            key={category.id}
            className="category-input-div"
            style={{ backgroundColor: checkRemovingStatus(category.isRemoving) }}
          >
            <label htmlFor={category.id}>Franchise Name</label>
            <div className="category-input-sub-div">
              <input
                className="single-category-form-input"
                type="text"
                name="Franchise"
                placeholder="Franchise"
                id={category.id}
                value={category.value}
                onChange={(e) => {
                  const newFranchise = [...franchise];
                  newFranchise[newFranchise.indexOf(category)].value = e.target.value;
                  setFranchise(newFranchise);
                }}
              />
              <button
                className="remove-category-button"
                type="button"
                onClick={() => {
                  const newFranchise1 = [...franchise];
                  newFranchise1[newFranchise1.indexOf(category)].isRemoving = true;
                  setFranchise(newFranchise1);
                  setTimeout(() => {
                    const newFranchise = [...franchise];
                    newFranchise.splice(newFranchise.indexOf(category), 1);
                    setFranchise(newFranchise);
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
    [franchise, checkRemovingStatus, submitCategories]
  );

  return (
    <div className="add-category-container">
      <div className="add-filed-section">
        <div className="add-filed-div">
          <button
            className="add-filed-button"
            type="button"
            onClick={() => {
              setFranchise([...franchise, { id: uuidV4(), value: '', isRemoving: false }]);
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
