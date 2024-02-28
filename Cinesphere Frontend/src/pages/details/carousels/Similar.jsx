import React from "react";

import { Carousel } from "../../../components/carousel/Carousel";
import fetch from "../../../hooks/fetch";

const Similar = ({ mediaType, id }) => {
  const { data, loading, error } = fetch(`/${mediaType}/${id}/similar`);
  const { data: title_data, loading: title_loading } = fetch(`/${mediaType}/${id}`);
  const title = `Similar to '${title_data?.name || title_data?.title}'`;

  return (
    data?.results?.length > 0 && (
      <Carousel
        title={title}
        data={data?.results}
        loading={loading}
        endpoint={mediaType}
      />
    )
  );
};

export default Similar;
