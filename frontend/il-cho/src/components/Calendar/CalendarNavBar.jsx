import { useState } from "react";

const CalendarNavBar = () => {

  return (
    <div className="flex items-center justify-around border-2 border-solid border-gray-300 mx-4 my-2 rounded-md">
      <div className="text-gray-400 text-sm">초대 일정을 입력해주세요</div>
      <p className="text-2xl">아이콘</p>
    </div>
  );
};

export default CalendarNavBar;
