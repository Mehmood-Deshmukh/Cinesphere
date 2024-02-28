import React, { useEffect, useState } from "react";
import "./style.scss";
import { useNavigate } from "react-router-dom";
import fetch from "../../../hooks/fetch";
import { useSelector } from "react-redux";
import Img from "../../../components/lazyLoadImage/Img";
import ContentWrappper from "../../../components/contentWrapper/ContentWrapper";

export const Hero = () => {
  const [background, setBackground] = useState("");
  const [query, setQuery] = useState("");
  const nav = useNavigate();
  const { url } = useSelector((state) => state.home);
  const { data, loading } = fetch("/trending/all/day");

  useEffect(() => {
    const backdrop =
      (url?.backdropBaseUrl || "https://image.tmdb.org/t/p/original") +
      data?.results?.[Math.floor(Math.random() * 20)]?.backdrop_path;
    setBackground(backdrop);
    console.log("Current Backdrop: ", backdrop);
  }, [data]);

  const handleSubmit = ()=>{
    if (query.length > 0) {
      nav(`/search/${query}`);
    }
  }
  const handleSearch = (event) => {
    if (event.key === "Enter" && query.length > 0) {
      nav(`/search/${query}`);
    }
  };
  return (
    <div className="hero">
      <div className="backdropImage">
        {!loading && <Img src={background} />}
      </div>
      <div className="opacity-layer"></div>
      <ContentWrappper>
          <div className="Content">
            <span className="heading">Hey There!</span>
            <span className="subHeading">
              Discover the Unseen, Love the Unforgettable: Your Ultimate
              Companion for Movie and TV Recommendations.
            </span>
            <div className="search">
              <input
                type="text"
                placeholder="Search For Your Favorite Movie or TV Show..."
                onKeyUp={handleSearch}
                onChange={(event) => {
                  setQuery(event.target.value);
                }}
              />
              <button onClick={handleSubmit}>Search</button>
            </div>
          </div>
      </ContentWrappper>
    </div>
  );
};
