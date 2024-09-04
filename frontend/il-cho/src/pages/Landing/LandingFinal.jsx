import "./LandingFinal.css";
import Button from "../../components/Button";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

const LandingFinal = ({ onNextPage }) => {
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const final = gsap.timeline({
      scrollTrigger: {
        scroller: "#root",
        trigger: ".landing",
        start: "5750px bottom",
        end: "5900px 75%",
        scrub: 0.5,
      },
    });

    final
      .fromTo(".landing-final-title", { opacity: 0, y: 30 }, { opacity: 1, y: 0 })
      .fromTo(
        ".landing-final-button",
        { opacity: 0, x: 500 },
        { opacity: 1, x: 0, ease: "bounce.out" }
      );
  });

  return (
    <div className="landing-final">
      <div className="landing-final-title">저희 서비스 즐길 준비됐나요?</div>
      <div className="flex justify-center mt-6 mb-20">
        {/* <Button text={"초대장 생성하러 가기"} type={"Fill_None_Big"} /> */}
        <button className="landing-final-button" onClick={onNextPage}>
          초대장 생성하러 가기
        </button>
      </div>
    </div>
  );
};

export default LandingFinal;
