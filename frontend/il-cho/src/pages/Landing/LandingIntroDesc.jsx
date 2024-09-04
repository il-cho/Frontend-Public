import "./LandingIntroDesc.css";
import { getLandingImg } from "../../util/get-landing-img";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

const LandingIntroduction = () => {
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const introDesc = gsap.timeline({
      scrollTrigger: {
        scroller: "#root",
        trigger: ".landing",
        start: "900px bottom",
        end: "1250px 75%",
        scrub: 0.5,
      },
    });

    introDesc
      .fromTo(".landing-intro-desc-title", { opacity: 0, y: 30 }, { opacity: 1, y: 0 })
      .fromTo(
        ".landing-intro-desc-content",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.5 }
      );
  });

  return (
    <div className="landing-intro-desc-container">
      {/* <div className="landing-intro-desc-title">
        <span className="landing-intro-desc-il">일</span>초는 어떤 서비스인가요?
      </div>
      <img src={getLandingImg("question")} className="landing-intro-desc-question" /> */}
      <div className="landing-intro-desc-title text-gray-500">나만의 초대장을 만드는 서비스</div>
      <div className="landing-intro-desc-content text-5xl">
        <div className="text-black font-bold">일</div>
        <div className="text-blue-500 font-bold">초</div>
      </div>
      <div className="landing-intro-desc-content text-gray-500">
        편리한 일정 조율 서비스 제공을 넘어
      </div>
      <div className="landing-intro-desc-content text-gray-500">
        모든 일상의 초대를 특별하게 만드는 것이
      </div>
      <div className="landing-intro-desc-content text-gray-500">저희의 목표입니다</div>

      <div className="landing-intro-desc-content text-gray-500 my-56">
        지금부터 저희 서비스가 가진 <br />
        여러 기능들을 소개합니다.
      </div>
    </div>
  );
};

export default LandingIntroduction;
