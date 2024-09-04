import "./LandingChatbot.css";
import { getLandingImg } from "../../util/get-landing-img";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

const LandingChatbot = () => {
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const chatbotBubble = gsap.timeline({
      scrollTrigger: {
        scroller: "#root",
        trigger: ".landing",
        start: "5300px bottom",
        end: "5700px 75%",
        scrub: 0.5,
      },
    });

    chatbotBubble
      .fromTo(".landing-chatbot-title", { opacity: 0, y: 30 }, { opacity: 1, y: 0 })
      .fromTo(".landing-chatbot-speech-bubble", { opacity: 0 }, { opacity: 1 })
      .to(".landing-chatbot-speech-bubble-group-1", {
        backgroundColor: "#3B82F6",
        borderRadius: "50",
        right: 0,
        xPercent: 0,
      })
      .to(".landing-chatbot-speech-bubble-group-2", {
        backgroundColor: "#F3F4F6",
        borderRadius: "50",
        left: 3,
        xPercent: 0,
      });

    const chatbotRoom = gsap.timeline({
      scrollTrigger: {
        scroller: "#root",
        trigger: ".landing",
        start: "5500px bottom",
        end: "5700px 75%",
        scrub: 0.5,
      },
    });
    chatbotRoom
      .fromTo(
        ".landing-chatbot-room-background",
        { background: "#FFFFFF" },
        { backgroundColor: "#FFFFFF", border: "solid 1px #E4E4E4" }
      )
      .fromTo(".landing-chatbot-input", { opacity: 0, y: -30 }, { opacity: 1, y: 0 })
      .to(".landing-chatbot-room-background", { scale: 0.8, xPercent: -50 })
      .fromTo(
        ".landing-chatbot-description",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.2 }
      );
  });
  return (
    <div className="landing-chatbot">
      <div className="landing-chatbot-title">챗봇</div>
      <div className="landing-chatbot-body-container">
        <div className="landing-chatbot-description-container">
          <div className="landing-chatbot-description">일정이 궁금하면?</div>
          <div className="landing-chatbot-description">참여 인원이 궁금하면?</div>
          <div className="landing-chatbot-description">모두 챗봇에게 물어봐요!</div>
        </div>
        <div className="landing-chatbot-room-background">
          <div className="landing-chatbot-speech-bubble landing-chatbot-speech-bubble-group-1 landing-chatbot-speech-bubble-1"></div>
          <div className="landing-chatbot-speech-bubble landing-chatbot-speech-bubble-group-2 landing-chatbot-speech-bubble-2"></div>
          <div className="landing-chatbot-speech-bubble landing-chatbot-speech-bubble-group-1 landing-chatbot-speech-bubble-3"></div>
          <div className="landing-chatbot-speech-bubble landing-chatbot-speech-bubble-group-2 landing-chatbot-speech-bubble-4"></div>
          <div className="landing-chatbot-speech-bubble landing-chatbot-speech-bubble-group-1 landing-chatbot-speech-bubble-5"></div>
          <div className="landing-chatbot-speech-bubble landing-chatbot-speech-bubble-group-2 landing-chatbot-speech-bubble-6"></div>
          <input className="landing-chatbot-input disable" placeholder="   메시지 입력"></input>
        </div>
      </div>
    </div>
  );
};

export default LandingChatbot;
