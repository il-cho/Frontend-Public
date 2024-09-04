import emoji1 from "../assets/emoji/PartyPopper.png"
import emoji2 from "../assets/emoji/ConfettiBall.png"
import emoji3 from "../assets/emoji/twinkle.png"
import emoji4 from "../assets/emoji/white_heart.png"
import emoji5 from "../assets/emoji/pink-star-heart.png"
import emoji6 from "../assets/emoji/ChristmasTree.png"
import emoji7 from "../assets/emoji/JackOLantern.png"
import emoji8 from "../assets/emoji/UmbrellaOnGround.png"
import emoji9 from "../assets/emoji/Rainbow.png"
import emoji10 from "../assets/emoji/Star.png"
import emoji11 from "../assets/emoji/Pinata.png"
import emoji12 from "../assets/emoji/Errorface.png"

export function getEmoji(emojiId) {
    switch (emojiId) {
        case 1:
            return emoji1;
        case 2:
            return emoji2;
        case 3:
            return emoji3;
        case 4:
            return emoji4;
        case 5:
            return emoji5;
        case 6:
            return emoji6;
        case 7:
            return emoji7;
        case 8:
            return emoji8;
        case 9:
            return emoji9;
        case 10:
            return emoji10;
        case 11:
            return emoji11;
        case 12:
            return emoji12;
        default:
            return null;
    }
}