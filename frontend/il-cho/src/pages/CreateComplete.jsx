import { useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
import { getInvitation } from "../api/getInvitationApi";
import useStore from "../store";
import { useEffect, useState } from "react";
import { getShareImage } from "../util/get-share-img";
import CopyToClipboard from "react-copy-to-clipboard";
import { getEnvelopeImg } from "../util/get-envelope-img";
import ConfettiExplosion from "react-confetti-explosion";
import { Toaster, toast } from "react-hot-toast";
import "./CreateComplete.css";

//variables for confetti

const bigExplodeProps = {
  force: 0.8,
  duration: 3000,
  particleCount: 250,
  colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
  zIndex: "40",
};

const confettiLeftSource = {
  position: "absolute",
  left: "40%",
  top: "50%",
  width: "100px",
  height: "100px",
};

const confettiRightSource = {
  position: "absolute",
  left: "50px",
  top: "50%",
  width: "100px",
  height: "100px",
};

const CreateComplete = () => {
  const [coverContent, setCoverContent] = useState("");
  const [coverTitle, setCoverTitle] = useState("");

  const coverImage = localStorage.getItem("coverImage");
  const nav = useNavigate();
  const invitationCode = localStorage.getItem("invitationCode");
  const [isExploding, setIsExploding] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [isContentUp, setIsContentUp] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const goViewPage = () => {
    localStorage.clear();
    nav(`/view/${invitationCode}`);
  };

  const rendering = () => {
    //console.log("rendering");
    setTimeout(() => {
      setIsOpen(true);
    }, 500);
    setTimeout(() => {
      setIsOpening(true);
    }, 1000);
    setTimeout(() => {
      setIsContentUp(true);
    }, 1500);
  };

  const getData = async () => {
    try {
      const result = await getInvitation(invitationCode);
      //console.log(result.info);
      setCoverTitle(result.info.title);
      setCoverContent(result.info.description);
    } catch (error) {
      console.error("초대장 조회 실패", error);
    }
  };

  rendering();
  // invitationId();

  const kakaoShare = () => {
    Kakao.Share.sendCustom({
      templateId: 110794,
      templateArgs: {
        THU: `https://onesecondbucket.s3.ap-northeast-2.amazonaws.com/invitation/${invitationCode}`,
        TITLE: coverTitle,
        DESC: coverContent,
        LINK: `view/${invitationCode}`,
      },
    });
  };

  const instaShare = () => {
    const urlToShare = encodeURIComponent(`https://il-cho.site/view/${invitationCode}`);
    const textToShare = encodeURIComponent(coverTitle);

    const instagramUrl = `https://www.instagram.com/create/story/?text=${textToShare}&url=${urlToShare}`;

    window.location.href = instagramUrl;
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative text-xl font-bold mb-4">초대장 생성이 완료되었습니다.</div>
      <div
        className="relative envelope"
        style={{ cursor: "pointer" }}
        onClick={() => {
          setIsExploding(!isExploding);
        }}
      >
        {isExploding && (
          <div style={confettiLeftSource}>
            <ConfettiExplosion {...bigExplodeProps} />
          </div>
        )}
        <img
          className={`absolute envelope-top ${isOpen ? "open " : ""}${
            isOpening ? "z-10 " : "z-40 "
          }w-60 ml-12 mt-32`}
          src={getEnvelopeImg("back")}
          alt=""
        />
        <img
          className={`absolute z-20 w-9/12 ml-10 mt-32 envelope-content ${
            isContentUp ? "open" : ""
          }`}
          src={coverImage}
          alt=""
        />
        <img className="relative z-30 h-52 mt-28" src={getEnvelopeImg("front")} alt="" />
      </div>
      <button className="rounded-lg bg-blue-700 text-white w-60 py-1" onClick={goViewPage}>
        입장하기
      </button>
      <div className="share-box flex flex-col items-center rounded-lg w-60 bg-slate-100 my-3 border-solid border-2 border-slate-200">
        <div className="my-3 font-bold text-slate-600">공유하기</div>
        <div className="link flex items-center">
          <input
            type="text"
            className="url w-48 my-2 text-center bg-white rounded-md border-2 border-slate-200"
            disabled
            placeholder={`${window.location.origin}/view/${invitationCode}`}
          />
          <CopyToClipboard
            className="bg-slate-500 h-6 w-6 rounded-md flex justify-center items-center"
            text={`${window.location.origin}/view/${invitationCode}`}
            onCopy={() =>
              toast("클립보드에 복사되었습니다.", {
                icon: "📎",
                duration: 1500,
              })
            }
          >
            <button className="bg-slate-500 h-6 w-6 rounded-md flex justify-center items-center">
              <img src={getShareImage("link")} className="w-8/12 " />
            </button>
          </CopyToClipboard>
        </div>
        <div className="flex my-2">
          <img
            src={getShareImage("kakao")}
            className="kakaotalk-sharing-btn mx-5 w-7 h-7"
            onClick={kakaoShare}
          />
          <img src={getShareImage("instagram")} className="mx-5 w-7 h-7" onClick={instaShare} />
          <Toaster
            position="bottom-center"
            reverseOrder={false}
            containerStyle={{
              bottom: 50,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateComplete;
