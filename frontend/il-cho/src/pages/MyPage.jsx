import { useNavigate } from "react-router-dom";
import useStore from "../store";
import "./MyPage.css";
import { getInvitationList } from "../api/getInvitationApi";
import { useEffect, useState } from "react";
import Button from "../components/Button";
import { getMap } from "../api/getMapApi";
import { getUserProfile } from "../util/get-user-img";

const MyPage = () => {
  const [invitation, setInvitaiton] = useState("");
  const [countInviter, setCountInviter] = useState(0);
  const [countInvitee, setCountInvitee] = useState(0);
  const [placeInfo, setPlaceInfo] = useState("");
  const userId = useStore((state) => state.userId);

  const getNearInvitation = async () => {
    const data = await getInvitationList();
    const invitationList = data.data;

    // 오늘 날짜를 기준으로 이후 날짜의 초대장을 필터링
    const upcomingInvitations = invitationList.filter(invitation => {
      const confirmedDate = new Date(invitation.confirmedDate);
      const today = new Date();
      return confirmedDate >= today; // 오늘 이후의 초대장만 필터링
    });

    // 가장 가까운 초대장 없는 경우 예외 처리
    if (upcomingInvitations.length === 0) {
      setInvitaiton(null);
      setPlaceInfo(null);
      return;
    }

    // 가장 가까운 초대장 설정
    setInvitaiton(upcomingInvitations[0]);

    //초대장 분류
    const inviterList = invitationList.filter(
      (invitation) => invitation.inviter === userId
    );

    setCountInviter(inviterList.length);

    const inviteeList = invitationList.filter(
      (invitation) => invitation.inviter !== userId
    );
    setCountInvitee(inviteeList.length);

    //장소 조회
    const mapData = await getMap(invitationList[0].invitationCode);
    if (mapData.length > 0) {
      setPlaceInfo(mapData[0].placeInfo[0]);
    } else {
      setPlaceInfo(null);
    }
  };

  //초대장 늦게 반영되는거 확인해봐야됨
  useEffect(() => {
    if (userId) {
      getNearInvitation();
    }
  }, [userId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dayOfWeek = date.toLocaleDateString("ko-KR", { weekday: "long" });
    return `${year}.${month}.${day} ${dayOfWeek}`;
  };

  const nav = useNavigate();
  const userProfile = useStore((state) => state.userProfile);
  const userName = useStore((state) => state.userName);

  // const getInvitationData = async () => {
  //   try {
  //     const result = await getNearByInvitation();
  //     console.log(result);
  //     setInvitaiton(result.data);
  //   } catch (error) {
  //     console.error("초대장 조회 실패", error);
  //   }
  // };

  const nearByInvitation = (invitation) => {
    return (
      <div
        className="invitation-content grid grid-cols-2 grid-flow-row gab-1 mb-1 cursor-pointer hover:shadow-lg"
        onClick={() => viewNearInvitationPage()}
      >
        <img
          className="invitation-image rounded-xl"
          src={`https://onesecondbucket.s3.ap-northeast-2.amazonaws.com/invitation/${invitation.invitationCode}`}
        />
        <div className="invitation-text ml-1 p-1 place-items-center">
          <div className="event-date text-base font-bold mb-2">
            {formatDate(invitation.confirmedDate)}
          </div>
          <div className="event-location text-sm">
            {/* 장소 가져오기 */}
            <div className="text-center font-bold">
              {placeInfo === null
                ? "확정 장소가 없습니다."
                : placeInfo.placeName}
            </div>
            <div>{placeInfo !== null ? placeInfo.placeAddress : ""}</div>
          </div>
        </div>
      </div>
    );
  };

  //초대장 생성 페이지 이동
  const goCreatePage = () => {
    localStorage.clear();
    nav("/create/image");
  };

  //가장 가까운 초대장 상세 페이지 이동
  const viewNearInvitationPage = () => {
    nav(`/view/${invitation.invitationCode}`);
  };

  //초대장 목록 페이지 이동
  const goInvitationListPage = () => {
    nav("/mypage/list", { state: "all" });
  };

  //보낸 초대장 목록 페이지 이동
  const viewInviterListPage = () => {
    nav("/mypage/list", { state: "inviter" });
  };

  //받은 초대장 목록 페이지 이동
  const viewInviteeListPage = () => {
    nav("/mypage/list", { state: "invitee" });
  };

  const noneNearByInvitation = () => {
    return (
      <div className="text-center content-center h-24">
        <div className="cursor-default">가까운 일정이 없습니다.</div>
        <div className="">
          <Button text={"생성하기"} type={"BLUE"} onClick={goCreatePage} />
        </div>
      </div>
    );
  };

  const isNearbyInvitation = (invitation) => {
    if (invitation) {
      return true;
    }
    return undefined;
  };

  return (
    <div className="mypage-container">
      <div className="container-title text-3xl text-center py-2 font-bold cursor-default">
        마이 페이지
      </div>
      <div className="px-4 pb-3">
        <hr className="h-0.5" />
      </div>
      <section className="profile-section py-2 mb-2">
        <img
          className="profile-picture rounded-full"
          src={getUserProfile(userProfile)}
        />

        <div className="profile-name text-4xl py-5 font-extrabold cursor-default">
          {userName}
        </div>
      </section>

      <section className="invitation-section mb-6">
        <div className="mb-2 flex justify-between">
          <div className="section-title text-xl font-bold cursor-default">
            초대장
          </div>
          <div
            className="view-button text-base mr-1"
            onClick={() => goInvitationListPage()}
          >
            목록보기
          </div>
        </div>
        <div className="invitation-card box-shadow max-w-md mx-auto mb-4 bg-white rounded-xl p-3">
          <div className="small-title text-lg font-bold pb-1 cursor-default">
            가까운 일정
          </div>
          {isNearbyInvitation(invitation)
            ? nearByInvitation(invitation)
            : noneNearByInvitation()}
        </div>
        <div className="invitation-count-container box-shadow max-w-md mx-auto bg-white rounded-xl p-3 grid grid-cols-2">
          <div className="send-invitation text-center font-bold">
            <div className="text-sm cursor-default">보낸 초대장</div>

            <div
              className="invitation-count text-base cursor-pointer"
              onClick={() => viewInviterListPage()}
            >
              {countInviter}
            </div>
          </div>
          <div className="receive-invitation text-center font-bold">
            <div className="text-sm cursor-default">받은 초대장</div>
            <div
              className="invitation-count text-base cursor-pointer"
              onClick={() => viewInviteeListPage()}
            >
              {countInvitee}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MyPage;
