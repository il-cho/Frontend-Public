import cover1 from "./../assets/cover_1.png";
import cover2 from "./../assets/cover_2.png";
import cover3 from "./../assets/cover_3.png";
import cover4 from "./../assets/cover_4.png";
import cover5 from "./../assets/cover_5.png";
import cover6 from "./../assets/cover_6.png";
import cover7 from "./../assets/cover_7.png";
import cover8 from "./../assets/cover_8.png";
import cover9 from "./../assets/cover_9.png";
import addImage from "./../assets/addImage.png";

export function getCoverImage(coverId) {
  switch (coverId) {
    case 0:
      return addImage;
    case 1:
      return cover1;
    case 2:
      return cover2;
    case 3:
      return cover3;
    case 4:
      return cover4;
    case 5:
      return cover5;
    case 6:
      return cover6;
    case 7:
      return cover7;
    case 8:
      return cover8;
    case 9:
      return cover9;
    default:
      return null;
  }
}
