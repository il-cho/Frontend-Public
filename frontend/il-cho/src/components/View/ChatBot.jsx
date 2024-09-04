import SemiHeader from "../SemiHeader";
import Button from "../Button";
import { useNavigate, useParams } from "react-router-dom";

const ChatBot = () => {
  const nav = useNavigate();
  const { id: invitationCode } = useParams();

  const gotoChatBot = () => {
    nav(`/chatbot/${invitationCode}`);
  };

  return (
    <div className="flex justify-between">
      <SemiHeader
        title={"챗봇"}
        content={"챗봇에게 초대장에 대한 질문을 해보세요"}
        type={"VIEW"}
      />
      <Button text="질문하기" type={"BLUE"} onClick={gotoChatBot} />
    </div>
  );
};

export default ChatBot;
