import arrowUp from "./../assets/arrow_drop_up.png"
import arrowDown from "./../assets/arrow_drop_down.png"
import copy from "./../assets/Copy.png"

export function getViewImage(IconIndex) {
    switch (IconIndex) {
        case "arrowUp":
            return arrowUp;
        case "arrowDown":
            return arrowDown;
        case "copy":
            return copy;
        default:
            null;
    }
}