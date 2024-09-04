import login from "./../assets/login.svg";
import envelope from "./../assets/Envelope.png"
import magicwind from "./../assets/Magicwand.png"
import partypopper from "./../assets/Partypopper.png"
import kakao from "./../assets/kakao.png"
import naver from "./../assets/naver.png"

export function getImage(iconId) { // iconId 임의로 설정
    switch (iconId) {
      case "login":
        return login;
      case "envelope":
        return envelope;
      case "magicwind":
        return magicwind;
      case "partypopper":
        return partypopper;
      case "kakao":
        return kakao;
      case "naver":
        return naver;
      default:
        return null;
    }
  }