import Button from "../Button";
import "./SearchPlaceItem.css";

const SearchPlaceItem = ({ placeName, placeAddress, clickEvent, addButtonClick }) => {
  return (
    <div className="place-box">
      <div className="place-box-right" onClick={clickEvent}>
        <div className="place-box-place-name">{placeName}</div>
        <div className="place-box-place-address">{placeAddress}</div>
      </div>
      <div className="place-box-left">
        <Button text={"추가"} type={"BLUE"} onClick={addButtonClick}></Button>
      </div>
    </div>
  );
};
export default SearchPlaceItem;
