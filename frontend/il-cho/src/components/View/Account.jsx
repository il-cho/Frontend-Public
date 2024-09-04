import SemiHeader from "../SemiHeader";
import Button from "../Button";
import { getAccount, modifyAccount } from "../../api/getInvitationApi";
import { modifyAccountPrompt } from "../../api/getChatbotApi";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { getViewImage } from "../../util/get-view-img";
import Swal from "sweetalert2";
import { Toaster, toast } from "react-hot-toast";
import AccountComp from "../AccountComp";
import useStore from "../../store";

const Account = () => {
  const params = useParams();
  const [isModify, setIsModify] = useState(false);
  const [inputValue, setInputValue] = useState(["", "", "", ""]);
  const [alertVisible, setAlertVisible] = useState([false, false, false, false]);
  const [invitationInfo, setInvitationInfo] = useState({});

  useEffect(() => {
    setAlertVisible([false, false, false, false]);
    const fetchAccount = async () => {
      try {
        const result = await getAccount(params.id);
        //console.log("계좌 조회 결과 -> ", result);
        setInvitationInfo({
          id: result.id,
          invitationCode: result.invitationCode,
          price: String(result.price),
          bankName: result.bankName,
          bankAccount: result.bankAccount,
          accountHolder: result.accountHolder,
        });
        setInputValue([
          String(result.price),
          result.bankName,
          result.bankAccount,
          result.accountHolder,
        ]);
      } catch (error) {
        console.error("계좌 조회 중 오류 발생", error);
      }
    };
    fetchAccount();
  }, []);

  useEffect(() => {
    setAlertVisible([false, false, false, false]);
    const fetchAccount = async () => {
      try {
        const result = await getAccount(params.id);
        //console.log("계좌 조회 결과 -> ", result);
        setInvitationInfo({
          id: result.id,
          invitationCode: result.invitationCode,
          price: String(result.price),
          bankName: result.bankName,
          bankAccount: result.bankAccount,
          accountHolder: result.accountHolder,
        });
        setInputValue([
          String(result.price),
          result.bankName,
          result.bankAccount,
          result.accountHolder,
        ]);
      } catch (error) {
        console.error("계좌 조회 중 오류 발생", error);
      }
    };
    fetchAccount();
  }, []);

  if (!invitationInfo) {
    return;
    // TODO 계좌 정보가 없습니다
  }

  const changeAlertVisible = (id, newValue) => {
    setAlertVisible(alertVisible.map((value, index) => (id === index ? newValue : value)));
  };

  const setValue = (id, newValue) => {
    setInputValue(inputValue.map((value, index) => (id === index ? newValue : value)));
  };

  const enableModifyMode = () => {
    setIsModify(true);
  };

  const disableModifyMode = () => {
    setIsModify(false);
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
    } else if (cleanedAccountNumber.length < 10 || cleanedAccountNumber.length > 14) {
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

  const sendModifiedInfo = async () => {
    if (!validateAll()) return;
    try {
      const result = await modifyAccount(
        invitationInfo.id,
        invitationInfo.invitationCode,
        inputValue[0],
        inputValue[1],
        inputValue[2],
        inputValue[3]
      );
      modifyAccountPrompt(
        invitationInfo.invitationCode,
        inputValue[0],
        inputValue[1],
        inputValue[2],
        inputValue[3]
      );
      setInvitationInfo({
        id: result.id,
        invitationCode: result.invitationCode,
        price: String(result.price),
        bankName: result.bankName,
        bankAccount: result.bankAccount,
        accountHolder: result.accountHolder,
      });
      setIsModify(false);
    } catch (error) {
      //console.log("계좌 수정 에러");
    }
  };

  return (
    <div>
      <div>
        <div className="flex justify-between">
          <SemiHeader title={"계좌"} type={"VIEW"} />
          {isModify === false ? (
            <Button text={"수정하기"} type={"BLUE"} onClick={enableModifyMode} />
          ) : (
            <div className="flex items-end">
              <Button text={"취소"} type={"BLUE"} onClick={disableModifyMode} />
              <Button text={"수정완료"} type={"BLUE"} onClick={sendModifiedInfo} />
            </div>
          )}
        </div>
        {isModify ? (
          <div>
            <AccountComp
              inputValue={inputValue}
              setValue={setValue}
              changeAlertVisible={changeAlertVisible}
              alertVisible={alertVisible}
              validateAmount={validateAmount}
              validateAccount={validateAccount}
              validateBankHolder={validateBankHolder}
            />
          </div>
        ) : (
          <div>
            <div className="text-gray-500 text-base">총 금액: {invitationInfo.price} 원</div>
            <div className="flex items-center justify-between">
              <div className="text-gray-500 font-normal text-base mr-3">
                {invitationInfo.bankName} {invitationInfo.bankAccount}
              </div>
              <div className="flex items-center">
                <img className="mx-1 w-4 h-4" src={getViewImage("copy")} />
                <CopyToClipboard
                  className="text-gray-500 mr-5"
                  text={invitationInfo.bankAccount}
                  onCopy={() =>
                    toast("클립보드에 복사되었습니다.", {
                      icon: "📎",
                      duration: 1500,
                    })
                  }
                >
                  <button className="text-gray-500 mr-5">복사</button>
                </CopyToClipboard>
              </div>
            </div>
            <div className="text-gray-500 font-normal text-base">
              예금주: {invitationInfo.accountHolder}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Account;
