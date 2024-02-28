import React, { useEffect } from "react";
import "./style.scss";
import { Hero } from "./hero/Hero";
import { Trending } from "./trending/Trending";
import { Popular } from "./popular/Popular";
import { TopRated } from "./topRated/TopRated";
import { useNavigate } from "react-router-dom";
import { RecommendedForYou } from "./recommendedForYou/RecommendedForYou";

export const Home = () => {
  const nav = useNavigate();

  
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("User ID not found in localStorage");
      nav("/login");
    }
  }, []);

  return (
    <div className="homePage">
      <Hero />
      <RecommendedForYou />
      <Trending />
      <TopRated />
      <Popular />
    </div>
  );
};
