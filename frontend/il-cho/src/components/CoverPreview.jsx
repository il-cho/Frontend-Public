import SemiHeader from "./SemiHeader";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { getAccessToken } from "../auth/Token";
import useStore from "../store";
import BackButton from "./Button/BackButton";
import { createInvitationPrompt } from "../api/getChatbotApi";

const CoverPreview = () => {
  const coverImage = localStorage.getItem("coverImage");
  const coverContent = localStorage.getItem("coverContent");
  const title = localStorage.getItem("coverTitle");
  const nav = useNavigate();
  // let dispatch = useDispatch();
  const setInvitationCode = useStore((state) => state.setInvitationCode);

  const userId = useStore((state) => state.userId);
  //console.log("생성자 -> ", userId);

  const handleSubmit = async (e) => {
    const response = await fetch(coverImage);
    const blob = await response.blob();

    const formData = new FormData();
    formData.append("file", blob, "image.png");
    const input = {
      inviter: userId,
      title: title,
      description: coverContent,
    };

    // JSON 데이터를 Blob으로 변환
    const inputBlob = new Blob([JSON.stringify(input)], {
      type: "application/json",
    });

    formData.append("input", inputBlob);

    try {
      const accessToken = await getAccessToken();

      const response = await axios.post("https://sample/api/invitation", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `${accessToken}`, // 필요 시 Access Token 추가
          // loginId: "id",
        },
      });
      setInvitationCode(response.data.invitationCode);

      //챗봇 초대장 정보 저장
      createInvitationPrompt(response.data.invitationCode, title, coverContent, userId);

      localStorage.setItem("invitationCode", response.data.invitationCode);
      //console.log("초대장 생성 성공:", response.data);
    } catch (error) {
      console.error("초대장 생성 실패:", error);
    }
  };

  const nextPage = async () => {
    await getInvitationCode().then((invitationCode) => {
      //console.log(invitationCode);
      if (!invitationCode) {
        try {
          handleSubmit();
          localStorage.setItem("lastPage", "/create/preview");
          nav("/create/calendar");
        } catch (e) {
          //console.log("초대장 생성 오류 ", e);
          sessionStorage.setItem("redirection", "/cover/preview");
          nav("/error");
        }
      } else {
        localStorage.setItem("lastPage", "/create/preview");
        nav("/create/calendar");
      }
    });
  };

  const getInvitationCode = async () => {
    return window.localStorage.getItem("invitationCode");
  };

  return (
    <div>
      <BackButton onClick={() => nav("/create/content")} />
      <SemiHeader title="초대장 미리보기" content="만들어진 초대장을 확인하고 기능을 추가하세요." />
      <div className="flex flex-col items-center">
        <img className="w-80" src={coverImage} />
        {coverContent ? (
          <div
            className="w-72 p-3 my-4 shadow border-2 border-solid rounded-lg"
            style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}
          >
            {coverContent}
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="float-right mr-5">
        <Button text="일정 추가" type={"BLUE"} onClick={nextPage} />
      </div>
    </div>
  );
};

export default CoverPreview;
