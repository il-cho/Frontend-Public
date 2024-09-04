import "./LandingPlace.css";
import { getLandingImg } from "../../util/get-landing-img";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

const LandingPlace = () => {
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const placeImg = gsap.timeline({
      scrollTrigger: {
        scroller: "#root",
        trigger: ".landing",
        start: "3100px bottom",
        end: "3400px 75%",
        scrub: 0.5,
      },
    });
    placeImg
      .fromTo(".landing-place-title", { opacity: 0, y: 30 }, { opacity: 1, y: 0 })
      .fromTo(".landing-place-map-img", { opacity: 0 }, { opacity: 1 });
    const markerGroup1 = gsap.timeline({
      scrollTrigger: {
        scroller: "#root",
        trigger: ".landing",
        start: "3250px bottom",
        end: "3450px 75%",
        scrub: 0.5,
      },
    });
    markerGroup1
      .fromTo(
        ".landing-place-marker-1",
        { y: -120, scale: 2, opacity: 0 },
        { y: 0, scale: 1, opacity: 1 }
      )
      .fromTo(
        ".landing-place-marker-3",
        { y: -110, scale: 2, opacity: 0 },
        { y: 0, scale: 1, opacity: 1 }
      );

    const markerGroup2 = gsap.timeline({
      scrollTrigger: {
        scroller: "#root",
        trigger: ".landing",
        start: "3280px bottom",
        end: "3450px 75%",
        scrub: 0.5,
      },
    });
    markerGroup2
      .fromTo(
        ".landing-place-marker-6",
        { y: -120, scale: 2, opacity: 0 },
        { y: 0, scale: 1, opacity: 1 }
      )
      .fromTo(
        ".landing-place-marker-2",
        { y: -180, scale: 2, opacity: 0 },
        { y: 0, scale: 1, opacity: 1 }
      );

    const markerGroup3 = gsap.timeline({
      scrollTrigger: {
        scroller: "#root",
        trigger: ".landing",
        start: "3300px bottom",
        end: "3450px 75%",
        scrub: 0.5,
      },
    });
    markerGroup3.fromTo(
      ".landing-place-marker-5",
      { y: -180, scale: 2, opacity: 0 },
      { y: 0, scale: 1, opacity: 1 }
    );
    const markerGroup4 = gsap.timeline({
      scrollTrigger: {
        scroller: "#root",
        trigger: ".landing",
        start: "3320px bottom",
        end: "3450px 75%",
        scrub: 0.5,
      },
    });
    markerGroup4.fromTo(
      ".landing-place-marker-4",
      { y: -300, scale: 2, opacity: 0 },
      { y: 0, scale: 1, opacity: 1 }
    );

    const placeText = gsap.timeline({
      scrollTrigger: {
        scroller: "#root",
        trigger: ".landing",
        start: "3450px bottom",
        end: "3470px 75%",
        scrub: 0.5,
      },
    });

    placeText.fromTo(
      ".landing-place-description",
      { y: 200, opacity: 0, scale: 1.5 },
      { y: 0, opacity: 1, scale: 1, stagger: 0.1 }
    );
  });

  return (
    <div className="landing-place">
      <div className="landing-place-title">장소 공유</div>
      <div className="landing-place-img">
        <img src={getLandingImg("place")} className="landing-place-map-img rounded-xl" />
        <img
          src={getLandingImg("marker1")}
          className="landing-place-marker landing-place-marker-1"
        />
        <img
          src={getLandingImg("marker2")}
          className="landing-place-marker landing-place-marker-2"
        />
        <img
          src={getLandingImg("marker1")}
          className="landing-place-marker landing-place-marker-3"
        />
        <img
          src={getLandingImg("marker2")}
          className="landing-place-marker landing-place-marker-4"
        />
        <img
          src={getLandingImg("marker1")}
          className="landing-place-marker landing-place-marker-5"
        />
        <img
          src={getLandingImg("marker2")}
          className="landing-place-marker landing-place-marker-6"
        />
      </div>
      <div className="landing-place-description">원하는 장소를 콕!</div>
      <div className="landing-place-description">만날 장소를 지도를 통해 공유해 보세요</div>
    </div>
  );
};

export default LandingPlace;
