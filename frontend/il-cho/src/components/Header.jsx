import "./Header.css";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserProfile } from "../util/get-user-img";
import useStore from "../store";
import { Cookies } from "react-cookie";
import { logout } from "../api/getUserApi";

const Header = () => {
  const nav = useNavigate();
  const location = useLocation();
  const setUserId = useStore((state) => state.setUserId);
  const setUserName = useStore((state) => state.setUserName);
  const setUserProfile = useStore((state) => state.setUserProfile);
  const userProfile = useStore((state) => state.userProfile);

  const cookies = new Cookies();

  const removeCookie = (name) => {
    return cookies.remove(name);
  };

  const logoutuser = async () => {
    await logout()
      .then(() => {})
      .catch((error) => {
      })
      .finally(() => {
        sessionStorage.removeItem("AccessToken");
        removeCookie("RefreshToken");
        setUserId("");
        setUserName("");
        setUserProfile(0);
        nav("/");
      });
  };

  const onNextPage = () => {
    sessionStorage.setItem("redirection", location.pathname);
    nav("/login");
  };

  const createPage = () => {
    // window.localStorage.removeItem("invitationCode");
    localStorage.clear();
    nav("/create/image");
  };

  const unlogin = () => {
    return (
      <>
        {location.pathname === "/login" ? (
          <></>
        ) : (
          <div className="login text-lg font-bold" onClick={onNextPage}>
            <div>로그인</div>
          </div>
        )}
      </>
    );
  };

  const logined = () => {
    const dropdown = () => {
      return (
        <MenuItems
          as="div"
          className="absolute right-0 z-50 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg justify-center ring-1 ring-black ring-opacity-5 transition focus:outline-none"
        >
          <div className="py-1 px-0 mx-0">
            <MenuItem
              as="button"
              className="block px-4 py-2 w-full text-sm text-gray-700 border-b-2 hover:bg-gray-100 hover:text-gray-900 text-center"
              onClick={() => nav("/mypage")}
            >
              마이 페이지
            </MenuItem>
            <MenuItem
              as="button"
              className="block px-4 py-2 w-full text-sm text-gray-700 border-b-2 hover:bg-gray-100 hover:text-gray-900 text-center"
              onClick={() => createPage()}
            >
              초대장 생성하기
            </MenuItem>
            <MenuItem
              as="button"
              className="block px-4 py-2 w-full text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-center"
              onClick={() => logoutuser()}
            >
              로그아웃
            </MenuItem>
          </div>
        </MenuItems>
      );
    };

    return (
      <Menu as="div" className="menu-div relative inline-block text-left">
        <div className="rounded-full">
          <MenuButton className="inline-flex justify-center w-10 h-10 rounded-full bg-white text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            <img
              src={getUserProfile(userProfile)}
              alt="Profile"
              className="rounded-full w-10 h-10"
            />
          </MenuButton>
        </div>
        {dropdown()}
      </Menu>
    );
  };

  return (
    <>
      <div className="Header" id="header">
        <div className="Logo" onClick={() => nav("/")}>
          일<span className="Logo-cho">초</span>
        </div>
        <div className="header-right">
          {userProfile == 0 ? unlogin() : logined(1)}
        </div>
      </div>
    </>
  );
};

export default Header;
