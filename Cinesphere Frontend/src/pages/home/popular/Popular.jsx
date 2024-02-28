import React, { useState } from "react";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import { SwitchTabs } from "../../../components/switchTabs/SwitchTabs";
import fetch from "../../../hooks/fetch";
import { Carousel } from "../../../components/carousel/Carousel";
export const Popular = () => {
  const [endpoint, setEndpoint] = useState("movie");

  const onTabChange = (tab) => {

    setEndpoint(tab == "Movies " ? "movie" : "tv");
  };
  const { data, loading } = fetch(`/${endpoint}/popular`);
  return (
    <div className="carouselSection">
      <ContentWrapper>
        <span className="carouselTitle  ">Fan Favorites</span>
        <SwitchTabs data={["Movies ", "TV Shows"]} onTabChange={onTabChange} />
      </ContentWrapper>
      <Carousel endpoint = {endpoint} data={data?.results} loading={loading}/>
    </div>
  );
};
