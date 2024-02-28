import React from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import "./style.scss";
import Img from "../lazyLoadImage/Img";
import CircleRating from "../circleRating/CircleRating";
import Genres from "../genres/Genres";
import PosterFallback from "../../assets/no-poster2.png";

const MovieCard = ({
  data,
  fromSearch,
  mediaType,
  profile,
  handleMarkAsWatched,
}) => {
  const { url } = useSelector((state) => state.home);
  const navigate = useNavigate();
  const posterUrl = data.poster_path
    ? `https://image.tmdb.org/t/p/original${data.poster_path}`
    : PosterFallback;

  const handleClick = (data) => {
    console.log(data);
    document.getElementById(`${data.tmdbId}`).style.filter = "grayscale(100%)";
    console.log(document.getElementById(`btn${data?.tmdbId}`));
    document.getElementById(`btn${data?.tmdbId}`).style.display = "none";

    handleMarkAsWatched(data);
  };
  return (
    <div className="movieCard">
      <div
        className="posterBlock"
        id={data.tmdbId}
        onClick={() =>
          navigate(`/${data.media_type || mediaType}/${data.id || data.tmdbId}`)
        }
      >
        <Img
          className={`posterImg  ${data.watched ? "watched" : " "}`}
          src={posterUrl}
        />
        {fromSearch && (
          <React.Fragment>
            <CircleRating rating={data.vote_average.toFixed(1)} />
            <Genres data={data.genre_ids.slice(0, 2)} />
          </React.Fragment>
        )}
      </div>
      <div className={`textBlock  ${data.watched ? " " : "textflex"}  `}>
        <div>
          <span className="title">{data.title || data.name}</span>
          <span className="date">
            {dayjs(data.release_date).format("MMM D, YYYY")}
          </span>
        </div>
        {profile && !data.watched && (
          <button
            className="watched-button"
            id={`btn${data.tmdbId}`}
            onClick={() => handleClick(data)}
          >
            Mark as <br /> Watched
          </button>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
