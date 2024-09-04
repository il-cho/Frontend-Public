import { useState } from "react";
import UncheckBox from "./../../assets/checkbox_unchecked.svg";
import Checkbox from "./../../assets/checkbox_checked.svg";

const CheckBox = ({ text }) => {
  const [checked, setChecked] = useState(false);
  const changeClickState = () => {
    setChecked(!checked);
  };
  return (
    <div className="flex mx-4 my-4" onClick={changeClickState}>
      <img src={checked ? Checkbox : UncheckBox} className="mx-2"></img>
      <p className="font-semibold">{text}</p>
    </div>
  );
};

export default CheckBox;
