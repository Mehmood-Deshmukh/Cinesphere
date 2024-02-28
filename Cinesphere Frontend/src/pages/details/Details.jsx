import React, { useEffect } from "react";
import "./style.scss";
import { useNavigate, useParams } from "react-router-dom";
import fetch from "../../hooks/fetch";
import DetailsBanner from "./detailsBanner/DetailsBanner";
import Cast from "./cast/Cast";
import VideosSection from "./videosSection/VideosSection";
import Similar from "./carousels/Similar";
import Recommendation from "./carousels/Recommendations";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export const Details = () => {
  const { mediaType, id } = useParams();
  const { data, loading } = fetch(`/${mediaType}/${id}/videos`);
  const { data: credits, loading: creditsLoading } = fetch(
    `/${mediaType}/${id}/credits`
  );

  const nav = useNavigate();
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("User ID not found in localStorage");
      nav("/login");
    }
  }, []);

  const trailer = data?.results?.filter((f) => f.type == "Trailer");
  console.log(trailer);
  return (
    <div>
      {" "}
      <DetailsBanner video={trailer?.[0]} crew={credits?.crew} />
      <Cast data={credits?.cast} loading={creditsLoading} />
      <VideosSection data={data} loading={loading} />
      <Similar mediaType={mediaType} id={id} />
      <Recommendation mediaType={mediaType} id={id} />
    </div>
  );
};
