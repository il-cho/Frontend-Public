import kakao from "./../assets/kakao-talk-fill.png";
import instagram from "./../assets/instagram.png";
import link from "./../assets/Link.png"

export function getShareImage(iconId) { // iconId 임의로 설정
  switch (iconId) {
    case "kakao":
      return kakao;
    case "instagram":
      return instagram;
    case "link":
      return link;
    default:
      return null;
  }
}