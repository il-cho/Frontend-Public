import { Cookies } from "react-cookie";
import { getUser } from "../api/getUserApi";
import { getImage } from "../util/get-login-img";
import useStore from "../store";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Login = () => {
  const cookies = new Cookies();
  const [redirection, setRedirection] =useState("/");
  const nav = useNavigate();
  
  const setUserId = useStore((state) => state.setUserId);
  const setUserName = useStore((state) => state.setUserName);
  const setUserProfile = useStore((state) => state.setUserProfile);

  const getCookie = (name) => {
    return cookies.get(name);
  };

  const removeCookie = (name) => {
    return cookies.remove(name);
  };
  
  useEffect(() => {
    const sessionRedirection = sessionStorage.getItem("redirection");
    if(sessionRedirection) {
      setRedirection(sessionRedirection);
      sessionStorage.removeItem("redirection");
    }

    const AccessToken = sessionStorage.getItem("AccessToken");
    const RefreshToken = getCookie("RefreshToken");
    if(AccessToken && AccessToken !== null && AccessToken !== undefined && AccessToken != 'null' && AccessToken != 'undefined') {
      onNextPage();
    } 
    else if(RefreshToken && RefreshToken !== undefined && RefreshToken != 'undefined') {
      tryRelogin();
    } 
    else {
      removeData;
    }
    
  },[])

  const tryRelogin = async () => {
    reissue()
      .then((data) => {
        if(data.token) {
          sessionStorage.setItem("AccessToken", data.token);
          getData();
        }
      })
      .catch(() => {
        removeData;
      });
  };

  const getData = async () => {
    getUser()
      .then((data) => {
        const result = data.result;
        setUserId(result.id);
        setUserName(result.nickname);
        setUserProfile(result.profile);
        onNextPage();
      })
      .catch((error) => {
        window.sessionStorage.removeItem("AccessToken");
      });
  };

  const removeData = () => {
    window.sessionStorage.removeItem("AccessToken");
    removeCookie("RefreshToken");
    setUserId("");
    setUserName("");
    setUserProfile(0);
  }


  const onNextPage = () => {
    nav(redirection);
  };

  const login = (platform) => {
    const localhost = "https://il-cho.site";
    const loginPopup = window.open(
      `${localhost}/api/oauth2/authorization/${platform}?mode=login`,
      "loginPopup",
      "popup=true"
    );

    const checkPopup = setInterval(async () => {
      if (loginPopup.closed) {
        clearInterval(checkPopup);
        if(getCookie("RefreshToken")) {
          sessionStorage.setItem("AccessToken", getCookie("AccessToken"));
          removeCookie("AccessToken");
          getData();
        }
      }
    }, 500);
  };


  return (
    <>
      <div className="Login-titlebox">
        <div className="Login-title">
          <img
            src={getImage("envelope")}
            className="Login-image"
            id="Login-image1"
          />
          <img
            src={getImage("partypopper")}
            className="Login-image"
            id="Login-image2"
          />
          <img
            src={getImage("magicwind")}
            className="Login-image"
            id="Login-image3"
          />
          일<span className="Login-title-cho">초</span>
        </div>
      </div>
      <div className="button-group">
        <button
          className="button-common button-kakao"
          onClick={() => login("kakao")}
        >
          <img className="kakao-icon" src={getImage("kakao")} />
          <div>카카오로 시작하기</div>
        </button>
        <button
          className="button-common button-naver"
          onClick={() => login("naver")}
        >
          <img className="naver-icon" src={getImage("naver")} />
          <div>네이버로 시작하기</div>
        </button>
      </div>
    </>
  );
};

export default Login;
