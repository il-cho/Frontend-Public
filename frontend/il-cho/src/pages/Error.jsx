import { getEmoji } from "../util/get-emoji";
import Button from "../components/Button";
import { useLocation, useNavigate } from "react-router-dom";

const Error = () => {
  const location = useLocation("state");
  const state = location.state;
  const nav = useNavigate();
  const redirection = sessionStorage.getItem("redirection");

  return (
    <div className="flex flex-col items-center mt-24">
      <div className="mb-8 text-4xl text-red-600 font-bold">ERROR</div>
      <img src={getEmoji(12)} className="w-1/2" />
      <div className="mt-8 mb-5 text-xl text-gray-600 font-bold">
        {state ? state : "무언가 잘못되었어요!"}
      </div>
      {/* <Button
        text={"메인으로 돌아가기"}
        type={"BLUE"}
        onClick={() => nav("/")}
      /> */}
      <Button
        text={"되돌아가기"}
        type={"BLUE"}
        onClick={() => nav(`${redirection ? redirection : "/"}`)}
      />
    </div>
  );
};
export default Error;
