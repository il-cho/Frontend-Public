import { createRef, useEffect, useRef, useState } from "react";
import SemiHeader from "../components/SemiHeader";
import "./Place.css";

import { useNavigate } from "react-router-dom";

import Button from "../components/Button";

import useStore from "../store";
import PlaceComp from "../components/place/PlaceComp";
import { createMap } from "../api/getMapApi";
import { modifyInvitationFeature } from "../api/getInvitationApi";
import BackButton from "../components/Button/BackButton";
import { CSSTransition } from "react-transition-group";
import FadeAlert from "../components/animation/FadeAlert";
import { modifyPlacePrompt } from "../api/getChatbotApi";
import { getMap } from "../api/getMapApi";

const isDuplicate = (selectedPlaceList, searchData) =>
  selectedPlaceList.find(
    (item) => String(item.id) === String(searchData.id)
  ) !== undefined;

const Place = () => {
  const nav = useNavigate();
  const userId = useStore((state) => state.userId);
  // const invitationCode = useStore((state) => state.invitationCode);
  const invitationCode = localStorage.getItem("invitationCode");
  const [checked, setChecked] = useState(false);
  const [selectedPlaceList, setSelectedPlaceList] = useState([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [completed, setCompleted] = useState(false);
  const checkContainer = useRef();
  const confirmAlert = useRef();
  const skip = () => {
    nav("/create/account");
  };

  const getMapData = async () => {
    try {
      const response = await getMap(invitationCode);
      let newSelectedPlaceList = [];
      response.forEach((data) => {
        data.placeInfo.forEach((placeInfo) => {
          newSelectedPlaceList.push({
            id: `${placeInfo.kakaoMapId}_${placeInfo.placeType.toLowerCase()}`,
            y: placeInfo.latitude,
            x: placeInfo.longitude,
            placeName: placeInfo.placeName,
            placeAddress: placeInfo.placeAddress,
            placeType: placeInfo.placeType.toLowerCase(),
            nodeRef: createRef(null),
            originalId: placeInfo.kakaoMapId,
          });
        });
      });
      newSelectedPlaceList.forEach((placeInfo) => {
        if (placeInfo.placeType === "confirm") setCompleted(true);
      });
      setSelectedPlaceList(newSelectedPlaceList);
    } catch (error) {
      console.error("맵 조회 실패", error);
    }
  };

  const addPlace = () => {
    try {
      const placeInfo = selectedPlaceList.map((placeList) => {
        return {
          latitude: placeList.y,
          longitude: placeList.x,
          placeType: placeList.placeType,
          placeName: placeList.placeName,
          placeAddress: placeList.placeAddress,
          kakaoMapId: placeList.originalId,
        };
      });
      modifyInvitationFeature(invitationCode, "place", true);
      createMap(userId, invitationCode, placeInfo);
      modifyPlacePrompt(invitationCode, placeInfo);
      localStorage.setItem("lastPage", "/create/place");
      nav("/create/account");
    } catch (error) {
      console.error("지도 생성 실패", error);
      nav("/error", { state: "지도 생성에 실패했어요." });
    }
  };

  const addSelectedItem = (searchData) => {
    if (isDuplicate(selectedPlaceList, searchData)) return;
    setSelectedPlaceList([
      {
        ...searchData,
        placeType: searchData.placeType,
        id: searchData.id,
        originalId: searchData.originalId,
        nodeRef: createRef(null),
      },
      ...selectedPlaceList,
    ]);
  };

  const deleteSelectedItem = (data) => {
    setSelectedPlaceList(
      selectedPlaceList.filter((selectedItem) => selectedItem.id != data.id)
    );
  };

  const checkValidation = () => {
    if (selectedPlaceList.length > 1) {
      setAlertVisible(true);
      setChecked(false);
      return;
    }
    setChecked(!checked);
  };

  useEffect(() => {
    getMapData();
  }, []);

  useEffect(() => {
    if (selectedPlaceList.length > 1 || selectedPlaceList.length == 0)
      setChecked(false);
    if (selectedPlaceList.length < 2) setAlertVisible(false);
  }, [selectedPlaceList]);

  useEffect(() => {
    if (checked === true && selectedPlaceList.length == 1) {
      setSelectedPlaceList([
        {
          ...selectedPlaceList[0],
          placeType: "confirm",
          id: `${selectedPlaceList[0].originalId}_confirm`,
        },
      ]);
    } else if (checked === false && selectedPlaceList.length == 1) {
      setSelectedPlaceList([
        {
          ...selectedPlaceList[0],
          placeType: "candidate",
          id: `${selectedPlaceList[0].originalId}_candidate`,
        },
      ]);
    }
  }, [checked]);

  return (
    <div>
      <BackButton onClick={() => nav("/create/calendar")} />
      <SemiHeader
        title={"위치"}
        content={"초대 위치 혹은 후보 위치를 지정해주세요."}
      ></SemiHeader>
      <PlaceComp
        invitationCode={invitationCode}
        editable={true}
        selectedPlaceList={selectedPlaceList}
        addSelectedItem={addSelectedItem}
        deleteSelectedItem={deleteSelectedItem}
        adminMode={false}
      />
      <FadeAlert
        text="확정지는 하나의 위치만 등록 가능합니다."
        alertVisible={alertVisible}
      ></FadeAlert>

      <CSSTransition
        nodeRef={checkContainer}
        in={selectedPlaceList.length !== 0}
        timeout={500}
        classNames="selected-item"
        unmountOnExit
      >
        <div className="checkbox-container" ref={checkContainer}>
          <input
            type="checkbox"
            checked={checked}
            onChange={() => {
              checkValidation();
            }}
          />
          <label className="confirm-notification"> 확정된 위치입니다. </label>
        </div>
      </CSSTransition>
      <div className="flex justify-end mt-4 mb-10">
        <Button type={"GRAY"} text={"기능 건너뛰기"} onClick={skip} />
        <Button type={"BLUE"} text={"기능 추가"} onClick={addPlace} />
      </div>
    </div>
  );
};

export default Place;
