import CheckBox from "../../components/Button/CheckBox";
import Calendar from "../../components/Calendar/Calendar";
import CalendarNavBar from "../../components/Calendar/CalendarNavBar";
import Button from "../../components/Button";
import SemiHeader from "../../components/SemiHeader";
import { useNavigate } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import "./CalendarStyle.css";
import { createSchedule } from "../../api/getScheduleApi";
import useStore from "../../store";
import { modifyInvitationFeature } from "../../api/getInvitationApi";
import BackButton from "../../components/Button/BackButton";
import { modifySchedulePrompt } from "../../api/getChatbotApi";
import { Toaster, toast } from "react-hot-toast";

const CalendarPage = () => {
  const nav = useNavigate();

  const [isFixed, setIsFixed] = useState(false);
  const [alert, setAlert] = useState(false);

  const dateRange = useStore((state) => state.dateRange);
  const setDateRange = useStore((state) => state.setDateRange);
  // const invitationId = useStore((state) => state.invitationCode);
  const invitationId = localStorage.getItem("invitationCode");
  //건너뛰기 버튼 클릭 함수
  const skip = () => {
    nav("/create/place");
  };

  //일정 저장 함수
  const addSchedule = () => {
    if (!dateRange[0]) {
      setAlert(true);
      toast("일정을 선택해주세요.", {
        icon: "📅",
        duration: 1500,
      })
      return;
    } else {
      try {
        modifyInvitationFeature(invitationId, "schedule", true);
        if (!dateRange[1]) {
          createSchedule(invitationId, dateRange[0], dateRange[0], !isFixed);
          modifySchedulePrompt(
            invitationId,
            dateRange[0],
            dateRange[0],
            null,
            !isFixed
          );
        } else {
          createSchedule(invitationId, dateRange[0], dateRange[1], !isFixed);
          modifySchedulePrompt(
            invitationId,
            dateRange[0],
            dateRange[1],
            null,
            !isFixed
          );
        }
        localStorage.setItem("lastPage", "/create/calendar");
        nav("/create/place");
      } catch (error) {
        sessionStorage.setItem("redirection", "/cover/place");
        nav("/error", { state: "일정 생성 중에 오류가 발생했어요." });
      }
    }
  };

  return (
    <>
      <BackButton onClick={() => nav("/create/preview")} />
      <SemiHeader
        title={"일정"}
        content={"초대 날짜 / 조정하고자 하는 기간을 선택해주세요."}
      />
      {/* <CalendarNavBar /> */}
      <Calendar />
      {/* <div className="text-center text-sm text-gray-400 my-2">
        초대장은 확정된 일정 날짜 7일 후 만료됩니다.
      </div> */}
      {alert ? (
        // <div className="text-red-500 text-sm cursor-default">
        // 일정을 선택해주세요.
        <Toaster
          toastOptions={{
            style: {
              color: 'red',
            },
          }}
          containerStyle={{
            top: '45%', // 상단에서 약간 내려오도록 설정
            position: 'absolute', // 'absolute'로 위치를 지정하여 카드 위에 배치
            zIndex: 10000, // zIndex를 높여서 카드 위에 위치하게 함
          }}
        />
        // </div>

      ) : (
        <></>
      )}
      <div className="flex px-5 my-6">
        <label className="inline-flex cursor-pointer mt-1">
          <input
            id="default-checkbox"
            type="checkbox"
            value={
              localStorage.getItem("fixed")
                ? Boolean(localStorage.getItem("fixed"))
                : ""
            }
            // checked={isFixed}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            onChange={() => setIsFixed(!isFixed)}
          />
        </label>
        <div className="flex flex-col mx-2 text-gray-700">
          <div className="font-semibold">일정 투표 받기</div>
          <div className="text-xs text-pretty">
            참석자들이 참석 가능한 날짜를 선택할 수 있습니다.
          </div>
        </div>
      </div>
      <div className="flex justify-end mx-4">
        {/* <Button type={"GRAY"} text={"기능 건너뛰기"} onClick={skip} /> */}
        <Button type={"BLUE"} text={"기능 추가"} onClick={addSchedule} />
      </div>
    </>
  );
};

export default CalendarPage;
