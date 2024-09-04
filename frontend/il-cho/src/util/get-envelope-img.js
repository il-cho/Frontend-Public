import env_front from "./../assets/envelope - front.png"
import env_back from "./../assets/envelope - back.png"

export function getEnvelopeImg(imageIndex) {
    switch (imageIndex) {
        case "front":
            return env_front;
        case "back":
            return env_back;
        default:
            return null;
    }

}