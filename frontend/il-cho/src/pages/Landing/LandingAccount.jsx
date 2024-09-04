import "./LandingAccount.css";
import { useGSAP } from "@gsap/react";
import { getLandingImg } from "../../util/get-landing-img";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { getBankIcon } from "../../util/get-bank-icon";

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

const LandingAccount = () => {
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    const accountText = gsap.timeline({
      scrollTrigger: {
        scroller: "#root",
        trigger: ".landing",
        start: "3750px bottom",
        end: "3900px 75%",
        scrub: 0.5,
      },
    });

    accountText
      .fromTo(".landing-account-title", { x: -50, opacity: 0 }, { x: 0, opacity: 1 })
      .fromTo(
        ".landing-account-description",
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.2 }
      );

    const accountBox = gsap.timeline({
      scrollTrigger: {
        scroller: "#root",
        trigger: ".landing",
        start: "3850px bottom",
        end: "4150px 75%",
        scrub: 0.5,
      },
    });

    accountBox
      .fromTo(".account-image-sub-container-1", { opacity: 0, y: 30 }, { opacity: 1, y: 0 })
      .fromTo(".account-image-sub-container-3", { opacity: 0, y: 30 }, { opacity: 1, y: 0 })
      .fromTo(".account-image-sub-container-4", { opacity: 0, y: 30 }, { opacity: 1, y: 0 })
      .fromTo(".account-image-sub-container-2", { opacity: 0, y: 30 }, { opacity: 1, y: 0 })
      .fromTo(".account-image-sub-container-down", { y: 0 }, { y: 400 })
      .fromTo(".account-bank-icon-box", { opacity: 0 }, { opacity: 1 })
      .fromTo(".account-bank-icon", { opacity: 0 }, { opacity: 1 });
    // const accountText = gsap.timeline({
    //   scrollTrigger: {
    //     scroller: "#root",
    //     trigger: ".landing",
    //     start: "4100px bottom",
    //     end: "4250px 75%",
    //     scrub: 0.5,
    //   },
    // });

    // accountText.fromTo(
    //   ".landing-account-description",
    //   { y: 30, opacity: 0 },
    //   { y: 0, opacity: 1, stagger: 0.1 }
    // );
  });

  return (
    <div className="landing-account">
      <div className="landing-account-title">정산</div>
      <div className="landing-account-description">계좌 정보 입력하여</div>
      <div className="landing-account-description">제때 제때 정산하기!</div>
      <div className="account-image-main-container">
        <div className="account-image-sub-container account-image-sub-container-1">
          <img src={getLandingImg("price")} />
        </div>
        <div className="account-image-sub-container account-image-sub-container-2">
          <img src={getLandingImg("bank")} />
          <div className="account-bank-icon-box">
            {bankInfo.map((bank) => (
              <div key={bank.bankId} className="account-bank-icon">
                <img src={getBankIcon(bank.bankId)}></img>
                <div>{bank.bankName}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="account-image-sub-container account-image-sub-container-3 account-image-sub-container-down">
          <img src={getLandingImg("account")} />
        </div>
        <div className="account-image-sub-container account-image-sub-container-4 account-image-sub-container-down">
          <img src={getLandingImg("accountHolder")} />
        </div>
      </div>
    </div>
  );
};

export default LandingAccount;
