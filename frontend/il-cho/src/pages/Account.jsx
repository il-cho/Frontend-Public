import { useRef, useState } from "react";
import Button from "../components/Button";
import { getBankIcon } from "../util/get-bank-icon";
import "./Account.css";
import "../components/Input.css";
import { RiArrowDropDownLine } from "react-icons/ri";
import { CSSTransition } from "react-transition-group";
import { useNavigate } from "react-router-dom";
import { createAccount } from "../api/getInvitationApi";
import useStore from "../store";
import { modifyInvitationFeature } from "../api/getInvitationApi";
import SemiHeader from "../components/SemiHeader";
import { modifyAccountPrompt } from "../api/getChatbotApi";
import BackButton from "../components/Button/BackButton";
import AccountComp from "../components/AccountComp";

const bankInfo = [
  {
    bankName: "국민은행",
    bankId: 1,
  },
  {
    bankName: "신한은행",
    bankId: 2,
  },
  {
    bankName: "하나은행",
    bankId: 3,
  },
  {
    bankName: "우리은행",
    bankId: 4,
  },
  {
    bankName: "IBK 기업은행",
    bankId: 5,
  },
  {
    bankName: "SC 제일은행",
    bankId: 6,
  },
  {
    bankName: "농협은행",
    bankId: 7,
  },
  {
    bankName: "카카오뱅크",
    bankId: 8,
  },
  {
    bankName: "토스뱅크",
    bankId: 9,
  },
  {
    bankName: "케이뱅크",
    bankId: 10,
  },
];

const Account = () => {
  const [inputValue, setInputValue] = useState(["", "", "", ""]);
  const [alertVisible, setAlertVisible] = useState([
    false,
    false,
    false,
    false,
  ]);
  const invitationCode = localStorage.getItem("invitationCode");

  const nav = useNavigate();

  const skip = () => {
    nav("/create/complete");
  };

  const changeAlertVisible = (id, newValue) => {
    setAlertVisible(
      alertVisible.map((value, index) => (id === index ? newValue : value))
    );
  };

  const setValue = (id, newValue) => {
    setInputValue(
      inputValue.map((value, index) => (id === index ? newValue : value))
    );
  };

  const validateAmount = () => {
    if (inputValue[0].startsWith("0")) {
      return false;
    } else if (!/^[0-9-]+$/.test(inputValue[0])) {
      return false;
    } else if (inputValue[0] <= 0) {
      return false;
    } else if (inputValue[0] === "") {
      return false;
    }
    return true;
  };

  const validateAccount = () => {
    const cleanedAccountNumber = inputValue[2].replace(/-/g, "");
    if (!/^[0-9-]+$/.test(cleanedAccountNumber)) {
      return false;
    } else if (
      cleanedAccountNumber.length < 10 ||
      cleanedAccountNumber.length > 14
    ) {
      return false;
    }
    return true;
  };

  const validateBankName = () => {
    if (inputValue[1] === "") return false;
    return true;
  };

  const validateBankHolder = () => {
    if (inputValue[3] === "") return false;
    return true;
  };

  const validateAll = () => {
    if (!validateAmount()) {
      changeAlertVisible(0, true);
      return false;
    }
    if (!validateBankName()) {
      changeAlertVisible(1, true);
      return false;
    }
    if (!validateAccount()) {
      changeAlertVisible(2, true);
      return false;
    }
    if (!validateBankHolder()) {
      changeAlertVisible(3, true);
      return false;
    }
    return true;
  };

  const addAccount = async () => {
    if (!validateAll()) {
      return;
    }
    try {
      modifyInvitationFeature(invitationCode, "account", true);
      const res = await createAccount(
        invitationCode,
        inputValue[0],
        inputValue[1],
        inputValue[2],
        inputValue[3]
      );

      modifyAccountPrompt(
        invitationCode,
        inputValue[0],
        inputValue[1],
        inputValue[2],
        inputValue[3]
      );

      nav("/create/complete");
    } catch (error) {
      console.error("계좌 정보 생성 중 오류 발생", error);
      sessionStorage.setItem("redirection", "/create/account");
      nav("/error");
    }
  };

  return (
    <div className="Account">
      <BackButton onClick={() => nav("/create/place")} />
      <SemiHeader
        title={"계좌"}
        content={"정산 금액 혹은 정산 계좌를 입력해주세요."}
      />
      <AccountComp
        inputValue={inputValue}
        setValue={setValue}
        changeAlertVisible={changeAlertVisible}
        alertVisible={alertVisible}
        validateAmount={validateAmount}
        validateAccount={validateAccount}
        validateBankHolder={validateBankHolder}
      />
      <div className="Account-item Account-button">
        <Button text={"건너뛰기"} type={"GRAY"} onMouseDown={skip}></Button>
        <Button text={"추가"} type={"BLUE"} onClick={addAccount}></Button>
      </div>
    </div>
  );
};

export default Account;
