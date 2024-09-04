import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Landing from "./pages/Landing/Landing";
import Cover from "./pages/Cover";
import Login from "./pages/Login";
import LoginSuccess from "./pages/LoginSuccess";
import Calendar from "./pages/CalendarPage/CalendarPage";
import Account from "./pages/Account";
import CreateComplete from "./pages/CreateComplete";
import View from "./pages/View";
import Chat from "./pages/ChatRoom";
import Place from "./pages/Place";
import MyPage from "./pages/MyPage";
import InvitationList from "./pages/InvitationList";
import Error from "./pages/Error";
import { Cookies } from "react-cookie";
import { getUser, reissue } from "./api/getUserApi";
import useStore from "./store";
import { useEffect } from "react";
import Chatbot from "./pages/ChatbotPage/ChatbotPage";

function App() {
  const cookies = new Cookies();
  const location = useLocation();
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
    const AccessToken = window.sessionStorage.getItem("AccessToken");
    const RefreshToken = getCookie("RefreshToken");
    if (
      AccessToken &&
      AccessToken !== null &&
      AccessToken !== undefined &&
      AccessToken != "null" &&
      AccessToken != "undefined"
    ) {
      getData();
    } else if (RefreshToken && RefreshToken !== undefined && RefreshToken != "undefined") {
      tryReLogin();
    } else {
      removeData;
    }

    const jsKey = "";

    if (!Kakao.isInitialized()) {
      Kakao.init(jsKey);
    }
  }, []);

  useEffect(() => {
    let AccessToken = window.sessionStorage.getItem("AccessToken");
    if (
      !(
        AccessToken &&
        AccessToken !== null &&
        AccessToken !== undefined &&
        AccessToken != "null" &&
        AccessToken != "undefined"
      )
    ) {
      tryReLogin();
      AccessToken = window.sessionStorage.getItem("AccessToken");
    }
    const checkLocation = (startText) => {
      return location.pathname.startsWith(startText);
    };

    // if (checkLocation("/create")) {
    //   if (AccessToken && AccessToken != "undefined") {
    //     nav(localStorage.getItem("lastPage"));
    //   } else {
    //     removeData;
    //     window.sessionStorage.setItem("redirection", "/create/image");
    //     nav("/login");
    //   }
    // } else
    if (checkLocation("/mypage")) {
      if (AccessToken && AccessToken != "undefined") {
      } else {
        removeData;
        window.sessionStorage.setItem("redirection", "/mypage");
        nav("/login");
      }
    }
  }, [location.pathname]);

  const removeData = () => {
    window.sessionStorage.removeItem("AccessToken");
    removeCookie("RefreshToken");
    setUserId("");
    setUserName("");
    setUserProfile(0);
  };

  const tryReLogin = async () => {
    const result = await relogin();
    if (result) {
      getUser()
        .then((data) => {
          const result = data.result;
          setUserId(result.id);
          setUserName(result.nickname);
          setUserProfile(result.profile);
        })
        .catch((error) => {
          removeData;
        });
    } else {
      removeData;
    }
  };

  const relogin = async () => {
    const result = await reissue()
      .then((data) => {
        if (data.token) {
          window.sessionStorage.setItem("AccessToken", data.token);
          return true;
        } else {
          return false;
        }
      })
      .catch((error) => {
        return false;
      });
    return result;
  };

  const getData = async () => {
    getUser()
      .then((data) => {
        const result = data.result;
        if (result) {
          setUserId(result.id);
          setUserName(result.nickname);
          setUserProfile(result.profile);
        } else {
          removeData;
        }
      })
      .catch((error) => {
        window.sessionStorage.removeItem("AccessToken");
        tryReLogin();
      });
  };

  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/success" element={<LoginSuccess />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/mypage/list" element={<InvitationList />} />
        <Route path="/view/:id" element={<View />} />
        <Route path="/chat/:id" element={<Chat />} />
        <Route path="/create/*" element={<Cover />} />
        <Route path="/chatbot/:id" element={<Chatbot />} />
        <Route path="/error" element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;
