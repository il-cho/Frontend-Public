import SemiHeader from "../SemiHeader";
import { useState, useRef, useEffect, createRef } from "react";
import PlaceComp from "../place/PlaceComp";
import { getViewImage } from "../../util/get-view-img";
import Button from "../Button";
import useStore from "../../store";
import { createMapWithRefresh, getMap } from "../../api/getMapApi";
import "./Location.css";
import FadeAlert from "../../components/animation/FadeAlert";
import Swal from "sweetalert2";

const isDuplicate = (selectedPlaceList, searchData) =>
  selectedPlaceList.find((item) => String(item.id) === String(searchData.id)) !== undefined;

const Location = ({ invitationId, inviter, isOpen, setIsOpen }) => {
  const locationRef = useRef(null);
  const [editable, setEditable] = useState(false);
  const userId = useStore((state) => state.userId);
  const [selectedPlaceList, setSelectedPlaceList] = useState([]);
  const [adminMode, setAdminMode] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [completed, setCompleted] = useState(false);
  const getMapData = async () => {
    try {
      const response = await getMap(invitationId);
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

  const openDetail = () => {
    if (!isOpen) {
      handlerClick();
    }
    setIsOpen(!isOpen);
  };

  const handlerClick = () => {
    if (locationRef.current) {
      locationRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const updateMap = () => {
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
    createMapWithRefresh(userId, invitationId, placeInfo);
  };
  const sendConfirmedPlace = (data) => {
    const placeInfo = data.map((placeList) => {
      return {
        latitude: placeList.y,
        longitude: placeList.x,
        placeType: placeList.placeType,
        placeName: placeList.placeName,
        placeAddress: placeList.placeAddress,
        kakaoMapId: placeList.originalId,
      };
    });
    createMapWithRefresh(userId, invitationId, placeInfo);
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
    setSelectedPlaceList(selectedPlaceList.filter((selectedItem) => selectedItem.id != data.id));
  };

  const onCircleButtonClick = () => {
    if (selectedPlaceList.length != 1) {
      setAlertVisible(true);
      return;
    }
    Swal.fire({
      icon: "warning",
      title: "한번 확정한 장소는 \n 변경이 불가능합니다.",
      text: "정말 변경하시겠습니까?",
      showCancelButton: true,
      confirmButtonText: "예",
      cancelButtonText: "아니오",
      confirmButtonColor: "#429f50",
      cancelButtonColor: "#d33",
      width: "350px",
    }).then((result) => {
      if (result.isConfirmed) {
        setSelectedPlaceList([
          {
            ...selectedPlaceList[0],
            placeType: "confirm",
            id: `${selectedPlaceList[0].originalId}_'confirm'`,
          },
        ]);
        setCompleted(true);
        sendConfirmedPlace([
          {
            ...selectedPlaceList[0],
            placeType: "confirm",
            id: `${selectedPlaceList[0].originalId}_confirm`,
          },
        ]);
      }
    });
  };

  useEffect(() => {
    if (editable === true) setAdminMode(false);
  }, [editable]);

  useEffect(() => {
    if (adminMode === true) setEditable(false);
  }, [adminMode]);

  useEffect(() => {
    if (selectedPlaceList.length <= 1) setAlertVisible(false);
  }, [selectedPlaceList]);

  useEffect(() => {
    getMapData();
  }, []);

  useEffect(() => {
    if (isOpen === false) {
      setEditable(false);
      setAdminMode(false);
    }
  }, [isOpen]);

  return (
    <div ref={locationRef}>
      <div className="flex justify-between" onClick={openDetail}>
        <SemiHeader title={"위치"} type={"VIEW"} />
        {isOpen ? (
          <img className="w-8 h-8 mt-4 cursor-pointer" src={getViewImage("arrowUp")} />
        ) : (
          <img className="w-8 h-8 mt-4 cursor-pointer" src={getViewImage("arrowDown")} />
        )}
      </div>
      {isOpen ? (
        <div>
          <div>
            <PlaceComp
              editable={editable}
              invitationCode={invitationId}
              selectedPlaceList={selectedPlaceList}
              addSelectedItem={addSelectedItem}
              deleteSelectedItem={deleteSelectedItem}
              adminMode={adminMode}
              onCircleButtonClick={onCircleButtonClick}
            />
          </div>
          <FadeAlert
            text="확정지를 선택하려면 위치를 하나만 남겨주세요."
            alertVisible={alertVisible}
          ></FadeAlert>

          {completed === false ? (
            <div className="map-button-group">
              {Number(inviter) === Number(userId) ? (
                adminMode === false ? (
                  <Button
                    text={"확정하기"}
                    type="BLUE"
                    onClick={() => {
                      setAdminMode(!adminMode);
                    }}
                  />
                ) : (
                  <Button
                    text={"확정완료"}
                    type={"BLUE"}
                    onClick={() => {
                      setAdminMode(!adminMode);
                    }}
                  />
                )
              ) : undefined}

              {editable == true ? (
                <Button
                  text="편집완료"
                  type="BLUE"
                  onClick={() => {
                    setEditable(!editable);
                    updateMap();
                  }}
                />
              ) : (
                <Button
                  text="장소편집"
                  type="BLUE"
                  onClick={() => {
                    setEditable(!editable);
                  }}
                />
              )}
            </div>
          ) : undefined}
        </div>
      ) : undefined}
    </div>
  );
};

export default Location;
