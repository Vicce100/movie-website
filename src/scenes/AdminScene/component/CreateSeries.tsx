import React, { useEffect, useState, useCallback } from 'react';
import dayjs from 'dayjs';

import { getAllCategory, getAllFranchise } from '../../../services/index';
import { url } from '../../../services/apiService';
import { CategorySchemaType, FranchiseSchemaType, routesString as rs } from '../../../utils/types';
import { usePageTitle } from '../../../hooks';

import '../styles/CreateSeries.scss';

type CreateSeriesType = {
  title: string;
  description: string;
  displayPicture: File | null;
  isPublic: boolean;
  creationDate: string;
  latestDate: string;
  category: string[];
  franchise: string[];
};

export default function CreateSeries() {
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const [seriesPicturePreview, setSeriesPicturePreview] = useState<string | undefined>(undefined);
  const [createSeries, setCreateSeries] = useState<CreateSeriesType>({
    title: '',
    description: '',
    displayPicture: null,
    isPublic: true,
    creationDate: dayjs().format().split('T')[0],
    latestDate: dayjs().format().split('T')[0],
    category: [],
    franchise: [],
  });

  const [allCategories, setAllCategories] = useState<CategorySchemaType[] | null>(null);
  const [allFranchise, setAllFranchise] = useState<FranchiseSchemaType[] | null>(null);

  const { setPageTitle } = usePageTitle();

  useEffect(() => setPageTitle('Create Series'), [setPageTitle]);

  useEffect(() => {
    // setUploadReleaseDate(dayjs().format().split('T')[0]);

    getAllCategory()
      .then((res) => (res.status === 200 ? setAllCategories(res.data) : null))
      .catch((e) => console.log(e));

    getAllFranchise()
      .then((res) => (res.status === 200 ? setAllFranchise(res.data) : null))
      .catch((e) => console.log(e));
  }, []);

  const createSeriesCall = useCallback(
    async (
      e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      e.preventDefault();
      const {
        title: seriesTitle,
        description: seriesDescription,
        displayPicture: seriesDisplayPicture,
        isPublic: seriesIsPublic,
        creationDate: SeriesCreationDate,
        latestDate: seriesLatestDate,
        category: seriesCategory,
        franchise: seriesFranchise,
      } = createSeries;
      if (
        !seriesTitle ||
        !seriesDescription ||
        !seriesDisplayPicture ||
        !SeriesCreationDate ||
        !seriesLatestDate ||
        !seriesCategory ||
        !seriesFranchise ||
        isUploading
      )
        return;

      const formData = new FormData();

      formData.append('title', seriesTitle);
      formData.append('displayPicture', seriesDisplayPicture);
      formData.append('description', seriesDescription);
      formData.append('isPublic', String(seriesIsPublic));

      formData.append('creationDate', dayjs(SeriesCreationDate).format());
      formData.append('latestDate', dayjs(seriesLatestDate).format());

      seriesCategory.forEach((category) => formData.append('categories', category));
      seriesFranchise.forEach((franchise) => formData.append('franchise', franchise));

      const options: RequestInit = { method: 'POST', credentials: 'include', body: formData };
      try {
        setIsUploading(true);
        const res: { success: boolean } = await (
          await fetch(`${url}/${rs.video}/${rs.series}/${rs.create}`, options)
        ).json();
        console.log(res);
        setCreateSeries({
          ...createSeries,
          title: '',
          description: '',
          displayPicture: null,
          isPublic: true,
          creationDate: dayjs().format().split('T')[0],
          latestDate: dayjs().format().split('T')[0],
        });
        setSeriesPicturePreview(undefined);
      } catch (error) {
        console.log(error);
      }
      setIsUploading(false);
    },
    [createSeries, isUploading]
  );

  useEffect(() => {
    if (!createSeries.displayPicture) return;
    const reader = new FileReader();
    reader.onloadend = () => setSeriesPicturePreview(reader.result as string);
    reader.readAsDataURL(createSeries.displayPicture);
  }, [createSeries.displayPicture]);

  return (
    <div className="create-series-container">
      <form onSubmit={createSeriesCall}>
        <div className="preview-image">
          <input
            className="display-picture-input"
            style={{ display: 'none' }}
            type="file"
            name="displayPicture"
            id="displayPicture"
            accept="image/*"
            onChange={(e) =>
              setCreateSeries({
                ...createSeries,
                displayPicture: e.target.files && e.target.files[0],
              })
            }
          />
          <label htmlFor="displayPicture">
            {seriesPicturePreview && <img src={seriesPicturePreview || undefined} alt="preview" />}
          </label>
          <div className="fields">
            <div>
              <label htmlFor="title">Series Title</label>
              <input
                type="text"
                name="title"
                id="title"
                value={createSeries.title}
                placeholder="Title"
                className="title-input"
                onChange={(e) => setCreateSeries({ ...createSeries, title: e.target.value })}
              />
            </div>

            <div className="date-div">
              <label htmlFor="creationDate">Creation Date</label>
              <input
                type="date"
                name="creationDate"
                id="creationDate"
                accept="video/*"
                value={createSeries.creationDate}
                className="title-input"
                onChange={(e) => setCreateSeries({ ...createSeries, creationDate: e.target.value })}
              />
            </div>

            <div className="date-div">
              <label htmlFor="latestDate">Latest Date</label>
              <input
                type="date"
                name="latestDate"
                id="latestDate"
                accept="video/*"
                value={createSeries.latestDate}
                className="title-input"
                onChange={(e) => setCreateSeries({ ...createSeries, latestDate: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="switch-div-box">
          <h1 className="switch-header-text">Private</h1>
          <input
            className="switch-input"
            type="checkbox"
            name="switch-input"
            id="switch-input"
            onChange={(e) => setCreateSeries({ ...createSeries, isPublic: e.target.checked })}
            // disabled
          />
          <label htmlFor="switch-input" />
          <h1 className="switch-header-text">Public</h1>
        </div>

        <div className="description">
          <label htmlFor="description-input">Description</label>
          <textarea
            className="description-input"
            id="description-input"
            value={createSeries.description}
            onChange={(e) => setCreateSeries({ ...createSeries, description: e.target.value })}
            maxLength={400}
          />
        </div>

        <div className="categories-and-franchise-container">
          <div className="parent">
            <h4>Categories</h4>
            <div className="categories-and-franchise">
              {allCategories &&
                allCategories.map((category) => (
                  <div
                    key={category._id}
                    className="single-categories-and-franchise"
                    // style={{
                    //   backgroundColor: checkSelectedCategories(categories, category.name),
                    // }}
                  >
                    <input
                      className="checkbox"
                      type="checkbox"
                      name="category"
                      value={category.name}
                      id={category._id}
                      onChange={() => {
                        if (!createSeries.category.includes(category.name))
                          setCreateSeries({
                            ...createSeries,
                            category: [...createSeries.category, category.name],
                          });
                        else
                          setCreateSeries({
                            ...createSeries,
                            category: createSeries.category.filter((c) => c !== category.name),
                          });
                      }}
                    />
                    <label htmlFor={category._id}>{category.name}</label>
                  </div>
                ))}
            </div>
          </div>
          <div className="parent">
            <h4>Franchises</h4>
            <div className="categories-and-franchise">
              {allFranchise &&
                allFranchise.map((franchise) => (
                  <div
                    key={franchise._id}
                    className="single-categories-and-franchise"
                    // style={{
                    //   backgroundColor: checkSelectedCategories(categories, franchise.name),
                    // }}
                  >
                    <input
                      className="checkbox"
                      type="checkbox"
                      name="franchise"
                      value={franchise.name}
                      id={franchise._id}
                      onChange={() => {
                        if (!createSeries.franchise.includes(franchise.name))
                          setCreateSeries({
                            ...createSeries,
                            franchise: [...createSeries.franchise, franchise.name],
                          });
                        else
                          setCreateSeries({
                            ...createSeries,
                            franchise: createSeries.franchise.filter((f) => f !== franchise.name),
                          });
                      }}
                    />
                    <label htmlFor={franchise._id}>{franchise.name}</label>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* submit button */}
        <div className="submit-button-div">
          <button
            type="submit"
            className="submit-button"
            disabled={!!isUploading}
            onClick={createSeriesCall}
          >
            {!isUploading ? <p>Submit</p> : <div className="submit-button-loader" />}
          </button>
        </div>
      </form>
    </div>
  );
}
