import candidate from "./../assets/marker/candidate.png";
import start from "./../assets/marker/start.png";
import confirm from "./../assets/marker/confirm.png";

export function getMarkerImage(type) {
    switch (type) {
      case "candidate":
        return candidate;
      case "start":
        return start;
      case "confirm":
        return confirm;
      default:
        return null;
    }
  }
  