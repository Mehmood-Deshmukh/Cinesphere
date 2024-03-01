import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MovieCard from "../../components/movieCard/MovieCard";
import "./style.scss";
import { ToastContainer, toast } from "react-toastify";
import { useSelector } from "react-redux";
import Img from "../../components/lazyLoadImage/Img";
import fetch from "../../hooks/fetch";
import Spinner from "../../components/spinner/Spinner";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [background, setBackground] = useState("");

  //for Backdrop Image
  const { url } = useSelector((state) => state.home);
  const { data, loading } = fetch("/trending/all/day");

  useEffect(() => {
    const backdrop =
      (url?.backdropBaseUrl || "https://image.tmdb.org/t/p/original") +
      data?.results?.[Math.floor(Math.random() * 20)]?.backdrop_path;
    setBackground(backdrop);
    console.log("Current Backdrop: ", backdrop);
  }, [data]);

  //For Navigation
  const nav = useNavigate();

  //Check If user is Logged in or not
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("User ID not found in localStorage");
      nav("/login");
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

  //For Handling Logout
  const handleLogout = () => {
    localStorage.removeItem("userId");
    nav("/login");
  };

  //for Handling Mark as Watched
  const handleMarkAsWatched = async (data) => {
    console.log("Clicked");

    //toast
    toast.success(`Yay! you Watched ${data.title || data.name}`);

    try {
      //Get the UserId
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("User ID not found in localStorage");
        return;
      }

      //Patch Request
      await axios.patch(
        `https://cinesphere-backend.vercel.app/api/user/${userId}/watchlist/${data?.tmdbId}`,
        { watched: true }
      );
    } catch (error) {
      console.error(
        "Error marking movie as watched:",
        error?.response.data.error
      );
    }
  };

  return (
    <div className="profilepage-container">
      {!userData && <Spinner initial={true} />}
      <div className="backdropImage">
        {!loading && <Img src={background} />}
      </div>
      <div className="opacity-layer"></div>
      <div className="profile-box-container">
        <aside class="profile-card">
          <header>
            <a href="">
              <img src={userData?.avatarUrl || "https://avataaars.io/?accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&facialHairColor=Platinum&clotheType=ShirtScoopNeck&clotheColor=White&eyeType=Happy&eyebrowType=RaisedExcited&mouthType=Smile&skinColor=Light"} class="hoverZoomLink" />
            </a>

            <h1>{userData?.username}</h1>

            <h2>{userData?.email}</h2>
          </header>

          <div class="profile-bio">
            <div>
              <h3>About Me:</h3>
              <p>{userData?.about}</p>
            </div>
            <div>
              <h3>Favorite Genres</h3>
              <p>
                {userData?.favoriteGenres
                  ?.map((genre) => genre.label)
                  .join(", ")}
              </p>
            </div>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </aside>
      </div>
      <ToastContainer position="top-center" />
      <div className="watchList">
        <h1
          style={{ fontSize: "2rem", fontWeight: "bold" }}
        >{`${userData?.username}'s WatchList`}</h1>
        <div className="watchlistItems">
          {userData?.watchlist?.map((movie) => (
            <React.Fragment key={movie.tmdbId}>
              <MovieCard
                data={movie}
                profile={true}
                handleMarkAsWatched={handleMarkAsWatched}
              />
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
