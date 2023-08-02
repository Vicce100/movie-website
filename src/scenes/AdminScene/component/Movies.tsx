import React, { useCallback, useEffect, useState } from 'react';
import { ReactComponent as Checkbox } from '../../../asset/svg/check.svg';

import { usePageTitle } from '../../../hooks';

import '../styles/Movies.scss';

export default function Movies() {
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const { setPageTitle } = usePageTitle();

  useEffect(() => setPageTitle('Upload Video'), [setPageTitle]);

  return (
    <section className="movies-base-section">
      <div className="movie-base-child">
        <div className="movies-tools-parent">
          <div className="movies-tools">movie</div>
        </div>
        <div className="movies-list">
          <div className="movie-list-instructions">
            <div className="first-two">
              <label htmlFor="myCheckbox01" className="checkbox">
                <input className="checkbox__input" type="checkbox" id="myCheckbox01" />
                <Checkbox />
              </label>
              <div className="movie-list-instructions-values-text">
                <p>|Display Picture|</p>
              </div>
            </div>

            <div className="movie-list-instructions-values">a</div>
          </div>

          <div className="single-movie">
            <div className="first-two">
              <label htmlFor="myCheckbox01" className="checkbox">
                <input className="checkbox__input" type="checkbox" id="myCheckbox01" />
                <Checkbox />
              </label>
              <img
                src="http://localhost:17053/uploads/images/public/1688298792624-qSAlb4C7UKeMSES18rCCCgSUc2Z.jpg"
                alt="1"
                className="single-movie-img"
              />
            </div>
          </div>

          <div className="single-movie">
            <div className="first-two">
              <label htmlFor="myCheckbox01" className="checkbox">
                <input className="checkbox__input" type="checkbox" id="myCheckbox01" />
                <Checkbox />
              </label>
              <img
                src="http://localhost:17053/uploads/images/public/1688298792624-qSAlb4C7UKeMSES18rCCCgSUc2Z.jpg"
                alt="2"
                className="single-movie-img"
              />
            </div>
          </div>
          <div className="single-movie">
            <div className="first-two">
              <label htmlFor="myCheckbox01" className="checkbox">
                <input className="checkbox__input" type="checkbox" id="myCheckbox01" />
                <Checkbox />
              </label>
              <img
                src="http://localhost:17053/uploads/images/public/1688298792624-qSAlb4C7UKeMSES18rCCCgSUc2Z.jpg"
                alt="3"
                className="single-movie-img"
              />
            </div>
          </div>
          <div className="single-movie">
            <div className="first-two">
              <label htmlFor="myCheckbox01" className="checkbox">
                <input className="checkbox__input" type="checkbox" id="myCheckbox01" />
                <Checkbox />
              </label>
              <img
                src="http://localhost:17053/uploads/images/public/1688298792624-qSAlb4C7UKeMSES18rCCCgSUc2Z.jpg"
                alt="4"
                className="single-movie-img"
              />
            </div>
          </div>
          <div className="single-movie">
            <div className="first-two">
              <label htmlFor="myCheckbox01" className="checkbox">
                <input className="checkbox__input" type="checkbox" id="myCheckbox01" />
                <Checkbox />
              </label>
              <img
                src="http://localhost:17053/uploads/images/public/1688298792624-qSAlb4C7UKeMSES18rCCCgSUc2Z.jpg"
                alt="5"
                className="single-movie-img"
              />
            </div>
          </div>
          <div className="single-movie">
            <div className="first-two">
              <label htmlFor="myCheckbox01" className="checkbox">
                <input className="checkbox__input" type="checkbox" id="myCheckbox01" />
                <Checkbox />
              </label>
              <img
                src="http://localhost:17053/uploads/images/public/1688298792624-qSAlb4C7UKeMSES18rCCCgSUc2Z.jpg"
                alt="6"
                className="single-movie-img"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
