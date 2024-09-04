import Chatbot from "../../components/Chatbot/Chatbot";
import BackButton from "../../components/Button/BackButton";
import { useParams, useNavigate } from "react-router-dom";

const ChatbotPage = () => {
  const params = useParams();
  const invitationCode = params.id;
  const nav = useNavigate();

  return (
    <>
      <div className="float-left">
        <BackButton onClick={() => nav(`/view/${invitationCode}`)} />
      </div>
      <Chatbot></Chatbot>
    </>
  );
};

export default ChatbotPage;
