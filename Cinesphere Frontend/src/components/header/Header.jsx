// hooks and react-router
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// icons
import { HiOutlineSearch } from "react-icons/hi";
import { SlMenu } from "react-icons/sl";
import { VscChromeClose } from "react-icons/vsc";

// css
import "./style.scss";
// logo
import logo from "../../assets/cinesphere-logo4.png";

// wrapper
import ContentWrapper from "../contentWrapper/ContentWrapper";

const Header = () => {
  // for handling the visibility of header
  const [visible, setvisible] = useState("top");
  const [lastScrollY, setLastScrollY] = useState(0);

  // for mobile devices
  const [mobileMenu, setMobileMenu] = useState(false);

  //for search query
  const [query, setQuery] = useState("");
  const [showSearch, setShowSearch] = useState("");

  const nav = useNavigate();
  const location = useLocation();

  const openSearchBar = () => {
    setMobileMenu(false);
    setShowSearch(true);
  };

  const openMobileMenu = () => {
    setMobileMenu(true);
    setShowSearch(false);
  };

  const handleSearch = (event) => {
    if (event.key === "Enter" && query.length > 0) {
      nav(`/search/${query}`);
      setTimeout(() => {
        setShowSearch(false);
      }, 1000);
    }
  };
  const userId = localStorage.getItem('userId');

  const handleNavigation = (type) => {
    if (type === "profile") {
      nav(`/profile/${userId}`);
    } else if (type === "movie") {
      nav("/explore/movie");
    } else {
      nav("/explore/tv");
    }
    setMobileMenu(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 200) {
        if (window.scrollY > lastScrollY && !mobileMenu) {
          setvisible("hide");
        } else {
          setvisible("show");
        }
      } else {
        setvisible("top")
      }
      setLastScrollY(window.scrollY);
    });
    return () => {
      window.removeEventListener("scroll", () => {
        if (window.scrollY > 200) {
          if (window.scrollY > lastScrollY && !mobileMenu) {
            setvisible("hide");
          } else {
            setvisible("show");
          }
        }
        setLastScrollY(window.scrollY);
      });
    };
  }, [lastScrollY]);


  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return (
    <header className={`header ${mobileMenu ? "mobileView" : ""} ${visible}`}>
      <ContentWrapper>
        <div className="logo">
          <img src={logo} alt="cinesphere" onClick={()=>{nav('/')}}/>
        </div>
        <ul className="menuStuffs">
          <li
            className="menuStuff"
            onClick={() => {
              handleNavigation("movie");
            }}
          >
            Movies
          </li>
          <li
            className="menuStuff"
            onClick={() => {
              handleNavigation("tv");
            }}
          >
            TV Shows
          </li>
          <li
            className="menuStuff"
            onClick={() => {
              handleNavigation("profile");
            }}
          >
            Profile
          </li>
          <li className="menuStuff">
            <HiOutlineSearch onClick={openSearchBar} />
          </li>
        </ul>
        <div className="mobileStuffs">
          <HiOutlineSearch onClick={openSearchBar} />
          {mobileMenu ? (
            <VscChromeClose
              onClick={() => {
                setMobileMenu(false);
              }}
            />
          ) : (
            <SlMenu onClick={openMobileMenu} />
          )}
        </div>
      </ContentWrapper>
      {showSearch && (
        <div className="searchBar">
          <ContentWrapper>
            <div className="search">
              <input
                type="text"
                placeholder="Search For Your Favorite Movie or TV Show..."
                
                onKeyUp={handleSearch}
                onChange={(event) => {
                  setQuery(event.target.value);
                }}
              />
              <VscChromeClose
                onClick={() => {
                  setShowSearch(false);
                }}
              />
            </div>
          </ContentWrapper>
        </div>
      )}
    </header>
  );
};

export default Header;
