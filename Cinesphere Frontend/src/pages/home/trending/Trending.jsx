import React, { useState } from "react";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import { SwitchTabs } from "../../../components/switchTabs/SwitchTabs";
import fetch from "../../../hooks/fetch";
import { Carousel } from "../../../components/carousel/Carousel";
export const Trending = () => {
  const [endpoint, setEndpoint] = useState("day");

  const onTabChange = (tab) => {
    setEndpoint(tab === "Day " ? "day" : "week");
  };
  const { data, loading } = fetch(`/trending/all/${endpoint}`);
  return (
    <div className="carouselSection">
      <ContentWrapper>
        <span className="carouselTitle  ">Trending</span>
        <SwitchTabs data={["Day ", "Week"]} onTabChange={onTabChange} />
      </ContentWrapper>
      <Carousel data={data?.results} loading={loading}/>
    </div>
  );
};
