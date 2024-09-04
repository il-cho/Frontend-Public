import profile1 from "./../assets/profile/profile1.png";
import profile2 from "./../assets/profile/profile2.png";
import profile3 from "./../assets/profile/profile3.png";
import profile4 from "./../assets/profile/profile4.png";
import profile5 from "./../assets/profile/profile5.png";

export function getUserProfile(profile) {
  switch (profile) {
    case 1:
      return profile1;
    case 2:
      return profile2;
    case 3:
      return profile3;
    case 4:
      return profile4;
    case 5:
      return profile5;
    default:
      return null;
  }
}
