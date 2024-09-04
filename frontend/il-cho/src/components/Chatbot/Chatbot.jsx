import SemiHeader from "../../components/SemiHeader";
import { getButtonImage } from "../../util/get-button-icon";
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { getGeminiIcon } from "../../util/get-gemini-icon";
import SyncLoader from "react-spinners/SyncLoader";
import { chatbot } from "../../api/getChatbotApi";

const Chatbot = () => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const { id: invitationCode } = useParams();
  const [wating, setWating] = useState(false);

  const messageBoxRef = useRef(null);

  const scrollToBottom = () => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages([
      {
        sender: "챗봇",
        content: "안녕하세요 초대장 챗봇입니다. \n 궁금한 점이 있으면 물어봐주세요",
      },
    ]);
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const onSend = async () => {
    //빈칸 일 경우 질문하지 않음
    if (inputValue === "") {
      return;
    }
    const newMessages1 = [...messages];

    const prompt = inputValue;

    setInputValue("");

    newMessages1.push({ sender: "나", content: prompt });

    setMessages(newMessages1);

    //챗봇 대답 이미지
    setWating(true);

    const newMessages2 = [...newMessages1];

    try {
      //챗봇 대답 대기
      const data = await chatbot(invitationCode, prompt);

      //챗봇 대답 이미지
      setWating(false);
      newMessages2.push({ sender: "챗봇", content: data.answer });
      setMessages(newMessages2);
    } catch (error) {
      //챗봇 대답 실패시
      setWating(false);
      newMessages2.push({
        sender: "챗봇",
        content: "죄송합니다.\n질문을 처리하는 과정에서 오류가 발생했습니다.",
      });
      setMessages(newMessages2);
    }
  };
  const activeEnter = (e) => {
    if (e.key === "Enter") {
      onSend(); // Trigger send when Enter key is pressed
    }
  };

  return (
    <div className="px-3">
      <div>
        <div className="flex justify-center">
          <div>
            <SemiHeader title={"챗봇"} />
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full">
        <div
          className="overflow-auto"
          style={{ height: "30rem", scrollbarWidth: "none" }}
          ref={messageBoxRef}
        >
          {messages.length > 0 ? (
            messages.map((chat, index) => (
              <div
                className={`flex ${chat.sender === "챗봇" ? "justify-start" : "justify-end"}`}
                key={index}
              >
                <div className="flex flex-col mb-2">
                  {/* 챗봇 사람 구별해서 사진 추가 */}
                  {/* <img src=""></img> */}
                  <div className="flex items-center text-lg">
                    {chat.sender === "챗봇" ? (
                      <img className="w-5 h-5 mr-1" src={getGeminiIcon()} alt="챗봇 이미지" />
                    ) : (
                      <></>
                    )}
                    {chat.sender === "챗봇" ? chat.sender : <></>}
                  </div>

                  <div
                    className={`p-2 rounded-lg max-w-xs ${
                      chat.sender !== "챗봇" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                    }`}
                  >
                    {chat.content.split("\n").map((line, index) => (
                      <span key={index}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <></>
          )}
          <div className="mt-2">
            {wating ? (
              <SyncLoader size={8} speedMultiplier="0.6" color="#C4C4C4"></SyncLoader>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="relative mt-5">
          <div className="flex w-full items-center">
            <input
              type="text"
              maxLength="50"
              className="border-2 rounded-lg border-gray-200 w-full h-10 px-3"
              value={inputValue}
              onChange={handleInputChange}
              onKeyUp={activeEnter}
              id="message"
            />
            <img
              className="h-8 m-1 cursor-pointer"
              src={getButtonImage("up")}
              onClick={onSend} // Send message on button click
              alt="send"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
