import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import { useSelector } from "react-redux";
import fetch from "../../hooks/fetch";
import Img from "../../components/lazyLoadImage/Img";
import { ToastContainer, toast } from "react-toastify";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [background, setBackground] = useState("");

  //for routing
  const nav = useNavigate();

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

  //Check If user is Logged in or not
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      console.error("User Logged In");
      nav("/home");
    }
  }, []);

  //For Handling Login
  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "https://cinesphere-backend.vercel.app/api/login",
        {
          email,
          password,
        }
      );

      const userId = response.data.user._id;
      localStorage.setItem("userId", userId);
      toast.success("Succesfully Logged In , Welcome Back!");
      setTimeout(() => {
        nav(`/home`);
      }, 1000);
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error(error?.response.data.error);
    }
  };

  return (
    <div className="container-login">
      <ToastContainer position="top-center" />

      <div className="backdropImage">
        {!loading && <Img src={background} />}
      </div>
      <div className="opacity-layer"></div>
      <div className="login-container">
        <h2>Login</h2>
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
        <button onClick={handleLogin}>Login</button>
        <p className="other">
          New User?{" "}
          <span
            onClick={() => {
              nav("/");
            }}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
