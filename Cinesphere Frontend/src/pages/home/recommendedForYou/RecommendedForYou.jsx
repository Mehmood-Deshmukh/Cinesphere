import React, { useState, useEffect } from "react";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import { Carousel } from "../../../components/carousel/Carousel";
import fetch from "../../../hooks/fetch";
import axios from "axios";
import { SwitchTabs } from "../../../components/switchTabs/SwitchTabs";

export const RecommendedForYou = () => {
  const [userData, setUserData] = useState(null);
  const [endpoint, setEndpoint] = useState("movie");

  const onTabChange = (tab) => {
    setEndpoint(tab === "Movies" ? "movie" : "tv");
  };


  //Check if user is Logged in or not
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("User ID not found in localStorage");
      history("/login");
    }


    //for fetching UserData
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `https://cinesphere-backend.vercel.app/api/user/${userId}`
        );
        setUserData(response.data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);


  //Fetching Recommended Movies/TV shows Data
  const { data, loading } = fetch(
    `/discover/${endpoint}?with_genres=${userData?.genres?.slice(-3)
      ?.map((genre) => genre.id)
      .join(",") || '18,80'} `
  );


  return (
    (userData?.genres.length > 0)  && (
      <div className="carouselSection">
        <ContentWrapper>
          <span className="carouselTitle">Recommended For You</span>
          <SwitchTabs data={["Movies", "TV Shows"]} onTabChange={onTabChange} />
        </ContentWrapper>
        <Carousel data={data?.results} loading={loading} endpoint={endpoint} />
      </div>
    )
  );
};
