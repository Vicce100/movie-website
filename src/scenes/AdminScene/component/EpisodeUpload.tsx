import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { v4 } from 'uuid';

import { url } from '../../../services/apiService';
import {
  EpisodeSchemaType,
  returnVideos,
  returnVideosArray,
  SeriesSchemaType,
  routesString as rs,
  descriptionMaxLength,
} from '../../../utils/types';
import { usePageTitle, useShuffleArray } from '../../../hooks';

import '../styles/EpisodeUpload.scss';
import { getSeriesData, getSeriesEpisodes, searchSeries } from '../../../services/videoService';

export default function EpisodeUpload() {
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const [addEpisodeIndex, setAddEpisodeIndex] = useState<number>(0);
  const [searchString, setSearchString] = useState<string>('');
  const [searchResponse, setSearchResponse] = useState<returnVideosArray | undefined>(undefined);
  const [seriesToAddEpisode, setSeriesToAddEpisode] = useState<returnVideos>({
    _id: '',
    title: '',
    isMovie: true,
    displayPicture: '',
  });
  const [seriesData, setSeriesData] = useState<SeriesSchemaType | null>(null);
  const [seriesEpisodes, setSeriesEpisodes] = useState<EpisodeSchemaType[][]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number>(0);

  const [episodeDisplayPicture, setEpisodeDisplayPicture] = useState<File | null>(null);
  const [episodePicturePreview, setEpisodePicturePreview] = useState<string | undefined>(undefined);

  const [addEpisodeVideoFile, setAddEpisodeVideoFile] = useState<File | null>(null);
  const [addEpisodeCreationDate, setAddEpisodeCreationDate] = useState<string>(
    dayjs().format().split('T')[0]
  );
  const [episodeDescription, setEpisodeDescription] = useState<string>('');
  const [episodeTitle, setEpisodeTitle] = useState<string>('');

  const { setPageTitle } = usePageTitle();
  const shuffleArray = useShuffleArray();
  const navigate = useNavigate();

  useEffect(() => setPageTitle('Episode Upload'), [setPageTitle]);

  useEffect(() => {
    if (!searchString) return;
    searchSeries(searchString)
      .then((res) => (res.status === 200 ? setSearchResponse(res.data) : null))
      .catch((e) => console.log(e));
  }, [searchString]);

  useEffect(() => {
    if (!seriesToAddEpisode || !seriesToAddEpisode._id) return;
    (async () => {
      try {
        const { data: tempSeriesData } = await getSeriesData(seriesToAddEpisode._id);
        setSeriesData(tempSeriesData);
        if (tempSeriesData) {
          const { data } = await getSeriesEpisodes(tempSeriesData._id);
          setSeriesEpisodes(data);
        }
      } catch (error) {
        console.log(error);
        if (error) navigate('/');
      }
    })();
  }, [navigate, seriesToAddEpisode]);

  const renderSearchEpisode = useCallback(
    () => (
      <div className="search-container">
        <input
          type="text"
          name="search-value"
          id="search-value"
          placeholder="Search for movies and series..."
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
        />
        {searchResponse && (
          <div className="search-value-container">
            {shuffleArray(searchResponse).map((video: returnVideos) => (
              <div className="search-value-element" key={video._id}>
                <button
                  type="button"
                  className="search-value-element-button"
                  onClick={() => {
                    setSeriesToAddEpisode(video);
                    setAddEpisodeIndex(1);
                  }}
                >
                  <img src={video.displayPicture} alt={video.title} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    ),
    [searchResponse, searchString, shuffleArray]
  );

  useEffect(() => {
    if (!episodeDisplayPicture) return;
    const reader = new FileReader();
    reader.onloadend = () => setEpisodePicturePreview(reader.result as string);
    reader.readAsDataURL(episodeDisplayPicture);
  }, [episodeDisplayPicture]);

  const uploadEpisode = useCallback(
    async (
      e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      e.preventDefault();

      if (
        !seriesData ||
        !addEpisodeVideoFile ||
        !episodeDisplayPicture ||
        !episodeDescription ||
        !episodeTitle
      )
        return;

      let episodeNr = 1;
      let seasonNr = 1;

      if (seriesData.episodes[selectedSeason]) episodeNr = seriesData.episodes.length + 1;

      if (seriesEpisodes.length) seasonNr = selectedSeason + 1;

      const formData = new FormData();

      formData.append('videoFile', addEpisodeVideoFile);
      formData.append('displayPicture', episodeDisplayPicture);

      formData.append('seriesId', seriesData?._id);
      formData.append('episodeTitle', episodeTitle);
      formData.append('description', episodeDescription);
      formData.append('releaseDate', dayjs(addEpisodeCreationDate).format());
      formData.append('seasonNr', String(seasonNr));
      formData.append('episodeNr', String(episodeNr));

      const options: RequestInit = { method: 'POST', credentials: 'include', body: formData };
      try {
        setIsUploading(true);
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
        const res: { success: boolean } = await (
          await fetch(`${url}/${rs.video}/${rs.episode}/${rs.add}`, options)
        ).json();
        // console.log(res);
        setSeriesToAddEpisode({
          _id: '',
          title: '',
          isMovie: true,
          displayPicture: '',
        });
        setAddEpisodeVideoFile(null);
        setSeriesData(null);
        setEpisodeDescription('');
        setEpisodeTitle('');
      } catch (error) {
        console.log(error);
      }
      setIsUploading(false);
      setAddEpisodeIndex(0);
    },
    [
      seriesData,
      addEpisodeVideoFile,
      episodeDisplayPicture,
      episodeDescription,
      episodeTitle,
      selectedSeason,
      seriesEpisodes,
      addEpisodeCreationDate,
    ]
  );

  const renderSeriesInfo = useCallback(
    () =>
      seriesData ? (
        <div className="series-data-container">
          <div className="series-data">
            <div className="title-div">
              <h4 className="field-text">{seriesData.title}</h4>
            </div>
            <div className="series-info">
              <div className="displayPicture">
                <img src={seriesData.displayPicture} alt="preview-img" />
              </div>
              <div className="fields">
                <div className="fields">
                  <h4 className="field-text">{seriesData.description}</h4>
                </div>
              </div>
            </div>
            <div className="seasons-and-episodes">
              <div className="seasons">
                {seriesEpisodes.map((_season, index) => (
                  <button
                    type="button"
                    style={{ backgroundColor: selectedSeason === index ? '#03b1fc' : '#fc7ae2' }}
                    key={`${v4()}-season-button`}
                    className="seasons-button"
                    onClick={() => setSelectedSeason(index)}
                  >
                    <p>{index + 1}</p>
                  </button>
                ))}
                <button
                  style={{
                    backgroundColor:
                      selectedSeason === seriesEpisodes.length ? '#03b1fc' : '#fc7ae2',
                  }}
                  className="seasons-button"
                  type="button"
                  onClick={() => setSelectedSeason(seriesEpisodes.length)}
                >
                  +
                </button>
              </div>
              <div className="episodes">
                {seriesEpisodes[selectedSeason] &&
                  seriesEpisodes[selectedSeason].map((episode, index) => (
                    <div className="episode-div" key={episode._id}>
                      <div className="episode-div-header">
                        <div className="text-div">
                          <p className="text episode-index">{index + 1}</p>
                          <p className="text">{episode.episodeTitle}</p>
                        </div>
                        <div className="remaining" />
                      </div>
                      <div className="episode-content">
                        <img
                          src={episode.displayPicture}
                          alt={`${episode.episodeTitle}-img`}
                          className="episode-display-image"
                        />
                        <div className="episode-description">
                          <p>{episode.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                <form
                  onSubmit={uploadEpisode}
                  className="episode-div"
                  style={{
                    backgroundColor: 'rgba(50, 50, 50, 0.5)',
                    boxShadow: '0px 0px 10px rgba(1, 1, 1, 0.5)',
                  }}
                >
                  <div className="episode-div-header">
                    <div className="text-div">
                      <p className="text episode-index">
                        {seriesEpisodes[selectedSeason] && seriesEpisodes[selectedSeason].length
                          ? seriesEpisodes[selectedSeason].length + 1
                          : 1}
                      </p>
                      <input
                        type="text"
                        name="newEpisodeTitle"
                        id="newEpisodeTitle"
                        placeholder="Episode Title"
                        value={episodeTitle}
                        onChange={(e) => setEpisodeTitle(e.target.value)}
                      />
                      <p className="move-left">Video File</p>
                      <input
                        className="episode-video-file"
                        style={{ display: 'none' }}
                        type="file"
                        name="addEpisodeVideoFile"
                        id="addEpisodeVideoFile"
                        accept="video/mp4"
                        onChange={(e) =>
                          setAddEpisodeVideoFile(e.target.files && e.target.files[0])
                        }
                      />
                      <label htmlFor="addEpisodeVideoFile" />

                      <label className="move-left" htmlFor="creationDate">
                        Creation Date
                      </label>
                      <input
                        type="date"
                        name="creationDate"
                        id="creationDate"
                        accept="video/*"
                        value={addEpisodeCreationDate}
                        className="creation-date move-left"
                        onChange={(e) => setAddEpisodeCreationDate(e.target.value)}
                      />
                    </div>
                    <div className="remaining" />
                  </div>
                  <div className="episode-content">
                    <input
                      className="display-picture-input"
                      style={{ display: 'none' }}
                      type="file"
                      name="displayPicture"
                      id="displayPicture"
                      accept="image/*"
                      onChange={(e) =>
                        setEpisodeDisplayPicture(e.target.files && e.target.files[0])
                      }
                    />
                    <label htmlFor="displayPicture">
                      {episodePicturePreview && (
                        <img
                          className="episode-display-image"
                          src={episodePicturePreview}
                          alt="preview"
                        />
                      )}
                    </label>
                    <div className="episode-description">
                      <textarea
                        value={episodeDescription}
                        onChange={(e) => setEpisodeDescription(e.target.value)}
                        placeholder="Description..."
                        maxLength={descriptionMaxLength}
                      />
                    </div>
                  </div>
                  <div className="episode-div-header">
                    <button
                      className="submit-button"
                      type="submit"
                      onClick={uploadEpisode}
                      disabled={!!isUploading}
                    >
                      {!isUploading ? (
                        <p>Submit</p>
                      ) : (
                        <div className="submit-video-button-loader" />
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <></>
      ),
    [
      seriesData,
      selectedSeason,
      seriesEpisodes,
      uploadEpisode,
      episodeTitle,
      addEpisodeCreationDate,
      episodePicturePreview,
      episodeDescription,
      isUploading,
    ]
  );

  if (addEpisodeIndex === 0) return renderSearchEpisode();
  if (addEpisodeIndex === 1) return renderSeriesInfo();
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>;
}
