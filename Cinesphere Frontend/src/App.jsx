import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { fetchData } from "./utils/api";
import { useSelector, useDispatch } from "react-redux";
import { getConfiguration, getGenres } from "./store/sliceHome";
import Header from "./components/header/Header";
import {Footer} from "./components/footer/Footer";
import { Home } from "./pages/home/Home";
import { NotFound } from "./pages/404/NotFound";
import { Details } from "./pages/details/Details";
import { Result } from "./pages/results/Result";
import { Explore } from "./pages/explore/Explore";
import { Analytics } from "@vercel/analytics/react";
import LoginPage from "./pages/login/Login";
import SignUpPage from "./pages/signUp/SignUp";
import ProfilePage from "./pages/profile/Profile";
import { ToastContainer } from "react-toastify";



function App() {
  const dispatch = useDispatch();
  const { url } = useSelector((state) => state.home);

  useEffect(() => {
    fetchConfig();
    genresCall();
  }, []);


  //to get the initial part of Image URL's 
  const fetchConfig = () => {
    fetchData("/configuration").then((res) => {
      const url = {
        backdropBaseUrl : res.images.secure_base_url + "original",
        posterBaseUrl : res.images.secure_base_url + "original",
        profileBaseUrl : res.images.secure_base_url + "original",
      }
      dispatch(getConfiguration(url));
    });
  };


  //To get the genres of movies and tv shows
  const genresCall = async () => {
    let promises = [];
    let endPoints = ["tv", "movie"];
    let allGenres = {};

    endPoints.forEach((url) => {
        promises.push(fetchData(`/genre/${url}/list`));
    });

    const data = await Promise.all(promises);
    console.log(data);
    data.map(({ genres }) => {
        return genres?.map((item) => (allGenres[item.id] = item));
    });

    dispatch(getGenres(allGenres));
};



  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/login" element={<LoginPage /> } />
        <Route path="/profile/:userId" element={<ProfilePage />} />
        <Route path="/" element={<SignUpPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/:mediaType/:id" element={<Details />} />
        <Route path="/search/:query" element={<Result />} />
        <Route path="/explore/:mediaType" element={<Explore />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Analytics />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
