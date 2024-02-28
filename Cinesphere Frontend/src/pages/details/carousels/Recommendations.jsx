import React from "react";

import { Carousel } from "../../../components/carousel/Carousel";
import fetch from "../../../hooks/fetch";

const Recommendation = ({ mediaType, id }) => {
  const { data, loading, error } = fetch(`/${mediaType}/${id}/recommendations`);
  const { data: title_data, loading: title_loading } = fetch(`/${mediaType}/${id}`);
  const title = `If you liked  '${title_data?.name || title_data?.title}' Then you Must Watch`;
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

export default Recommendation;
