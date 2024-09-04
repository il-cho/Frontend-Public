import "./Input.css";
import { CiSearch } from "react-icons/ci";


const Input = ({ placeholder, onKeydown, onChange, inputValue, onClickInputBtn }) => {
  return (
    <div className="input-wrapper">
      <input
        type="text"
        className="Input"
        placeholder={placeholder}
        onKeyDown={onKeydown}
        value={inputValue}
        onChange={onChange}
      />
      {onClickInputBtn !== undefined ? (
        <CiSearch className="click-btn" onClick={onClickInputBtn} />
      ) : undefined}
    </div>
  );
};

export default Input;
