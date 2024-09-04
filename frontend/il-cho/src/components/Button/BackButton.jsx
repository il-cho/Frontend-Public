import { getButtonImage } from "../../util/get-button-icon";

const BackButton = ({ onClick }) => {
  return (
    <>
      <img
        className="w-5 cursor-pointer"
        src={getButtonImage("back")}
        onClick={onClick}
      />
    </>
  );
};

export default BackButton;
