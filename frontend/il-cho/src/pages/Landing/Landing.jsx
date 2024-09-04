import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import "./Landing.css";

import { getCoverImage } from "../../util/get-cover-img";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectCards, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import "swiper/css/effect-cards";

import { useState, useRef } from "react";
import { Cookies } from "react-cookie";
import useStore from "../../store";
import { RxDoubleArrowDown } from "react-icons/rx";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { Ripple, initTWE } from "tw-elements";

initTWE({ Ripple });

import LandingIntroduction from "./LandingIntroDesc";
import LandingThema from "./LandingThema";
import LandingDeco from "./LandingDeco";
import LandingSchedule from "./LandingSchedule";
import LandingPlace from "./LandingPlace";
import LandingAccount from "./LandingAccount";
import LandingChat from "./LandingChat";
import { getLandingImg } from "../../util/get-landing-img";
import LandingChatbot from "./LandingChatbot";
import LandingFinal from "./LandingFinal";
import { el } from "date-fns/locale";

import Modal from "../../components/Modal";

const Landing = () => {
  const nav = useNavigate();
  const landingBox = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const closeModal = (shouldClear = false) => {
    if (shouldClear) {
      localStorage.clear();
      setDateRange([]);
      nav("/create/image");
    }
    setIsModalOpen(false);
  };
  const handleConfirm = () => {
    if (confirmAction) confirmAction();
    closeModal();
  };

  const goQNA = () => {
    window.open("https://forms.gle/f3m76cv5Kbfsezhe8");
  };
  const cookies = new Cookies();
  const setUserId = useStore((state) => state.setUserId);
  const setUserName = useStore((state) => state.setUserName);
  const setUserProfile = useStore((state) => state.setUserProfile);
  const setDateRange = useStore((state) => state.setDateRange);
  const removeCookie = (name) => {
    return cookies.remove(name);
  };

  const onNextPage = () => {
    let AccessToken = window.sessionStorage.getItem("AccessToken");
    if (
      AccessToken &&
      AccessToken !== null &&
      AccessToken !== undefined &&
      AccessToken != "null" &&
      AccessToken != "undefined"
    ) {
      const lastPage = localStorage.getItem("lastPage");
      if (lastPage) {
        //console.log(lastPage);
        setConfirmAction(() => () => {
          nav(lastPage);
        });
        setIsModalOpen(true);
        // if (confirm("만드시던 페이지로 이동하시겠습니까?")) {
        //   nav(lastPage);
        // } else {
        //   localStorage.clear();
        //   setDateRange([]);
        //   nav("/create/image");
        // }
      } else {
        localStorage.clear();
        setDateRange([]);
        nav("/create/image");
      }
    } else {
      window.sessionStorage.removeItem("AccessToken");
      removeCookie("RefreshToken");
      setUserId("");
      setUserName("");
      setUserProfile(0);
      sessionStorage.setItem("redirection", "/create/image");
      nav("/login");
    }
  };

  const themas = [
    {
      id: 3,
      themaName: "테마 3",
    },
    {
      id: 4,
      themaName: "테마 4",
    },
    {
      id: 5,
      themaName: "테마 5",
    },
    {
      id: 6,
      themaName: "테마 6",
    },
    {
      id: 7,
      themaName: "테마 7",
    },
    {
      id: 8,
      themaName: "테마 8",
    },
    {
      id: 9,
      themaName: "테마 9",
    },
  ];
  const [curThemaName, setCurThemaName] = useState(themas[0].themaName);
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const scroll = gsap.timeline({
      scrollTrigger: {
        scroller: "#root",
        trigger: ".landing",
        start: "750px bottom",
        end: "800px 75%",
        scrub: 0.5,
      },
    });
    scroll.fromTo(".landing-intro-scroll", { opacity: 1 }, { opacity: 0 });
  });

  const scrollToTop = () => {
    if (landingBox.current) {
      landingBox.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <section className="landing" ref={landingBox}>
        <div className="landing-intro relative">
          <div className="landing-intro-top">
            <div className="landing-intro-title">
              <div className="landing-title-up">
                <span className="landing-title-1">일</span>
                <span className="landing-title-2">상</span>
                <span className="landing-title-3">으</span>
                <span className="landing-title-4">로</span>
              </div>
              <div className="landing-title-bottom">
                <span className="landing-title-5">초</span>
                <span className="landing-title-6">대</span>
              </div>
            </div>
            <div className="landing-intro-buttonzone">
              {/* <div className="mt-3">
                <button
                  type="button"
                  data-twe-ripple-init
                  data-twe-ripple-color="dark"
                  className="inline-block rounded bg-neutral-200 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-neutral-700 shadow-md transition duration-150 ease-in-out hover:bg-neutral-300 hover:shadow-lg focus:bg-neutral-300 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-neutral-400 active:shadow-lg"
                  onClick={onNextPage}
                >
                  초대장 생성하기
                </button>
              </div>
              <div className="mt-3">
                <button
                  type="button"
                  data-twe-ripple-init
                  data-twe-ripple-color="dark"
                  className="inline-block rounded bg-neutral-200 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-neutral-700 shadow-md transition duration-150 ease-in-out hover:bg-neutral-300 hover:shadow-lg focus:bg-neutral-300 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-neutral-400 active:shadow-lg"
                  onClick={onNextPage}
                >
                  문의하기
                </button>
              </div> */}
              <div>
                <Button
                  text={"초대장 생성하기"}
                  type={"Fill_Blue_Hover"}
                  onClick={onNextPage}
                ></Button>
              </div>
              <div className="mt-3">
                <Button text={"문의하기"} type={"Fill_Blue_Hover"} onClick={goQNA}></Button>
              </div>
            </div>
          </div>
          {/* <div className="swiper-container">
            <div
              style={{
                fontSize: "1.3rem",
                fontWeight: "700",
                margin: "1.1rem 0",
              }}
            >
              실시간 인기 테마
            </div>
            <Swiper
              effect={"cards"}
              grabCursor={true}
              modules={[EffectCards, Navigation, Autoplay]}
              style={{ width: "80%", height: "200px" }}
              navigation
              loop={true}
              loopAdditionalSlides={1} // 추가 슬라이드 수 설정
              slidesPerView={1} // 한 번에 한 슬라이드만 보이도록 설정
              onSlideChange={(e) => {
                setCurThemaName(themas[e.realIndex].themaName);
              }}
              // autoplay={{
                //   delay: 1800,
                //   disableOnInteraction: false,
                //   pauseOnMouseEnter: true,
                // }}
                >
                {themas
                .filter((thema) => thema.id >= 3 && thema.id <= 9)
                .map((thema) => (
                  <SwiperSlide key={thema.id} style={{ borderRadius: "0.5rem" }}>
                  <img src={getCoverImage(thema.id)} />
                  </SwiperSlide>
                  ))}
                  </Swiper>
                  </div> */}

          <a
            href="#header"
            // className="fixed z-50 right-14 bottom-20 w-7 bg-gray-200 rounded"
            className="landing-arrow-up"
          >
            {" "}
            <img src={getLandingImg("arrowUp")} />{" "}
          </a>

          <div className="landing-intro-scroll">
            <div>일초 기능 살펴보기</div>
            <div>스크롤을 내려주세요.</div>
            <RxDoubleArrowDown size={25} />
          </div>
        </div>
        <div className="landing-container">
          <div className="landing-intro-desc-container">
            <LandingIntroduction />
          </div>
        </div>
        <div className="landing-container">
          <LandingThema />
        </div>
        <div className="landing-container">
          <LandingDeco />
        </div>
        <div className="landing-container">
          <LandingSchedule />
        </div>
        <div className="landing-container">
          <LandingPlace />
        </div>
        <div className="landing-container">
          <LandingAccount />
        </div>
        <div className="landing-container">
          <LandingChat />
        </div>
        <div className="landing-container">
          <LandingChatbot />
        </div>
        <div className="landing-container">
          <LandingFinal onNextPage={onNextPage} />
        </div>
      </section>
      <Modal isOpen={isModalOpen} closeModal={closeModal}>
        <div className="flex flex-col justify-cneter items-center">
          <div className="font-bold text-xl my-2">진행중인 초대장이 있습니다</div>
          <div className="text-md">만드시던 페이지로 이동하시겠습니까?</div>
          <div className="flex justify-between my-4 w-2/3 items-center">
            <Button text={"아니오"} onClick={() => closeModal(true)} />
            <Button text={"예"} onClick={handleConfirm} type={"BLUE"} />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Landing;
