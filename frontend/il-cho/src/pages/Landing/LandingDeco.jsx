import "./LandingDeco.css";
import { getLandingImg } from "../../util/get-landing-img";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

const LandingDeco = () => {
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    const decoTitle = gsap.timeline({
      scrollTrigger: {
        scroller: "#root",
        trigger: ".landing",
        start: "2300px bottom",
        end: "2450px 75%",
        scrub: 0.5,
      },
    });

    decoTitle
      .fromTo(".landing-deco-title", { x: -50, opacity: 0 }, { x: 0, opacity: 1 })
      .fromTo(".landing-deco-text", { x: -50, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.3 });

    const decoSub = gsap.timeline({
      scrollTrigger: {
        scroller: "#root",
        trigger: ".landing",
        start: "2380px bottom",
        end: "2430px 75%",
        scrub: 0.5,
      },
    });

    decoSub
      .fromTo(".landing-deco-cover", { opacity: 0, y: -500 }, { opacity: 1, y: 0 })
      .fromTo(".landing-deco-font", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1 })
      .fromTo(
        ".landing-deco-sticker",
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, stagger: 0.5 }
      );
  });

  return (
    <div className="landing-deco">
      <div className="landing-deco-title">초대장 꾸미기</div>
      <div className="landing-deco-content-box">
        <div className="landing-deco-description">
          <div className="landing-deco-text">예쁜 글씨체</div>
          <div className="landing-deco-text">귀여운 스티커까지 제공해요!</div>
        </div>
      </div>

      <div className="landing-deco-main-img">
        <img src={getLandingImg("cover")} className="landing-deco-cover" />
        <img
          src={getLandingImg("sticker1")}
          className="landing-deco-sticker landing-deco-sticker-1"
        />
        <div className="landing-deco-font">나만의 초대장</div>
        <img
          src={getLandingImg("sticker2")}
          className="landing-deco-sticker landing-deco-sticker-2"
        />
      </div>
    </div>
  );
};

export default LandingDeco;
