import thema from "./../assets/landing/thema.png"
import sticker1 from "./../assets/landing/sticker1.png"
import sticker2 from "./../assets/landing/sticker2.png"
import font from "./../assets/landing/font.png"
import write from "./../assets/landing/write.png"
import pencil from "./../assets/landing/pencil.png"
import schedule from "./../assets/landing/schedule.png"
import place from "./../assets/landing/place.png"
import marker1 from "./../assets/landing/marker1.png"
import marker2 from "./../assets/landing/marker2.png"
import wallet from "./../assets/landing/wallet.png"
import coin from "./../assets/landing/coin.png"
import cover from "./../assets/landing/cover.png"
import question from "./../assets/landing/question.png"
import coffee from "./../assets/landing/coffee.png"
import arrowUp from "./../assets/landing/Arrowup.png"
import chatbot from "./../assets/landing/chatbot.png"
import chim from "./../assets/landing/chim.png"
import price from "./../assets/landing/price.png"
import bank from "./../assets/landing/bank.png"
import account from "./../assets/landing/account.png"
import accountHolder from "./../assets/landing/accountHolder.png"



export function getLandingImg(imageName) {
    switch (imageName) {
        case "thema":
            return thema;
        case "sticker1":
            return sticker1;
        case "sticker2":
            return sticker2;
        case "font":
            return font;
        case "write":
            return write;
        case "pencil":
            return pencil;
        case "schedule":
            return schedule;
        case "place":
            return place;
        case "marker1":
            return marker1;
        case "marker2":
            return marker2;
        case "wallet":
            return wallet;
        case "coin":
            return coin;
        case "cover":
            return cover;
        case "question":
            return question;
        case "coffee":
            return coffee;
        case "account":
            return account;
        case "arrowUp":
            return arrowUp;
        case "chatbot":
            return chatbot;
        case "chim":
            return chim;
        case "price":
            return price;
        case "bank":
            return bank;
        case "accountHolder":
            return accountHolder;
        default:
            return null;
    }

}