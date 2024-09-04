import { getLandingImg } from "../../util/get-landing-img";
import "./LandingSchedule.css";
import { FaCheck } from "react-icons/fa";
import { FaRegCalendarCheck } from "react-icons/fa6";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

const LandingSchedule = () => {
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    const scheduleText = gsap.timeline({
      scrollTrigger: {
        scroller: "#root",
        trigger: ".landing",
        start: "2750px bottom",
        end: "2950px 75%",
        scrub: 0.5,
      },
    });

    scheduleText
      .fromTo(".landing-schedule-title", { x: -50, opacity: 0 }, { x: 0, opacity: 1 })
      .fromTo(
        ".landing-schedule-description",
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.5 }
      );

    const scheduleImg = gsap.timeline({
      scrollTrigger: {
        scroller: "#root",
        trigger: ".landing",
        start: "2750px bottom",
        end: "2950px 75%",
        scrub: 0.5,
      },
    });

    scheduleImg.fromTo(
      ".landing-schedule-main-img",
      { opacity: 0, y: -150 },
      { opacity: 1, y: 0, x: 0, ease: "bounce.out" }
    );
  });

  return (
    <div className="landing-schedule">
      <div className="landing-schedule-text-container">
        <div className="landing-schedule-title">일정 확인</div>
        <div className="landing-schedule-content-box">
          <div className="landing-schedule-description">기간을 설정하고</div>
          {/* <FaCheck className="landing-schedule-sub-icon" /> */}
        </div>
        <div className="landing-schedule-content-box">
          <div className="landing-schedule-description">투표 기능 추가하여</div>
          {/* <FaCheck className="landing-schedule-sub-icon" fill="rgb(52, 214, 52)" /> */}
        </div>
        <div className="landing-schedule-content-box">
          <div className="landing-schedule-description">친구들에게 공유하세요</div>
          {/* <FaRegCalendarCheck className="landing-schedule-sub-icon" /> */}
        </div>
      </div>
      <div className="landing-schedule-main-img">
        <img src={getLandingImg("schedule")} />
      </div>
    </div>
  );
};

export default LandingSchedule;
