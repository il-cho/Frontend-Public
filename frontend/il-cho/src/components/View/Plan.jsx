import SemiHeader from "../SemiHeader";
import { useState, useEffect, useRef } from "react";
import { getSchedule, modifySchedule } from "../../api/getScheduleApi";
import { modifySchedulePrompt } from "../../api/getChatbotApi";
import { format, addDays, isWithinInterval } from "date-fns";
import { da, ko } from "date-fns/locale";
import Calendar from "react-calendar";
import "./Plan.css";
import useStore from "../../store";
import Button from "../Button";
import Modal from "../Modal";
import { useNavigate } from "react-router-dom";
import { getViewImage } from "../../util/get-view-img";
import { getChatUserInfo } from "../../api/getChatApi";
import { getUserProfile } from "../../util/get-user-img";

const Plan = ({ invitationId, inviter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [planData, setPlanData] = useState();
  const [fixed, setFixed] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateVote, setDateVote] = useState([]);
  const [viewMode, setViewMode] = useState(0);
  const [dateListData, setDateListData] = useState([]);
  const [userVoteData, setUserVoteData] = useState([]);
  const [voteAlert, setVoteAlert] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);
  const [votedUser, setVotedUser] = useState([]);
  const [selectedDate, setSelectedDate] = useState();

  const [votedUserInfo, setVotedUserInfo] = useState([]);

  const nav = useNavigate();
  const userId = useStore((state) => state.userId);
  const planRef = useRef(null);

  useEffect(() => {
    fetchUserInfo(); //투표자 정보 가져오기
  }, [selectedDate]);

  useEffect(() => {
    makeCalender();
  }, [planData]);

  // 미확정된 일정일때 달력 열어주는 기능
  const openDetail = () => {
    if (!isOpen) {
      handlerClick();
    }
    setIsOpen(!isOpen);
  };

  //달력 열리는 모션
  const handlerClick = () => {
    if (planRef.current) {
      planRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  //데이터 가져오는 로직
  const getPlanData = async () => {
    //console.log("its get Plan Data");
    getSchedule(invitationId)
      .then((result) => {
        //console.log(result);
        setData(result);
      })
      .catch((error) => {
        console.error("일정 조회 실패", error);
      });
  };

  //달력 기반 데이터 설정 --> 투표수와 투표자 재설정
  const makeCalender = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dates = [];
    let currentDate = start;

    while (currentDate <= end) {
      const formattedDate = format(currentDate, "yyyy-M-d", {
        locale: ko,
      });
      dates.push(`${formattedDate}`);
      currentDate = addDays(currentDate, 1);
    }

    calculateVotes(dates); //투표 수 확인
    fetchUserVoteData();
  };

  const fetchUserVoteData = () => {
    const userIndex = dateListData.findIndex((data) => Number(data.userId) === Number(userId));
    if (userIndex === -1) {
      // 해당 사용자가 없다면 새로 추가
      const newUser = { userId: Number(userId), dateList: [] };
      setUserVoteData(newUser);
    } else {
      setUserVoteData(dateListData[userIndex]);
    }
  };

  //투표 수 기반으로 정보 입력
  const calculateVotes = (dates) => {
    const votes = dates.map((date) => {
      const voteCount = dateListData.reduce((count, user) => {
        const userDateList = user.dateList || [];
        return count + (userDateList.includes(date) ? 1 : 0);
      }, 0);
      return { date, vote: voteCount };
    });
    setDateVote(votes);
  };

  //투표자 리스트 받기
  const userDateVotes = () => {
    let newVotedUser = [];
    dateListData.map((data) => {
      if (Array.isArray(data.dateList)) {
        data.dateList.map((date) => {
          const idx = newVotedUser.findIndex((d) => d.date === date);
          if (idx === -1) {
            newVotedUser.push({ date: date, users: [data.userId] });
          } else {
            newVotedUser[idx].users.push(data.userId);
          }
        });
      }
    });
    setVotedUser(newVotedUser);
  };

  //로그인 여부 확인
  const isLoggedIn = () => {
    if (userId !== "" && Number(userId) !== 0) {
      return true;
    }
    return false;
  };

  //최초 랜더링 시 데이터 가져오고, 로그인 여부 확인 ( 로그인 여부는 AccessToken으로만 할거라면 그냥 자체 구현하는게 맞음)
  useEffect(() => {
    getPlanData();
  }, []);

  const modifyNewSchedule = (updatedData) => {
    modifySchedule(invitationId, startDate, endDate, updatedData, planData.confirmed)
      .then((result) => {
        //console.log(result.result);
        setData(result.result);
      })
      .catch(() => {})
      .finally(() => {
        makeCalender();
      });
    modifySchedulePrompt(invitationId, startDate, endDate, updatedData, planData.confirmed);
  };

  // 데이터 가져오면 그걸로 바꿔주는 로직
  const setData = (result) => {
    setPlanData(result);
    setFixed(result.confirmed);
    setStartDate(result.startDate);
    setEndDate(result.endDate);
    setDateListData(result.possibleDate ? result.possibleDate : []);
  };

  //투표자 리스트 투표자 정보 변경 //보티드 유저가 투표자임 따라서 해당 부분을 그냥 달라고 하면 됨.
  const fetchUserInfo = async () => {
    const listIdx = votedUser.findIndex((data) => data.date == selectedDate);
    if (listIdx === -1) {
      setVotedUserInfo({ chatUserList: [] });
    } else {
      getChatUserInfo(votedUser[listIdx].users)
        .then((info) => {
          setVotedUserInfo(info);
        })
        .catch((error) => {
          console.error("Error fetching chat user info:", error);
          // nav("/error");
        });
    }
  };

  //Formatdate 로직
  const formatDay = (_, date) => date.getDate();

  //투표 수에 따라 색상 설정하는 로직
  const tileClassNameByVoteCount = ({ date, view }) => {
    if (view === "month") {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const maxVote = Math.max(...dateVote.map((d) => d.vote));
      if (isWithinInterval(date, { start, end })) {
        const dateStr = format(date, "yyyy-M-d", { locale: ko });
        if (selectedDate === dateStr) {
          return "date-select";
        }
        const voteData = dateVote.find((d) => d.date === dateStr);
        if (voteData) {
          const intensity = (voteData.vote / maxVote) * 100;
          if (intensity > 75) return "very-dark";
          if (intensity > 50) return "dark";
          if (intensity > 25) return "medium";
          return "light";
        }
      } else {
        return "disable";
      }
    }
    return null;
  };

  const tileClassNameByUserVote = ({ date, view }) => {
    if (view === "month") {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (isWithinInterval(date, { start, end })) {
        const dateStr = format(date, "yyyy-M-d", { locale: ko });
        const votedDate = userVoteData.dateList.includes(dateStr);
        if (votedDate) {
          return "dark";
        }
        return "light";
      } else {
        return "disable";
      }
    }
    return null;
  };

  const tileClassNameForConfirm = ({ date, view }) => {
    if (view === "month") {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (isWithinInterval(date, { start, end })) {
        if (isOneDay(date)) return "selected-one-red";
        if (isStart(date)) return "selected-start-red";
        if (isEnd(date)) return "selected-end-red";
        if (isInRange(date)) return "selected-range-red";
        if (dateRange[0] && dateRange[1]) return "";
        const dateStr = format(date, "yyyy-M-d", { locale: ko });
        const voteData = dateVote.find((d) => d.date === dateStr);
        const maxVote = Math.max(...dateVote.map((d) => d.vote));
        if (voteData) {
          const intensity = (voteData.vote / maxVote) * 100;
          if (intensity > 75) return "very-dark-vote";
          if (intensity > 50) return "dark-vote";
          if (intensity > 25) return "medium-vote";
          return "light-vote";
        }
      } else {
        return "disable";
      }
    }
    return null;
  };

  //날짜 눌렀을때
  const onDateClick = (day) => {
    const formattedDate = format(day, "yyyy-M-d");
    setSelectedDate(formattedDate);
    userDateVotes(); //투표자 리스트
  };

  const onDateSelectVote = (day) => {
    const formattedDate = format(day, "yyyy-M-d");
    // if (!isLoggedIn) {
    //   setVoteAlert(true);
    // } else {
    //   setVoteAlert(false);
    selectDay(formattedDate);
  };

  const completeVote = () => {
    let updatedData = [...dateListData];
    //console.log(userVoteData);
    const userIndex = updatedData.findIndex((data) => Number(data.userId) === Number(userId));
    if (userIndex === -1) {
      updatedData.push(userVoteData);
    } else {
      updatedData[userIndex] = { ...updatedData[userIndex], ...userVoteData };
    }
    // setDateListData(updatedData);
    modifyNewSchedule(updatedData);
  };

  const selectDay = (formattedDate) => {
    let updatedData = { ...userVoteData };

    const dateExists = updatedData.dateList.includes(formattedDate);
    const newDateList = dateExists
      ? updatedData.dateList.filter((d) => d !== formattedDate) // 이미 존재하면 삭제
      : [...updatedData.dateList, formattedDate]; // 존재하지 않으면 추가

    updatedData = { ...updatedData, dateList: newDateList };

    setUserVoteData(updatedData);
  };

  const onConfirmDateClick = (date) => {
    if (!dateRange[0] || (dateRange[0] && dateRange[1])) {
      // If no start date or both dates are selected, reset the date range
      setDateRange([date, null]);
    } else {
      // If start date is selected, set the end date
      const [start, end] = dateRange[0] < date ? [dateRange[0], date] : [date, dateRange[0]];
      setDateRange([start, end]);
    }
  };

  const isInRange = (date) => {
    if (!dateRange[0] || !dateRange[1]) return false;
    const [start, end] = dateRange[0] < dateRange[1] ? dateRange : [dateRange[1], dateRange[0]];
    return date >= start && date <= end;
  };

  const isStart = (date) => dateRange[0] && date.toDateString() === dateRange[0].toDateString();
  const isEnd = (date) => dateRange[1] && date.toDateString() === dateRange[1].toDateString();
  const isOneDay = (date) =>
    dateRange[0] &&
    dateRange[1] &&
    dateRange[0].toDateString() === dateRange[1].toDateString() &&
    date.toDateString() === dateRange[0].toDateString();

  const confirmedSchedule = () => {
    //console.log("is confirmedSchedult");
    setViewMode(0);
    modifySchedule(invitationId, dateRange[0], dateRange[1], dateListData, true)
      .then((result) => {
        //console.log(result.result);
        setData(result.result);
        setIsOpen(false);
      })
      .catch(() => {})
      .finally(() => {
        makeCalender();
      });
    modifySchedulePrompt(invitationId, startDate, endDate, updatedData, planData.confirmed);
  };

  return (
    <div>
      <div ref={planRef} className="flex flex-col">
        <div
          className={`flex justify-between ${fixed ? "cursor-default" : "cursor-pointer"}`}
          onClick={fixed ? "" : openDetail}
        >
          <SemiHeader
            title={"일정"}
            content={`${fixed ? "" : "참석 가능한 시간을 확인/선택 해주세요"}`}
            type={"VIEW"}
          />
          <div className={`${fixed ? "hidden" : "block"}`}>
            {isOpen ? (
              <img className="w-8 h-8 mt-4" src={getViewImage("arrowUp")} />
            ) : (
              <img className="w-8 h-8 mt-4" src={getViewImage("arrowDown")} />
            )}
          </div>
        </div>
        {fixed ? (
          <div className="text-gray-500 ">
            {startDate === endDate ? (
              <div>{format(startDate, "yyyy-M-d")}</div>
            ) : (
              <div>
                {format(startDate, "yyyy")}년 {format(startDate, "M")}월 {format(startDate, "d")}일
                {format(startDate, "(EEE)", { locale: ko })} ~ {format(endDate, "yyyy")}년{" "}
                {format(endDate, "M")}월 {format(endDate, "d")}일
                {format(endDate, "(EEE)", { locale: ko })}
              </div>
            )}
          </div>
        ) : (
          <></>
        )}
      </div>
      <div style={{ display: isOpen ? "block" : "none" }}>
        <div className="flex flex-col">
          <div className="flex flex-col items-center mt-4">
            <Calendar
              calendarType="gregory"
              formatDay={formatDay}
              tileClassName={
                viewMode === 0
                  ? tileClassNameByVoteCount
                  : viewMode === 1
                  ? tileClassNameByUserVote
                  : tileClassNameForConfirm
              }
              onClickDay={
                viewMode === 0
                  ? onDateClick
                  : viewMode === 1
                  ? onDateSelectVote
                  : onConfirmDateClick
              }
            />
          </div>
          <div
            style={{ display: voteAlert ? "block" : "none" }}
            className="text-red-500 pl-5 text-sm "
          >
            투표는 로그인 후에 가능합니다.
          </div>
          <div className="flex font-bold justify-between">
            {viewMode === 0 ? (
              <Button
                text={"투표하기"}
                type="BLUE"
                onClick={() => {
                  if (isLoggedIn()) {
                    setViewMode(1);
                  } else {
                    setVoteAlert(true);
                  }
                }}
              />
            ) : viewMode === 1 ? (
              <Button
                text={"완료하기"}
                type="BLUE"
                onClick={() => {
                  setViewMode(0);
                  completeVote();
                }}
              />
            ) : (
              <Button
                text={"취소하기"}
                type="BLUE"
                onClick={() => {
                  setViewMode(0);
                  setDateRange([null, null]);
                }}
              />
            )}
            {Number(inviter) === Number(userId) && viewMode === 0 ? (
              <Button
                text={"일정 확정하기"}
                type="BLUE"
                onClick={() => {
                  setViewMode(2);
                }}
              />
            ) : viewMode === 2 ? (
              <Button
                text={"확정하기"}
                type="BLUE"
                onClick={() => {
                  confirmedSchedule();
                }}
              />
            ) : (
              ""
            )}
          </div>
          {selectedDate && votedUserInfo && votedUserInfo.chatUserList ? (
            <div className="px-5 pt-3">
              <div className="font-bold">
                투표수: {Object.entries(votedUserInfo.chatUserList).length}
              </div>
              <div className="flex">
                {Object.entries(votedUserInfo.chatUserList).map(([key, users]) => (
                  <div key={key} className="flex items-center mx-1">
                    <img className="w-4 h-4" src={getUserProfile(Number(users[1]))} />
                    <div className="ml-1">{users[0]}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Plan;
