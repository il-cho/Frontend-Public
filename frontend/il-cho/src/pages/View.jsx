import Plan from "../components/View/Plan";
import Location from "../components/View/Location";
import Chat from "../components/View/Chat";
import ChatBot from "../components/View/ChatBot";
import Attend from "../components/View/Attend";
import Account from "../components/View/Account";
import Button from "../components/Button";
import Modal from "../components/Modal";
import { useNavigate, useParams } from "react-router-dom";
import { getInvitation } from "../api/getInvitationApi";
import { useState, useEffect } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { getShareImage } from "../util/get-share-img";
import { getEmoji } from "../util/get-emoji";
import useStore from "../store";
import { Toaster, toast } from "react-hot-toast";
import { deleteInvitation } from "../api/getInvitationApi";

const View = () => {
  const params = useParams();
  const nav = useNavigate();
  const [coverTitle, setCoverTitle] = useState("");
  const [coverContent, setCoverContent] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inviter, setInviter] = useState();
  const [showPlan, setShowPlan] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [showChatBot, setShowChatBot] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  const toasterId = "view-toaster"; // Toaster ID 설정

  // const [showAttend, setShowAttend] = useState(false);

  const userId = useStore((state) => state.userId);
  // const userId = "1";

  const openModal = () => {
    setIsLocationOpen(false);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  const getData = async () => {
    try {
      const result = await getInvitation(params.id);
      //console.log(result);
      //console.log(result.info);
      //console.log(result.feature);
      setCoverTitle(result.info.title);
      setCoverContent(result.info.description);
      setInviter(result.info.inviter);
      setShowPlan(result.feature.schedule);
      setShowLocation(result.feature.place);
      setShowAccount(result.feature.account);
      // setShowChat(result.feature.chat);
      setShowChatBot(result.feature.chatbot);
    } catch (error) {
      console.error("초대장 조회 실패", error);
      goErrorPage("찾을 수 없는 초대장입니다.");
    }
  };

  const goErrorPage = (msg) => {
    //console.log(msg);
    nav("/error", { state: msg });
  };

  useEffect(() => {
    getData();
  }, []);

  const kakaoShare = () => {
    //console.log(coverTitle);
    //console.log(coverContent);
    Kakao.Share.sendCustom({
      templateId: 110794,
      templateArgs: {
        THU: `https://onesecondbucket.s3.ap-northeast-2.amazonaws.com/invitation/${params.id}`,
        TITLE: coverTitle,
        DESC: coverContent,
        LINK: `view/${params.id}`,
      },
    });
  };

  const instaShare = () => {
    const urlToShare = encodeURIComponent(`https://sample/view/${params.id}`);
    const textToShare = encodeURIComponent(coverTitle);

    const instagramUrl = `https://www.instagram.com/create/story/?text=${textToShare}&url=${urlToShare}`;

    window.location.href = instagramUrl;
  };

  const deleteInvitationHandle = async () => {
    await deleteInvitation(params.id);
    nav("/mypage");
  };

  return (
    <div>
      <div className="flex flex-col items-center">
        <img
          className=""
          src={`https://onesecondbucket.s3.ap-northeast-2.amazonaws.com/invitation/${params.id}`}
        />
        {coverContent ? (
          <div
            className="w-11/12 p-3 my-4 shadow border-2 border-solid rounded-lg"
            style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}
          >
            {coverContent}
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="px-3">
        {showPlan ? <Plan invitationId={params.id} inviter={inviter} /> : <></>}
        {showLocation ? (
          <Location
            invitationId={params.id}
            inviter={inviter}
            isOpen={isLocationOpen}
            setIsOpen={setIsLocationOpen}
          />
        ) : (
          <></>
        )}

        {showAccount ? <Account /> : <></>}
        {/* {showChat ? <Chat /> : <></>} */}
        <Chat />
        <ChatBot />
        {/* {showAttend ? <Attend />: <></>} */}
        <Attend />
        <Toaster
          position="bottom-center"
          reverseOrder={false}
          containerStyle={{
            bottom: 50,
          }}
        />
      </div>
      <div className="px-3 mt-5 mb-6 flex flex-row-reverse justify-between">
        <Button text={"공유하기"} type={"Fill_None"} onClick={openModal} />
        <Modal isOpen={isModalOpen} closeModal={closeModal}>
          <div className="flex flex-col items-center my-3">
            <div className="my-3 text-3xl font-bold text-slate-600">공유하기</div>
            <img className="w-1/2" src={getEmoji(11)} />
            <div className="flex items-center mx-2">
              <input
                type="text"
                className="url w-48 my-2 text-center bg-white rounded-md border-2 border-slate-200"
                disabled
                placeholder={`${window.location.origin}/view/${params.id}`}
              />
              <CopyToClipboard
                className="bg-slate-400 h-6 w-6 rounded-md flex justify-center items-center"
                text={`${window.location.origin}/view/${params.id}`}
                onCopy={() =>
                  toast("클립보드에 복사되었습니다.", {
                    icon: "📎",
                    duration: 1500,
                    id: toasterId,
                  })
                }
              >
                <button className="">
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
            </div>
          </div>
        </Modal>
        {userId === inviter ? (
          <div>
            {/* <Button text={"수 정"} type={"Fill_modify"} /> */}
            <Button text={"삭 제"} type={"Fill_delete"} onClick={deleteInvitationHandle} />
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default View;
