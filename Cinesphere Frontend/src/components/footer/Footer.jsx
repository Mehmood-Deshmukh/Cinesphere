import React from "react";
import { FaGithub } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import ContentWrapper from "../contentWrapper/ContentWrapper";

import "./style.scss";
import { redirect } from "react-router-dom";
const nav = useNavigate;
export const Footer = () => {
  return (
    <footer className="footer">
      <ContentWrapper>
        <div className="socialIcons">
          <p className="username">Made by</p>
          <span className="icon">
          <FaGithub onClick={() => { window.location.href = 'https://github.com/Mehmood-Deshmukh'; }} />

          </span>
          <p className="username">Mehmood-Deshmukh</p>
        </div>
      </ContentWrapper>
    </footer>
  );
};
