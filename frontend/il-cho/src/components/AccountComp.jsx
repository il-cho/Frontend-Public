import { useEffect, useRef, useState } from "react";
import Button from "../components/Button";
import { getBankIcon } from "../util/get-bank-icon";
import "./AccountComp.css";
import "../components/Input.css";
import { RiArrowDropDownLine } from "react-icons/ri";
import { CSSTransition } from "react-transition-group";
import { useNavigate } from "react-router-dom";
import { createAccount } from "../api/getInvitationApi";
import useStore from "../store";
import { modifyInvitationFeature } from "../api/getInvitationApi";
import FadeInput from "../components/animation/FadeInput";
import FadeAlert from "../components/animation/FadeAlert";
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

const AccountComp = ({ inputValue, setValue, validateAmount, validateAccount, validateBankHolder, changeAlertVisible, alertVisible}) => {
  const [bankVisible, setBankVisible] = useState(false);
  const [inputVisible, setInputVisble] = useState([true, true, true, true]);
  const focusRef = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const nodeRef = useRef(null);

  const getFocus = (ref) => {
    focusRef[ref].current.focus();
    ref === 1 ? setBankVisible(true) : setBankVisible(false);
  };

  const handleBlur = (current) => {
    if (current === 0) {
      if (validateAmount()) getFocus(1);
      else changeAlertVisible(0, true);
    } else if (current === 2) {
      if (validateAccount()) {
        getFocus(3);
      } else {
        changeAlertVisible(2, true);
      }
    } else if (current === 3) {
      if (inputValue[3] === "") changeAlertVisible(3, true);
    }
  };


  const amountOnKeydown = (e) => {
    if (e.key === "Enter") {
      if (validateAmount()) getFocus(1);
      else changeAlertVisible(0, true);
    } else if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-") e.preventDefault();
    else changeAlertVisible(0, false);
  };
  const onBankAccountKeydown = (e) => {
    if (e.key === "Enter") {
      if (validateAccount()) getFocus(3);
      else changeAlertVisible(2, true);
    } else changeAlertVisible(2, false);
  };
  const onBankHolderKeydown = (e) => {
    if (e.key === "Enter") {
      if (!validateBankHolder()) changeAlertVisible(3, true);
    } else {
      changeAlertVisible(3, false);
    }
  };

  return (
    <div className="Account">
      <div className="Account-item">
        <div className="Account-inputbox">
          <FadeInput
            ref={focusRef[0]}
            type="number"
            id="amount"
            visible={inputVisible[0]}
            inputValue={inputValue[0]}
            placeholder="금액"
            onKeydown={(e) => {
              amountOnKeydown(e);
            }}
            onFocus={() => {
              changeAlertVisible(0, false);
            }}
            onBlur={() => {
              handleBlur(0);
            }}
            onChange={(e) => {
              setValue(0, e.target.value);
            }}
          ></FadeInput>
          <div className="Account-won">원</div>
          <FadeAlert alertVisible={alertVisible[0]} text={"금액을 입력해주세요."} align={"left"} />
        </div>
      </div>

      <div className="Account-item Bank-box">
        <div className="Account-inputbox">
          <FadeInput
            ref={focusRef[1]}
            type="dropdown"
            id="bank"
            visible={inputVisible[1]}
            inputValue={inputValue[1]}
            placeholder="은행"
            onFocus={() => {
              changeAlertVisible(1, false);
            }}
            readonly={true}
          ></FadeInput>
          <RiArrowDropDownLine
            className="Bank-dropdown"
            size="48"
            fill="#d4d4d4"
            onClick={() => {
              changeAlertVisible(1, false);
              setBankVisible(!bankVisible);
            }}
          />
          <FadeAlert alertVisible={alertVisible[1]} text={"은행을 선택해주세요."} align={"left"} />
          <CSSTransition
            nodeRef={nodeRef}
            in={bankVisible}
            timeout={500}
            classNames="Bank-icon-animation"
            unmountOnExit
          >
            <div className="Bank-icon-box" ref={nodeRef}>
              {bankInfo.map((bank) => (
                <div
                  key={bank.bankId}
                  className="Bank-icon"
                  onClick={() => {
                    setValue(1, bank.bankName);
                    setBankVisible(!bankVisible);
                    changeAlertVisible(1, false);
                    getFocus(2);
                  }}
                >
                  <img src={getBankIcon(bank.bankId)}></img>
                  <div>{bank.bankName}</div>
                </div>
              ))}
            </div>
          </CSSTransition>
        </div>
      </div>

      <div className="Account-item">
        <FadeInput
          ref={focusRef[2]}
          type="text"
          id="bankAccount"
          visible={inputVisible[2]}
          inputValue={inputValue[2]}
          placeholder="계좌번호"
          onKeydown={(e) => {
            onBankAccountKeydown(e);
          }}
          onFocus={() => {
            changeAlertVisible(2, false);
          }}
          onBlur={() => {
            handleBlur(2);
          }}
          onChange={(e) => {
            setValue(2, e.target.value);
          }}
        ></FadeInput>
        <FadeAlert
          alertVisible={alertVisible[2]}
          text={"계좌 번호를 입력해주세요."}
          align={"left"}
        />
      </div>

      <div className="Account-item">
        <FadeInput
          ref={focusRef[3]}
          type="text"
          id="accountHolder"
          visible={inputVisible[3]}
          inputValue={inputValue[3]}
          placeholder="예금주"
          onKeydown={(e) => {
            onBankHolderKeydown(e);
          }}
          onFocus={() => {
            changeAlertVisible(3, false);
          }}
          onBlur={() => {
            handleBlur(3);
          }}
          onChange={(e) => {
            setValue(3, e.target.value);
          }}
        ></FadeInput>
        <FadeAlert alertVisible={alertVisible[3]} text={"예금주를 입력해주세요."} align={"left"} />
      </div>
    </div>
  );
};

export default AccountComp;

