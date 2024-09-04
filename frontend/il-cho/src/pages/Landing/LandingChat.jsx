import "./LandingChat.css";
import { getLandingImg } from "../../util/get-landing-img";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

const LandingChat = () => {
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const chatBubble = gsap.timeline({
      scrollTrigger: {
        scroller: "#root",
        trigger: ".landing",
        start: "4650px bottom",
        end: "5000px 75%",
        scrub: 0.5,
      },
    });

    chatBubble
      .fromTo(".landing-chat-title", { opacity: 0, y: 30 }, { opacity: 1, y: 0 })
      .fromTo(".landing-chat-speech-bubble", { opacity: 0 }, { opacity: 1 })
      .to(".landing-chat-speech-bubble-group-1", {
        backgroundColor: "#3B82F6",
        borderRadius: "50",
        right: 0,
        xPercent: 0,
      })
      .to(".landing-chat-speech-bubble-group-2", {
        backgroundColor: "#F3F4F6",
        borderRadius: "50",
        left: 3,
        xPercent: 0,
      });

    const chatRoom = gsap.timeline({
      scrollTrigger: {
        scroller: "#root",
        trigger: ".landing",
        start: "4630px bottom",
        end: "5000px 75%",
        scrub: 0.5,
      },
    });
    chatRoom
      .fromTo(
        ".landing-chat-room-background",
        { background: "#FFFFFF" },
        { backgroundColor: "#FFFFFF", border: "solid 1px #E4E4E4" }
      )
      .fromTo(".landing-chat-input", { opacity: 0, y: -30 }, { opacity: 1, y: 0 })
      .to(".landing-chat-room-background", { scale: 0.8, xPercent: 40 })
      .fromTo(
        ".landing-chat-description",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.2 }
      );
  });

  return (
    <div className="landing-chat">
      <div className="landing-chat-title">채팅</div>
      <div className="landing-chat-body-container">
        <div className="landing-chat-description-container">
          <div className="landing-chat-description">실시간으로</div>
          <div className="landing-chat-description">소통하며</div>
          <div className="landing-chat-description">의견을 나누어요</div>
        </div>
        <div className="landing-chat-room-background">
          <div className="landing-chat-speech-bubble landing-chat-speech-bubble-group-1 landing-chat-speech-bubble-1"></div>
          <div className="landing-chat-speech-bubble landing-chat-speech-bubble-group-2 landing-chat-speech-bubble-2"></div>
          <div className="landing-chat-speech-bubble landing-chat-speech-bubble-group-1 landing-chat-speech-bubble-3"></div>
          <div className="landing-chat-speech-bubble landing-chat-speech-bubble-group-2 landing-chat-speech-bubble-4"></div>
          <div className="landing-chat-speech-bubble landing-chat-speech-bubble-group-1 landing-chat-speech-bubble-5"></div>
          <div className="landing-chat-speech-bubble landing-chat-speech-bubble-group-2 landing-chat-speech-bubble-6"></div>
          <input className="landing-chat-input disable" placeholder="   메시지 입력"></input>
        </div>
      </div>
    </div>
  );
};

export default LandingChat;
