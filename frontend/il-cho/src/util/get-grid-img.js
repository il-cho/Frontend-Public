import delImg from "./../assets/delete.png"
import enterImg from "./../assets/enter.png"

export function getGridImg(imageIndex) {
    switch (imageIndex) {
        case 0:
            return delImg;
        case 1:
            return enterImg;
        default:
            return null;
    }

}