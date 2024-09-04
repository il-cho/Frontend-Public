import kookmin from "./../assets/bankicon/1.png"
import sinhan from "./../assets/bankicon/2.png"
import hana from "./../assets/bankicon/3.png"
import woori from "./../assets/bankicon/4.png"
import ibk from "./../assets/bankicon/5.png"
import sc from "./../assets/bankicon/6.png"
import nonghyup from "./../assets/bankicon/7.png"
import kakao from "./../assets/bankicon/8.png"
import toss from "./../assets/bankicon/9.png"
import k from "./../assets/bankicon/10.png"

export function getBankIcon(bankId) {
  switch (bankId) {
    case 1:
      return kookmin;
    case 2:
      return sinhan;
    case 3:
      return hana;
    case 4:
      return woori;
    case 5:
      return ibk;
    case 6:
      return sc;
    case 7:
      return nonghyup;
    case 8:
      return kakao;
    case 9:
      return toss;
    case 10:
      return k;
  }
}
