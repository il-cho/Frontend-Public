import SemiHeader from "../SemiHeader";
import Button from "../Button";
import Modal from "../Modal";
import { getViewImage } from "../../util/get-view-img";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAttend, attendInvitation, getParticipantList } from "../../api/getInvitationApi";
import { getUserProfile } from "../../util/get-user-img";
import useStore from "../../store.js";

const Attend = () => {
  const { userId, userName, userProfile } = useStore((state) => ({
    userId: state.userId,
    userName: state.userName,
    userProfile: state.userProfile,
  }));

  const [isChecked, setIsChecked] = useState(false);
  const [initialChecked, setInitialChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isAttendList, setAttendList] = useState([]);
  const [isNotAttendList, setNotAttendList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const params = useParams();
  const nav = useNavigate();

  const timeoutRef = useRef(null);
  const lastStatusRef = useRef(isChecked);

  const currentUser = {
    username: userName,
    profile: userProfile,
    attend: false,
    paid: false,
    userId: userId,
  };

  useEffect(() => {
    const fetchAttendStatus = async () => {
      try {
        const attendStatus = await getAttend(params.id);
        if (attendStatus === true || attendStatus === false) {
          setIsChecked(attendStatus);
          setInitialChecked(attendStatus);
          lastStatusRef.current = attendStatus;
        } else {
          // null이면 false로 초기화
          await attendInvitation(params.id, false);
        }
      } catch (error) {
        console.error("참석 여부 조회 중 오류 발생", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendStatus();
    fetchParticipantList();
  }, [params.id]);

  useEffect(() => {
    if (!isChecked) {
      setIsOpen(false);
    }
  }, [isChecked]);

  const fetchParticipantList = async () => {
    // console.log("Fetching participant list for ID:", params.id); // 디버깅용 로그
    await getParticipantList(params.id)
      .then((result) => {
        // console.log("참가자 목록 조회 결과 -> ", result); // 디버깅용 로그
        setData(result.data);
      })
      .catch((error) => {
        console.error("참가자 목록 조회 중 오류 발생", error);
      });
  };

  const setData = (data) => {
    const attendList = data.filter((user) => {
      return user.attend;
    });
    const notAttendList = data.filter((user) => {
      return !user.attend;
    });
    // console.log(attendList); // 디버깅용 로그
    setAttendList(attendList);
    setNotAttendList(notAttendList);
    // console.log(isAttendList); // 디버깅용 로그
  };

  const changeCheck = async () => {
    const accessToken = sessionStorage.getItem("AccessToken");
    if (!accessToken || accessToken === "undefined") {
      setIsModalOpen(true);
      return;
    }

    const newStatus = !isChecked;
    setIsChecked(newStatus);

    // 참가자 목록을 즉각적으로 업데이트
    updateParticipantList(newStatus);

    if (timeoutRef.current) {
      // 이전 타이머가 있다면 취소
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      // 새로운 타이머 설정
      if (newStatus !== lastStatusRef.current) {
        try {
          await attendInvitation(params.id, newStatus);
          // await fetchParticipantList();
          //console.log(`api 요청 날림 ${newStatus}`);
          lastStatusRef.current = newStatus;
        } catch (error) {
          console.error("참석 여부 업데이트 중 오류 발생", error);
        }
      }
    }, 3000);
  };

  const updateParticipantList = (newStatus) => {
    if (newStatus) {
      // 참석 리스트에 추가하고, 불참 리스트에서 제거
      setAttendList((prev) => [...prev, currentUser]);
      setNotAttendList((prev) => prev.filter((user) => user.username !== currentUser.username));
    } else {
      // 불참 리스트에 추가하고, 참석 리스트에서 제거
      setNotAttendList((prev) => [...prev, currentUser]);
      setAttendList((prev) => prev.filter((user) => user.username !== currentUser.username));
    }
  };

  const closeModal = () => setIsModalOpen(false);

  const goLogin = () => {
    sessionStorage.setItem("redirection", `/view/${params.id}`);
    nav("/login");
  };

  return (
    <div>
      <div className="flex justify-between cursor-default">
        <SemiHeader title={"참석 여부"} content={""} type={"VIEW"} />
        <div className="flex justify-between items-end">
          <label className="inline-flex items-end cursor-pointer">
            <span className={`mx-3 font-semibold ${isChecked ? "text-green-500" : "text-red-500"}`}>
              {isChecked ? "참석" : "불참"}
            </span>
            <input
              type="checkbox"
              value=""
              className="sr-only peer"
              checked={isChecked}
              onChange={changeCheck}
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
      {/* {isChecked ? */}
      <div className="mt-3 divide-y divide-gray-100 rounded-md shadow-base bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="font-medium text-base ml-2">참석자</div>
        <div className="flex">
          {isAttendList && isAttendList.length > 0 ? (
            isAttendList.map((user, index) => {
              return (
                <div key={index} className="mx-1 h-6 flex items-center">
                  <img
                    src={getUserProfile(user.profile)}
                    alt={`${user.username}'s profile`}
                    className="mx-1 w-4 h-4 rounded-full"
                  />
                  <span className="font-medium text-sm">{user.username}</span>
                </div>
              );
            })
          ) : (
            <span className="ml-2 text-gray-500">참석자가 없습니다.</span>
          )}
        </div>
        <div className="font-medium text-base ml-2">불참자</div>
        <div className="flex">
          {isNotAttendList && isNotAttendList.length > 0 ? (
            isNotAttendList.map((user, index) => {
              return (
                <div key={index} className="mx-1 h-6 flex items-center">
                  <img
                    src={getUserProfile(user.profile)}
                    alt={`${user.username}'s profile`}
                    className="mx-1 w-4 h-4 rounded-full"
                  />
                  <span className="font-medium text-sm">{user.username}</span>
                </div>
              );
            })
          ) : (
            <span className="ml-2 text-gray-500">불참자가 없습니다.</span>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} closeModal={closeModal}>
        <div className="flex flex-col pb-4">
          <div className="py-4">로그인 후 이 기능을 사용할 수 있습니다.</div>
          <Button text={"로그인"} type={"BLUE"} onClick={goLogin} />
        </div>
      </Modal>
    </div>
  );
};
export default Attend;
