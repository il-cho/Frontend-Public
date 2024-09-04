import { useState } from "react";
import Calendar from "react-calendar";
import { format, addDays } from "date-fns";
// import "react-calendar/dist/Calendar.css";
import "./CalendarStyle.css";
import useStore from "../../store";

const CustomCalendar = () => {
  // const [dateRange, setDateRange] = useState([null, null]);
  const dateRange = useStore((state) => state.dateRange);
  const setDateRange = useStore((state) => state.setDateRange);

  const onDateClick = (date) => {
    if (!dateRange[0] || (dateRange[0] && dateRange[1])) {
      // If no start date or both dates are selected, reset the date range
      setDateRange([date, null]);
    } else {
      // If start date is selected, set the end date
      const [start, end] =
        dateRange[0] < date ? [dateRange[0], date] : [date, dateRange[0]];
      setDateRange([start, end]);
    }
  };

  const isInRange = (date) => {
    if (!dateRange[0] || !dateRange[1]) return false;
    const [start, end] =
      dateRange[0] < dateRange[1] ? dateRange : [dateRange[1], dateRange[0]];
    return date >= start && date <= end;
  };

  const isStart = (date) =>
    dateRange[0] && date.toDateString() === dateRange[0].toDateString();
  const isEnd = (date) =>
    dateRange[1] && date.toDateString() === dateRange[1].toDateString();
  const isOneDay = (date) =>
    dateRange[0] &&
    dateRange[1] &&
    dateRange[0].toDateString() === dateRange[1].toDateString() &&
    date.toDateString() === dateRange[0].toDateString();

  const formatDay = (_, date) => date.getDate(); // 날짜 형식을 변경하는 함수

  const beforeToday = (date) => {
    const today = new Date();
    return date < addDays(today, -1);
  };

  return (
    <div className="flex justify-center calendar-container">
      <Calendar
        calendarType="gregory"
        formatDay={formatDay}
        onClickDay={onDateClick}
        tileClassName={({ date, view }) => {
          if (view !== "month") return null;
          if (beforeToday(date)) return "before-today";
          if (isOneDay(date)) return "selected-one";
          if (isStart(date)) return "selected-start";
          if (isEnd(date)) return "selected-end";
          if (isInRange(date)) return "selected-range";
          return null;
        }}
      />
    </div>
  );
};

export default CustomCalendar;
