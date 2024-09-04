import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./InvitationList.css";
import { getInvitationList, deleteInvitation } from "../api/getInvitationApi";
import useStore from "../store";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getGridImg } from "../util/get-grid-img";
import BackButton from "../components/Button/BackButton"

const CustomCalendar = (props) => {
  const formatDay = (_, date) => date.getDate(); // 날짜 형식을 변경하는 함수

  const dateList = props.dateList;
  const tileClassName = props.tileClassName;
  const onDateChange = props.onDateChange;
  const onMonthChange = props.onMonthChange;

  return (
    <div className="flex justify-center calendar-container">
      <Calendar
        calendarType="gregory"
        formatDay={formatDay}
        tileContent={({ date, view }) => {
          if (view !== "month") return null;

          const tempDate = new Date(date);
          tempDate.setDate(tempDate.getDate() + 1); // 이전일로 이���
          const dateString = tempDate.toISOString().split("T")[0];
          if (dateList.includes(dateString)) {
            return (
              <div style={{ position: "relative", height: "100%" }}>
                <div
                  style={{
                    position: "absolute",
                    bottom: 10, // 타일의 하단에 위치하도록 설정
                    left: "50%",
                    width: 6,
                    height: 6,
                    backgroundColor: "blue", // 파란색 점
                    borderRadius: "50%",
                    transform: "translateX(-50%)",
                  }}
                />
              </div>
            );
          }
        }}
        tileClassName={({ date, view }) => tileClassName({ date, view })}
        onClickDay={(date) => {
          onDateChange(date);
        }}
        onActiveStartDateChange={onMonthChange}
      />
    </div>
  );
};

const InvitationList = () => {
  const [invitationList, setInvitationList] = useState([]);
  const [inviterList, setInviterList] = useState([]);
  const [inviteeList, setInviteeList] = useState([]);
  const [invitationDateList, setInvitationDateList] = useState([]);
  const userId = useStore((state) => state.userId);
  const location = useLocation("state");
  const state = location.state;
  const [selectMenu, setSelectMenu] = useState("");
  const [selectedDate, setSelectedDate] = useState([null, null]); // selectedDate state 추가
  const [dateRange, setDateRange] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const nav = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dayOfWeek = date.toLocaleDateString("ko-KR", { weekday: "long" });
    return `${year}.${month}.${day} ${dayOfWeek}`;
  };

  const isExpired = (dateString) => {
    const date = new Date(dateString);
    const oneWeekLater = new Date(date);
    oneWeekLater.setDate(oneWeekLater.getDate() + 7);
    return new Date() > oneWeekLater;
  };

  const [clicked, setClicked] = useState(null);

  const clickHandler = (index) => {
    setClicked(index);
  };

  const unClickHandler = () => {
    setClicked(null);
  };

  const clickedExpired = (invitation, index) => {
    return (
      <div
        className={`invitation-container clicked-invitation grayscale`}
        key={index}
        onClick={() => unClickHandler()}
      >
        <div className="max-w-md mx-auto rounded-xl p-3 grid grid-cols-9">
          <img
            className="col-span-2 row-span-2 ml-2"
            src={`https://onesecondbucket.s3.ap-northeast-2.amazonaws.com/invitation/${invitation.invitationCode}`}
            alt={`초대장 이미지`}
          />
          <div className="col-span-6 row-span-2 ml-2 mr-2 pl-3">
            <div className="col-span-6 row-span-1 text-xl font-bold truncate">
              {invitation.title}
            </div>
            <div className="col-span-4 row-span-1 text-sm">
              {formatDate(invitation.confirmedDate)}
            </div>
            <div className="col-span-2 row-span-1 ml-2 pl-3 content-end text-right">
              <div className="text-sm">만료됨</div>
            </div>
          </div>
          <img className="col-span-1 row-span-2" src={getGridImg(0)}></img>
        </div>
      </div>
    );
  };

  const clickedUnExpired = (invitation, index, viewInvitationPage, deleteInvitationFunc) => {
    return (
      <div
        className={`invitation-container clicked-invitation`}
        key={index}
        onClick={() => unClickHandler()}
      >
        <div className="max-w-md mx-auto rounded-xl p-3 grid grid-cols-10">
          <img
            className="col-span-2 row-span-2 ml-4"
            src={`https://onesecondbucket.s3.ap-northeast-2.amazonaws.com/invitation/${invitation.invitationCode}`}
            alt={`초대장 이미지`}
          />
          <div className="col-span-6 row-span-2 ml-2 mr-2 pl-3">
            <div className="col-span-6 row-span-1 text-xl font-bold truncate">
              {invitation.title}
            </div>
            <div className="col-span-6 row-span-1 text-sm">
              {formatDate(invitation.confirmedDate)}
            </div>
          </div>
          <div className="flex justify-center items-center col-span-2 row-span-2 mr-4">
            <img
              className="col-span-1 h-12"
              src={getGridImg(1)}
              onClick={() => viewInvitationPage(invitation.invitationCode)}
            ></img>
            {userId === invitation.inviter ? (
              <img
                className="col-span-1 h-12"
                src={getGridImg(0)}
                onClick={() => deleteInvitationFunc(invitation.invitationCode)}
              ></img>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    );
  };

  const unClicked = (invitation, index) => {
    return (
      <div
        className={`invitation-container${isExpired(invitation.confirmedDate) ? " grayscale" : ""}`}
        key={index}
        onClick={() => clickHandler(index)}
      >
        <div className="max-w-md mx-auto rounded-xl p-3 grid grid-cols-8">
          <img
            className="col-span-2 row-span-2 ml-2"
            src={`https://onesecondbucket.s3.ap-northeast-2.amazonaws.com/invitation/${invitation.invitationCode}`}
            alt={`초대장 이미지`}
          />
          <div className="col-span-6 row-span-1 ml-2 mr-2 pl-3">
            <div className="text-xl font-bold truncate">{invitation.title}</div>
          </div>
          <div className="col-span-4 row-span-1 ml-2 pl-3">
            <div className="text-sm">{formatDate(invitation.confirmedDate)}</div>
          </div>
          <div className="col-span-2 row-span-1 ml-2 pl-3 content-end text-right">
            <div className="text-sm">{isExpired(invitation.confirmedDate) ? "만료됨" : ""}</div>
          </div>
        </div>
      </div>
    );
  };

  const noInvitationList = () => {
    return (
      <div className="flex justify-center invitation-container py-2">
        <div>초대장이 존재하지 않습니다.</div>
      </div>
    );
  };

  const viewInvitationPage = (invitationCode) => {
    nav(`/view/${invitationCode}`);
  };

  //모달이나 SweetAlert 띄워서 삭제할 건지 확인 절차 필요
  const deleteInvitationFunc = async (invitationCode) => {
    Swal.fire({
      title: "초대장을 삭제하시겠습니까?",
      html: `
      초대장은 한번 삭제 후 복구가 불가능합니다.
      `,
      showDenyButton: true,
      denyButtonText: "취소",
      confirmButtonText: "확인",
    }).then(async (result) => {
      //초대장 삭제 확인 버튼 클릭 시 초대장 삭제 후 초대장 리스트 및 캘린더 표시 리렌더링
      if (result.isConfirmed) {
        const data = await deleteInvitation(invitationCode);
        await getData();
      }
    });
  };

  const getData = async () => {
    const data = await getInvitationList();

    const invitationListData = data.data.slice().reverse();
    const invitationDateList = invitationListData.map((invitation) => invitation.confirmedDate);
    setInvitationDateList(invitationDateList);

    const selectedStartDate = selectedDate[0] ? new Date(selectedDate[0]) : null;
    const selectedEndDate = selectedDate[1] ? new Date(selectedDate[1]) : null;

    if (selectedStartDate !== null && selectedEndDate !== null) {
        selectedEndDate.setDate(selectedEndDate.getDate() + 1);
    }

    setInvitationList(
      invitationListData.filter((invitation) => {
        const confirmedDate = new Date(invitation.confirmedDate);
        if (selectedStartDate !== null && selectedEndDate !== null) {
          return confirmedDate >= selectedStartDate && confirmedDate < selectedEndDate;
        } else if (selectedStartDate !== null && selectedEndDate === null) {
          return confirmedDate.toDateString() === selectedStartDate.toDateString();
        }
        return true;
      })
    );
  }

  useEffect(() => {
    setInviterList(
      invitationList.filter((invitation) => invitation.inviter === userId)
    )
    
    setInviteeList(
      invitationList.filter((invitation) => invitation.inviter !== userId)
    )
  }, [invitationList])

  useEffect(() => {
    if(selectedDate[0] && selectedDate[1]) {
      const selectedDate1 = new Date(selectedDate[0]);
      const selectedDate2 = new Date(selectedDate[1]);
      selectedDate1.setDate(selectedDate1.getDate() + 1);
      selectedDate2.setDate(selectedDate2.getDate() + 1);
      setDateRange(
        selectedDate1.toISOString().split("T")[0].replace("-", ".") +
          " ~ " +
          selectedDate2.toISOString().split("T")[0].replace("-", ".")
      );
    } else if(selectedDate[0]) {
      const selectedDate2 = new Date(selectedDate[0]);
      selectedDate2.setDate(selectedDate2.getDate() + 1);
      setDateRange(
        selectedDate2.toISOString().split("T")[0].replace("-", ".") +
          " ~ " +
          selectedDate2.toISOString().split("T")[0].replace("-", ".")
      );
    } else {
      const currentDate = new Date(currentMonth);
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 2);
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
  
      setDateRange(
        startDate.toISOString().split("T")[0] + " ~ " + endDate.toISOString().split("T")[0]
      );
    }

    getData();
  }, [selectedDate]);

  // 달력 클릭 시 해당 날짜 반환

  useEffect(() => {
    getData();
    setSelectMenu(state);
  }, []);

  const onDateChange = (date) => {
    if((selectedDate[0] && selectedDate[1])) {
      if(selectedDate[0] <= date && selectedDate[1] >= date) {
        setSelectedDate([null, null]);
      } else {
        setSelectedDate([date, null]);
      }
    } else {
      if(!selectedDate[0]) {
        setSelectedDate([date, null]);
      } else {
        const newSelectedDate =
        selectedDate[0] < date ? [selectedDate[0], date] : [date, selectedDate[0]];
        setSelectedDate(newSelectedDate);
      }
    }
  }

  const onMonthChange = ({ activeStartDate }) => {
    setCurrentMonth(activeStartDate);
  };
  
  const isInRange = (date) => {
    if (!selectedDate[0] || !selectedDate[1]) return false;
    const [start, end] =
      selectedDate[0] < selectedDate[1] ? selectedDate : [selectedDate[1], selectedDate[0]];
    return date >= start && date <= end;
  };
  const isStart = (date) => {
    return selectedDate[0] && date.toDateString() === selectedDate[0].toDateString();
  };
  const isEnd = (date) => {
    return selectedDate[1] && date.toDateString() === selectedDate[1].toDateString();
  };
  const isOneDay = (date) => {
    return selectedDate[0] &&
    !selectedDate[1] && 
    date.toDateString() === selectedDate[0].toDateString();
  };

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      if (isOneDay(date)) return "selected-one";
      if (isStart(date)) return "selected-start";
      if (isEnd(date)) return "selected-end";
      if (isInRange(date)) return "selected-range";
      return "none-selected";
    }
    return null;
  }


  return (
    <div>
      <BackButton onClick={() => nav("/mypage")} />
      <div className="flex justify-center mx-4">
        <CustomCalendar
          dateList={invitationDateList}
          onDateChange={onDateChange} 
          onMonthChange={onMonthChange}
          tileClassName={tileClassName}
        />
      </div>
      <div className="mt-4">전체 기간을 조회하려면 선택한 날짜를 해제하세요</div>
      <div className="mt-4 flex justify-center items-center cursor-default">
        <div className="text-lg font-bold mr-2">조회기간 : </div>
        <div>{dateRange}</div>
      </div>
      <div className="invitation-button p-2 text-base mt-2">
        <button
          className={`border-r-2 border-gray-400 
            ${selectMenu === "all" ? "text-black font-bold" : "text-gray-400 hover:font-semibold"}`}
          onClick={() => setSelectMenu("all")}
        >
          &nbsp; 전체 &nbsp;
        </button>
        <button
          className={`border-r-2 border-gray-400 
            ${
              selectMenu === "inviter"
                ? "text-black font-bold"
                : "text-gray-400 hover:font-semibold"
            }`}
          onClick={() => setSelectMenu("inviter")}
        >
          &nbsp; 보낸 초대장 &nbsp;
        </button>
        <button
          className={`
            hover:font-semibold 
            ${
              selectMenu === "invitee"
                ? "text-black font-bold"
                : "text-gray-400 hover:font-semibold"
            }`}
          onClick={() => setSelectMenu("invitee")}
        >
          &nbsp; 받은 초대장 &nbsp;
        </button>
      </div>
      <div>
        {selectMenu === "all" ? (
          invitationList.map((invitation, index) =>
            clicked === index
              ? isExpired(invitation.confirmedDate)
                ? clickedExpired(invitation, index)
                : clickedUnExpired(invitation, index, viewInvitationPage, deleteInvitationFunc)
              : unClicked(invitation, index)
          )
        ) : (
          <></>
        )}
        {selectMenu === "inviter" ? (
          inviterList.map((invitation, index) =>
            clicked === index
              ? isExpired(invitation.confirmedDate)
                ? clickedExpired(invitation, index)
                : clickedUnExpired(invitation, index, viewInvitationPage, deleteInvitationFunc)
              : unClicked(invitation, index)
          )
        ) : (
          <></>
        )}
        {selectMenu === "invitee" ? (
          inviteeList.map((invitation, index) =>
            clicked === index
              ? isExpired(invitation.confirmedDate)
                ? clickedExpired(invitation, index)
                : clickedUnExpired(invitation, index, viewInvitationPage, deleteInvitationFunc)
              : unClicked(invitation, index)
          )
        ) : (
          <></>
        )}
        {(selectMenu === "all" && invitationList.length === 0) ||
        (selectMenu === "inviter" && inviterList.length === 0) ||
        (selectMenu === "invitee" && inviteeList.length === 0) ? (
          noInvitationList()
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default InvitationList;
