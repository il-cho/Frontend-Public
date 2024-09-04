import { createRef, useEffect, useRef, useState } from "react";
import Input from "../Input";
import "./PlaceComp.css";
import SearchPlaceItem from "./SearchPlaceItem";
import SelectedPlaceItem from "./SelectedPlaceItem";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import KakaoMap from "./KakaoMap";

const PlaceComp = ({
  editable,
  selectedPlaceList,
  addSelectedItem,
  deleteSelectedItem,
  adminMode,
  onCircleButtonClick,
}) => {
  const ps = new window.kakao.maps.services.Places();
  const [placeInput, setPlaceInput] = useState("");
  const [searchPlaceList, setSearchPlaceList] = useState([]);
  const [centerPos, setCenterPos] = useState({
    y: selectedPlaceList.length > 0 ? selectedPlaceList[0].y : 37.5012860931305,
    x: selectedPlaceList.length > 0 ? selectedPlaceList[0].x : 127.039604663862,
  });
  const [marker, setMarker] = useState({
    latlng: { lat: undefined, lng: undefined },
  });

  const editableBox = useRef(null);
  const placeBoxRef = useRef(null);

  let placeType = "candidate";

  const addButtonClick = (data) => {
    setCenterPos({ y: data.y, x: data.x });
    setMarker({ latlng: { lat: undefined, lng: undefined } });
    addSelectedItem(data);
  };

  const searchKeyword = (keyword) => {
    ps.keywordSearch(keyword, (dataset, status, _pagination) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setSearchPlaceList(
          dataset.map((data) => {
            return {
              originalId: data.id,
              id: `${data.id}_${placeType}`,
              placeName: data.place_name,
              placeAddress: data.address_name,
              x: data.x,
              y: data.y,
              placeType: placeType,
            };
          })
        );
      } else {
        setSearchPlaceList([]);
      }
    });
  };
  const onSelectedItemClick = (selectedData) => {
    setCenterPos({
      y: selectedData.y,
      x: selectedData.x,
    });
  };

  useEffect(() => {
    if (editable === false) {
      setSearchPlaceList([]);
      setPlaceInput("");
    }
  }, [editable]);

  useEffect(() => {
    if (selectedPlaceList.length > 0)
      setCenterPos({
        y: selectedPlaceList[0].y,
        x: selectedPlaceList[0].x,
      });
  }, []);

  return (
    <div className="place">
      <div className="place-item">
        <KakaoMap centerPos={centerPos} marker={marker} selectedPlaceList={selectedPlaceList} />
      </div>

      <CSSTransition
        nodeRef={editableBox}
        in={editable}
        timeout={1000}
        classNames="placeBox-fade-in"
        unmountOnExit
      >
        <div className="place-item" ref={editableBox}>
          <Input
            placeholder={"주소 입력"}
            inputValue={placeInput}
            onKeydown={(e) => {
              if (e.key === "Enter") {
                searchKeyword(placeInput);
              }
            }}
            onChange={(e) => {
              setPlaceInput(e.target.value);
            }}
            onClickInputBtn={() => {
              searchKeyword(placeInput);
            }}
          />
        </div>
      </CSSTransition>
      <CSSTransition
        nodeRef={placeBoxRef}
        in={editable && searchPlaceList.length !== 0}
        timeout={1000}
        classNames="placeBox-fade-in"
        unmountOnExit
      >
        <div className="place-list-box place-item" ref={placeBoxRef}>
          {searchPlaceList.map((data) => (
            <SearchPlaceItem
              key={data.id}
              placeName={data.placeName}
              placeAddress={data.placeAddress}
              clickEvent={() => {
                setCenterPos({
                  y: data.y,
                  x: data.x,
                });
                setMarker({
                  latlng: { lat: data.y, lng: data.x },
                });
              }}
              addButtonClick={() => {
                addButtonClick(data);
              }}
            />
          ))}
        </div>
      </CSSTransition>

      <div className="place-item selected-place-box">
        {selectedPlaceList.map((data) => (
          <SelectedPlaceItem
            key={data.id}
            placeItem={data}
            ref={data.ref}
            onDeleteButtonClick={() => {
              deleteSelectedItem(data);
            }}
            editable={editable}
            adminMode={adminMode}
            onCircleButtonClick={onCircleButtonClick}
            onSelectedItemClick={onSelectedItemClick}
          />
        ))}
      </div>
    </div>
  );
};

export default PlaceComp;
