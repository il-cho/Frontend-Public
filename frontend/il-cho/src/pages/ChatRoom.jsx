import SemiHeader from "../components/SemiHeader";
import BackButton from "../components/Button/BackButton";
import { getButtonImage } from "../util/get-button-icon";
import { useNavigate, useParams } from "react-router-dom";
import useStore from "../store";
import { useEffect, useRef, useState } from "react";
import axios from "axios"; // Assuming axios is used for API calls
import { getUserProfile } from "../util/get-user-img";
import { useInView } from "react-intersection-observer";
import { tr } from "date-fns/locale";
import { format, parseISO } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

const ChatRoom = () => {
  const nav = useNavigate();
  const { id: invitationCode } = useParams(); // Get the invitation code from useParams
  const userId = useStore((state) => state.userId);
  const socket = useRef(null); // WebSocket client ref
  const [messages, setMessages] = useState([]); // State to store chat messages
  const [participants, setParticipants] = useState([]); // State to store participants
  const [inputValue, setInputValue] = useState(""); // State to store the input value
  const [isMounted, setIsMounted] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  // const [chatId, setChatId] = useState("66b42d7247ce6b35596feb05");
  const messageBoxRef = useRef(null);

  const scrollToBottom = () => {
    if (messageBoxRef.current && !isFetching) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 무한 스크롤
  const [ref, inView] = useInView();
  const [prevHeight, setPrevHeight] = useState(0);

  useEffect(() => {
    if (inView && isMounted && !isFetching && messages.length > 0) {
      // console.log(inView, "특정 영역 도달");
      setPrevHeight(messageBoxRef?.current.scrollHeight || 0);
      fetchChatHistory(messages[0].chatId);
    }
  }, [inView]);

  useEffect(() => {
    if (prevHeight > 0 && messageBoxRef.current && !isFetching) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight - prevHeight;
    }
  }, [prevHeight, isFetching]);

  // Fetch chat history from the server
  const fetchChatHistory = async (chatId) => {
    if (isFetching) return;
    try {
      setIsFetching(true);
      const response = await axios.get(
        `https://sample/api/chat/history?invitationCode=${invitationCode}&chatId=${chatId}`
      );
      const chatHistory = response.data;
      setMessages((prevMessages) => [...chatHistory, ...prevMessages]);
    } catch (error) {
      console.error("Failed to fetch chat history:", error);
    } finally {
      setIsFetching(false);
    }
  };

  // Fetch participants from the server
  const fetchParticipants = async () => {
    try {
      const response = await axios.get(`https://sample/api/chat/userinfo/${invitationCode}`);
      const participantList = response.data;
      setParticipants(participantList); // Save the participant list to state
    } catch (error) {
      console.error("Failed to fetch participant list:", error);
    }
  };

  useEffect(() => {
    fetchChatHistory(); // Load chat history on component mount
    fetchParticipants(); // Load participant list on component mount

    const socketUrl = `wss://sample/ws/${invitationCode}`; // WebSocket URL
    socket.current = new WebSocket(socketUrl);

    socket.current.onopen = () => {
      //console.log("Connected to WebSocket server.");
    };

    socket.current.onmessage = (event) => {
      const chatResponse = JSON.parse(event.data);
      //console.log("Received message: ", chatResponse);
      setMessages((prevMessages) => [...prevMessages, chatResponse]); // Add the new message to the state
    };

    socket.current.onclose = () => {
      //console.log("Disconnected from WebSocket server.");
    };

    socket.current.onerror = (error) => {
      console.error("WebSocket error: ", error);
    };
    setIsMounted(true);
    return () => {
      if (socket.current) {
        socket.current.close();
      }
    };
  }, [invitationCode]); // Dependency array to re-run when invitationCode changes

  const onSend = () => {
    if (
      socket.current &&
      socket.current.readyState === WebSocket.OPEN &&
      inputValue.trim() !== ""
    ) {
      const messageContent = {
        invitationCode: invitationCode,
        senderId: userId,
        content: inputValue,
      };
      socket.current.send(JSON.stringify(messageContent)); // Send the message through the WebSocket
      setInputValue(""); // Clear the input field after sending
    } else {
      console.error("WebSocket is not open. Cannot send message.");
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const activeEnter = (e) => {
    if (e.key === "Enter") {
      onSend(); // Trigger send when Enter key is pressed
    }
  };

  return (
    <div className="px-3">
      <div className="">
        <div className="float-left mb-5">
          <BackButton onClick={() => nav(`/view/${invitationCode}`)} />
        </div>
        {/* <div className="flex justify-center">
          <div>
            <SemiHeader title={"채팅방"} />
          </div>
        </div> */}
      </div>
      <div className="flex flex-col w-full">
        <div
          className="overflow-auto"
          style={{ height: "30rem", scrollbarWidth: "none" }}
          ref={messageBoxRef}
        >
          {/* Display participants
          <div className="bg-gray-100 my-3 mx-2 rounded-lg p-2 sticky top-0">
            <div className=" flex">
              <div className="font-bold pr-1">참여자</div>
              <div
                className="flex overflow-x-auto"
                style={{ scrollbarWidth: "none" }}
              >
                {participants.length > 0 ? (
                  participants.map((participant, index) => (
                    <div className="px-1" key={index}>
                      {participant.username}
                    </div>
                  ))
                ) : (
                  <div>참여자 정보를 불러오는 중...</div>
                )}
              </div>
            </div>
          </div> */}
          {/* Display chat messages */}
          <div ref={ref}></div>
          {messages.length > 0 ? (
            messages.map((chat, index) => (
              <div
                key={index}
                className={`flex ${
                  chat.senderId === Number(userId) ? "justify-end" : "justify-start"
                }`}
              >
                <div className="flex flex-col mb-2">
                  <div className="flex">
                    {chat.senderId === Number(userId) ? (
                      <></>
                    ) : (
                      <img
                        src={getUserProfile(
                          participants.filter(
                            (participant) => participant.userId === Number(chat.senderId)
                          )[0]?.profile || 0
                        )}
                        className="w-5 h-5 mr-1"
                      />
                    )}
                    <div className="font-bold">
                      {chat.senderId === Number(userId) ? (
                        <></>
                      ) : (
                        participants.filter(
                          (participant) => participant.userId === Number(chat.senderId)
                        )[0]?.username || "Unknown User"
                      )}
                    </div>
                  </div>
                  <div
                    className={`flex items-end ${
                      chat.senderId === Number(userId) ? "flex-row" : "flex-row-reverse"
                    }`}
                  >
                    <div className="text-gray-400 text-sm mx-1">
                      {chat.createAt.split("T")[1].substring(0, 5)}
                    </div>
                    {/* <div className="text-gray-400 text-sm mx-1">
                      {formatInTimeZone(
                        parseISO(chat.createAt),
                        "Asia/Seoul",
                        "H:m"
                      )}
                    </div> */}
                    <div
                      className={`px-3 py-1.5 rounded-3xl max-w-xs ${
                        chat.senderId === Number(userId)
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-black"
                      }`}
                      style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}
                    >
                      {chat.content}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div>
              <></>
            </div>
          )}
        </div>
        <div className="relative">
          <div className="flex w-full items-center">
            <input
              type="text"
              maxLength="50"
              autoComplete="off"
              className="border-2 pr-10 rounded-3xl border-gray-200 bg-gray-100 w-full h-10 px-3 focus:outline-none"
              value={inputValue}
              onChange={handleInputChange}
              onKeyUp={activeEnter}
              id="message"
            />
            <img
              className="absolute h-8 m-1 cursor-pointer right-1"
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

export default ChatRoom;
