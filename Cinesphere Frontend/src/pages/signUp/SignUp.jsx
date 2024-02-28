import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import "./style.scss";
import fetch from "../../hooks/fetch";
import { useSelector } from "react-redux";
import Img from "../../components/lazyLoadImage/Img";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import { ToastContainer, toast } from "react-toastify";

const SignUpPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [about, setAbout] = useState("");
  const [favoriteGenres, setFavoriteGenres] = useState([]);
  const [background, setBackground] = useState("");

  //for BackDrop Images
  const { url } = useSelector((state) => state.home);
  const { data, loading } = fetch("/trending/all/day");

  //For Routing
  const nav = useNavigate();

  //Setting the background Image
  useEffect(() => {
    const backdrop =
      (url?.backdropBaseUrl || "https://image.tmdb.org/t/p/original") +
      data?.results?.[Math.floor(Math.random() * 20)]?.backdrop_path;
    setBackground(backdrop);
    console.log("Current Backdrop: ", backdrop);
  }, [data]);
  

  //Check If user is already Logged in
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      console.error("User Logged In");
      nav("/home");
    }
  }, []);

  //Options For Genres
  const options = [
    { value: 28, label: "Action" },
    { value: 12, label: "Adventure" },
    { value: 16, label: "Animation" },
    { value: 35, label: "Comedy" },
    { value: 80, label: "Crime" },
    { value: 99, label: "Documentary" },
    { value: 18, label: "Drama" },
    { value: 10751, label: "Family" },
    { value: 14, label: "Fantasy" },
    { value: 36, label: "History" },
    { value: 27, label: "Horror" },
    { value: 10402, label: "Music" },
    { value: 9648, label: "Mystery" },
    { value: 10749, label: "Romance" },
    { value: 878, label: "Science Fiction" },
    { value: 10770, label: "TV Movie" },
    { value: 53, label: "Thriller" },
    { value: 10752, label: "War" },
    { value: 37, label: "Western" },
  ];


  //Handling User Registration
  const handleRegister = async () => {
    try {
      await axios.post("https://cinesphere-backend.vercel.app/api/register", {
        username,
        email,
        password,
        about,
        favoriteGenres,
      });

      toast.success("User Succesfully Registered!");

      setTimeout(() => {
        nav(`/login`);
      }, 1000);


    } catch (error) {
      console.log(error?.response.data.error);
      toast.error(error?.response.data.error);
    }
  };




  return (
    <div className="container">
      <ToastContainer position="top-center" />
      <div className="backdropImage">
        {!loading && <Img src={background} />}
      </div>
      <div className="opacity-layer"></div>
      <div className="signup-container">
        <h2>Sign Up!</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <textarea
          placeholder="About"
          value={about}
          cols="10"
          rows="3"
          onChange={(e) => setAbout(e.target.value)}
        />
        <Select
          options={options}
          isMulti
          placeholder="Select Favourite genres"
          onChange={(selectedGenres) => setFavoriteGenres(selectedGenres)}
          className="react-select-container genresDD"
          classNamePrefix="react-select"
        />
        <button onClick={handleRegister}>Register</button>
        <p className="other">
          Already an User?{" "}
          <span
            onClick={() => {
              nav("/login");
            }}
          >
            Log in
          </span>
        </p>
      </div>{" "}
    </div>
  );
};

export default SignUpPage;
