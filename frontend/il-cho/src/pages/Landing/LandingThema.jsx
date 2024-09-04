import "./LandingThema.css";
import { useGSAP } from "@gsap/react";
import { getLandingImg } from "../../util/get-landing-img";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

const LandingThema = () => {
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const thema = gsap.timeline({
      scrollTrigger: {
        scroller: "#root",
        trigger: ".landing",
        start: "1700px bottom",
        end: "1930px 75%",
        scrub: 0.5,
      },
    });

    thema
      .fromTo(".landing-thema-title", { opacity: 0, y: 30 }, { opacity: 1, y: 0 })
      .fromTo(".landing-thema-description", { opacity: 0, y: 30 }, { opacity: 1, y: 0 })
      .fromTo(".landing-thema-img", { scale: 0, opacity: 0 }, { scale: 1.2, opacity: 1 })
      .to(".landing-thema-img", { scale: 1 });

    const themaFade = gsap.timeline({
      scrollTrigger: {
        scroller: "#root",
        trigger: ".landing",
        start: "2150px bottom",
        end: "2200px 75%",
        scrub: 0.5,
      },
    });
    themaFade.fromTo(".landing-thema-img", { opacity: 1 }, { opacity: 0 });
  });

  return (
    <div className="landing-thema">
      <div className="landing-thema-title">나만의 테마 제공</div>
      <div className="landing-thema-description">내가 원하는 디자인으로, 나만의 초대장을</div>
      <div className="landing-thema-img">
        <img src={getLandingImg("cover")} />
      </div>
    </div>
  );
};

export default LandingThema;
