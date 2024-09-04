import SemiHeader from "../SemiHeader";
import Button from "../Button";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "../Modal";
import { useState } from "react";

const Chat = () => {
  const nav = useNavigate();
  const { id: invitationCode } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // const openModal = setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const gotoChat = () => {
    const accessToken = sessionStorage.getItem("AccessToken");
    if (!accessToken || accessToken === "undefined") {
      setIsModalOpen(true);
    } else {
      nav(`/chat/${invitationCode}`);
    }
  };

  const goLogin = () => {
    sessionStorage.setItem("redirection", `/chat/${invitationCode}`);
    nav("/login");
  };

  return (
    <div className="flex justify-between">
      <SemiHeader title={"채팅"} content={"간단한 대화를 주고 받을 수 있는 방"} type={"VIEW"} />
      <Button text="입장하기" type={"BLUE"} onClick={gotoChat} />
      <Modal isOpen={isModalOpen} closeModal={closeModal}>
        <div className="flex flex-col pb-4">
          <div className="py-4">로그인 후 입장 가능합니다</div>
          <Button text={"로그인"} type={"BLUE"} onClick={goLogin} />
        </div>
      </Modal>
    </div>
  );
};
export default Chat;
