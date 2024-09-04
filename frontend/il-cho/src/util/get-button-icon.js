import back from "./../assets/back.png";
import up from "./../assets/upIcon.png";

export function getButtonImage(direction) {
  switch (direction) {
    case "back":
      return back;
    case "up":
      return up;
    default:
      return null;
  }
}
