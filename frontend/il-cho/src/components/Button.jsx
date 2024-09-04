import "./Button.css";

const Button = ({ text, type, onClick, onMouseDown }) => {
  return (
    <button onMouseDown={onMouseDown} onClick={onClick} className={`Button Button_${type}`}>
      {text}
    </button>
  );
};

export default Button;
