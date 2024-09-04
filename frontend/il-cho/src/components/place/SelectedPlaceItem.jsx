import { useRef } from "react";
import "./SelectedPlaceItem.css";
import { CSSTransition } from "react-transition-group";
import { RxCross1 } from "react-icons/rx";
import { GiConfirmed } from "react-icons/gi";
import { FaRegCircle } from "react-icons/fa";
import { TiPin } from "react-icons/ti";

const getPlaceTypeKor = (placeTpyeEng) => {
  switch (placeTpyeEng) {
    case "confirm":
      return "확정";
  }
};

const SelectedPlaceItem = ({
  placeItem,
  onDeleteButtonClick,
  editable,
  adminMode,
  onCircleButtonClick,
  onSelectedItemClick,
}) => {
  const deleteRef = useRef(null);
  const circleRef = useRef(null);
  const checkRef = useRef(null);
  const { placeName, placeAddress, placeType } = placeItem;
  const placeTypeKor = getPlaceTypeKor(placeType);
  return (
    <div
      className="place-item-main"
      onClick={() => {
        onSelectedItemClick(placeItem);
      }}
    >
      <CSSTransition
        nodeRef={deleteRef}
        in={editable}
        timeout={500}
        classNames="icon-fade"
        unmountOnExit
      >
        <div ref={deleteRef}>
          <RxCross1 className="delete-icon" onClick={onDeleteButtonClick} />
        </div>
      </CSSTransition>

      <CSSTransition
        nodeRef={circleRef}
        in={adminMode && String(placeType) === "candidate"}
        timeout={500}
        classNames="icon-fade"
        unmountOnExit
      >
        <div ref={circleRef}>
          <FaRegCircle className="circle-icon" onClick={onCircleButtonClick} />
        </div>
      </CSSTransition>

      <CSSTransition
        nodeRef={checkRef}
        in={adminMode && String(placeType) === "confirm"}
        timeout={500}
        classNames="icon-fade"
        unmountOnExit
      >
        <div ref={checkRef}>
          <GiConfirmed className="check-icon" />
        </div>
      </CSSTransition>

      <div className="place-item-name">
        <div className="place-name">
          {placeName}
          <span className={`place-item-type place-item-type-${placeType}`}>
            {placeType === "confirm" ? <span>{placeTypeKor}</span> : undefined}
          </span>
        </div>
      </div>
      <div className="place-item-address">{placeAddress}</div>
    </div>
  );
};

export default SelectedPlaceItem;
