import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import axios from "axios";
import "./style.scss";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import fetch from "../../../hooks/fetch";
import Genres from "../../../components/genres/Genres";
import CircleRating from "../../../components/circleRating/CircleRating";
import Img from "../../../components/lazyLoadImage/Img.jsx";
import PosterFallback from "../../../assets/no-poster2.png";
import Play from "../PlayButton.jsx";
import VideoPopup from "../../../components/videoPopup/VideoPopup.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DetailsBanner = ({ video, crew }) => {
  const [show, setShow] = useState(false);
  const [videoId, setvideoId] = useState(null);
  const { mediaType, id } = useParams();
  const { data, loading } = fetch(`/${mediaType}/${id}`);
  const [checked, setChecked] = useState(false);
  const extracted_genre_ids = data?.genres?.map((data) => data.id);

  const extracted_genres = data?.genres?.map((data) => data);
  const director = crew?.filter((member) => member.job === "Director");

  const writer = crew?.filter(
    (member) =>
      member.job === "Screenplay" ||
      member.job === "Story" ||
      member.job === "Writer"
  );

  //for Converting Format of Currency
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  //For Converting Format of time
  const toHoursAndMinutes = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`;
  };

  //Check If Movie is Already in WatchList
  useEffect(() => {
    try {
      const userId = localStorage.getItem("userId");
      const fetchWatchlist = async () => {
        const response = await axios.get(
          `https://cinesphere-backend.vercel.app/api/user/${userId}`
        );
        const watchlist = response?.data?.user?.watchlist;
        const isPresent = watchlist.find((item) => item.tmdbId === data?.id);
        if (isPresent) {
          setChecked(true);
          document.getElementsByClassName("checked")[0].style.opacity = "1";
          document.getElementsByClassName("unchecked")[0].style.opacity = "0";
          document.getElementsByClassName("circle")[0].style.fill = "white";
        }
      };
      fetchWatchlist();
    } catch (err) {
      console.log(err);
    }
  }, [data]);

  //For Handling Add to Watchlist
  const handleAddToWatchlist = async () => {
    document.getElementsByClassName("checked")[0].style.opacity = "1";
    document.getElementsByClassName("unchecked")[0].style.opacity = "0";
    document.getElementsByClassName("circle")[0].style.fill = "white";
    const userId = localStorage.getItem("userId");
    try {
      const response = await axios.post(
        `https://cinesphere-backend.vercel.app/api/user/${userId}/watchlist`,
        {
          Type: data.title || data.name,
          Id: data.id,
          genre: extracted_genres,
          poster_path: data.poster_path,
          release_date: data.release_date,
          vote_average: data.vote_average,
          media_type: mediaType,
          watched: false,
        }
      );

      const msg = `added ${data.title || data.name} to watchlist`;
      toast.success(msg);
      console.log("Added to watchlist:", response.data);

      setChecked(!checked);
    } catch (error) {
      const errmsg = `${data.title || data.name} is already in watchlist`;
      console.error("Error adding to watchlist:", error);
      toast.error(errmsg);
    }
  };

  //for initial part of Image URL's
  const url = useSelector((state) => state.home);

  return (
    <div className="detailsBanner">
      <ToastContainer position="top-center" />
      {!loading ? (
        <>
          {!!data && (
            <React.Fragment>
              <div className="backdrop-img">
                <Img
                  src={
                    (url?.backdropBaseUrl ||
                      "https://image.tmdb.org/t/p/original") +
                    data.backdrop_path
                  }
                />
              </div>
              <div className="opacity-layer"></div>
              <ContentWrapper>
                <div className="content">
                  <div className="left">
                    {data.poster_path ? (
                      <Img
                        className="posterImg"
                        src={`https://image.tmdb.org/t/p/original${data.poster_path}`}
                      />
                    ) : (
                      <Img className="posterImg" src={PosterFallback} />
                    )}
                  </div>
                  <div className="right">
                    <div className="title">
                      {`${data.name || data.title} (${dayjs(
                        data.release_date
                      ).format("YYYY")})`}
                      {", "}
                      {
                        <span className="subtitle">
                          {data.production_countries[0]?.iso_3166_1}
                        </span>
                      }

                      <a
                        className={`button-add-to-favourites`}
                        onClick={handleAddToWatchlist}
                        id={`a${data?.tmdbId}`}
                        style={{ cursor: "pointer" }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 74 74"
                          height="40px"
                          width="40px"
                        >
                          <circle
                            className="circle"
                            cx="37"
                            cy="37"
                            r="36"
                            stroke-width="1.7"
                          />
                          <path
                            className="checked"
                            d="M53.8 25a9.94 9.94 0 0 0-7.46-3.4A9.94 9.94 0 0 0 38.9 25L37 27.06 35.1 25a9.94 9.94 0 0 0-7.44-3.4A9.94 9.94 0 0 0 20.2 25a12.36 12.36 0 0 0 0 16.16l2.03 2.25 11.41 12.63.62.6c.23.18.48.34.74.47.6.33 1.23.49 1.95.49h.08a4 4 0 0 0 1.95-.49c.26-.13.5-.29.74-.47l.62-.6L51.76 43.4l2.03-2.25a12.36 12.36 0 0 0 0-16.16"
                          />
                          <g transform="translate(17.2 21.6)">
                            <path
                              className="unchecked"
                              d="M36.59 3.4A9.92 9.92 0 0 0 29.15 0a9.92 9.92 0 0 0-7.44 3.4l-1.93 2.06-1.9-2.06A9.92 9.92 0 0 0 10.44 0 9.92 9.92 0 0 0 3 3.4c-4 4.45-4 11.7 0 16.16l2.03 2.25 11.4 12.63.62.6a4.44 4.44 0 0 0 5.55 0l2.02-2.12.04-.04c.3-.32.49-.78.49-1.29 0-1-.8-1.88-1.81-1.88-.48 0-.88.18-1.23.5l-.05.05-.04.05-.97 1-.53.6c-.13.14-.35.37-.74.37-.36 0-.62-.23-.75-.37l-.53-.6-8.54-9.45-4.36-4.82a8.4 8.4 0 0 1 0-11.07 6.49 6.49 0 0 1 4.84-2.25c1.8 0 3.52.78 4.85 2.25l4.49 4.96 4.49-5a6.49 6.49 0 0 1 4.84-2.26c1.8 0 3.52.78 4.84 2.25a8.4 8.4 0 0 1 0 11.07l-1.06 1.2-.04.04c-.3.32-.49.78-.49 1.29 0 1 .8 1.88 1.8 1.88.54 0 .98-.23 1.33-.6l1.14-1.24A12.42 12.42 0 0 0 36.6 3.4m-4.23 19.74h-2.02v-2.06c0-1.01-.8-1.89-1.8-1.89-1.02 0-1.81.83-1.81 1.89v2.06h-1.98c-1.01 0-1.8.83-1.8 1.89 0 1.05.79 1.88 1.8 1.88h1.98v2.06c0 1.01.8 1.89 1.8 1.89 1.02 0 1.81-.83 1.81-1.89v-2.06h1.98c1.01 0 1.8-.83 1.8-1.88 0-1.06-.79-1.89-1.76-1.89"
                            />
                          </g>
                        </svg>
                      </a>
                    </div>
                    <div className="subtitle">{data.tagline}</div>
                    <Genres data={extracted_genre_ids} />
                    <div className="row">
                      <CircleRating rating={data.vote_average.toFixed(1)} />
                      <div
                        className="playbtn"
                        onClick={() => {
                          setShow(true);
                          setvideoId(video?.key);
                        }}
                      >
                        <Play />
                        <span className="text">Watch Trailer</span>
                      </div>
                    </div>
                    <div className="overview">
                      <div className="heading">Storyline</div>
                      <div className="description">{data.overview}</div>
                    </div>
                    <div className="info">
                      {data.status && (
                        <div className="infoItem">
                          <span className="text bold">Status: </span>
                          <span className="text">{data.status}</span>
                        </div>
                      )}
                      {data.release_date && (
                        <div className="infoItem">
                          <span className="text bold">Release Date: </span>
                          <span className="text">
                            {dayjs(data.release_date).format("MMM D, YYYY")}
                          </span>
                        </div>
                      )}
                      {data.runtime && (
                        <div className="infoItem">
                          <span className="text bold">Runtime: </span>
                          <span className="text">
                            {toHoursAndMinutes(data.runtime)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="info">
                      {data.budget > 0 && (
                        <div className="infoItem">
                          <span className="text bold">Budget: </span>
                          <span className="text">
                            {formatter.format(data.budget)}
                          </span>
                        </div>
                      )}
                      {data.revenue > 0 && (
                        <div className="infoItem">
                          <span className="text bold">Revenue: </span>
                          <span className="text">
                            {formatter.format(data.revenue)}
                          </span>
                        </div>
                      )}
                      {data.original_language && (
                        <div className="infoItem">
                          <span className="text bold">Language: </span>
                          <span className="text">
                            {data.spoken_languages[0].english_name}
                          </span>
                        </div>
                      )}
                    </div>
                    {data.homepage && (
                      <div className="info">
                        <div
                          className="playbtn Watchbtn"
                          onClick={() => {
                            window.location.href = data.homepage;
                          }}
                        >
                          <Play />
                          <span className="text" style={{ opacity: "1" }}>
                            Click to Watch!
                          </span>
                        </div>
                      </div>
                    )}
                    {director?.length > 0 && (
                      <div className="info">
                        <span className="text bold">Director: </span>
                        <span className="text">
                          {director?.map((d, i) => (
                            <span key={i}>
                              {d.name}
                              {director.length - 1 !== i && ", "}
                            </span>
                          ))}
                        </span>
                      </div>
                    )}
                    {writer?.length > 0 && (
                      <div className="info">
                        <span className="text bold">Writer: </span>
                        <span className="text">
                          {writer?.map((d, i) => (
                            <span key={i}>
                              {d.name}
                              {writer.length - 1 !== i && ", "}
                            </span>
                          ))}
                        </span>
                      </div>
                    )}
                    {data?.created_by?.length > 0 && (
                      <div className="info">
                        <span className="text bold">Creator: </span>
                        <span className="text">
                          {data?.created_by?.map((d, i) => (
                            <span key={i}>
                              {d.name}
                              {data?.created_by.length - 1 !== i && ", "}
                            </span>
                          ))}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </ContentWrapper>
              <VideoPopup
                show={show}
                setShow={setShow}
                videoId={videoId}
                setVideoId={setvideoId}
              />
            </React.Fragment>
          )}
        </>
      ) : (
        <div className="detailsBannerSkeleton">
          <ContentWrapper>
            <div className="left skeleton"></div>
            <div className="right">
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
            </div>
          </ContentWrapper>
        </div>
      )}
    </div>
  );
};

export default DetailsBanner;
