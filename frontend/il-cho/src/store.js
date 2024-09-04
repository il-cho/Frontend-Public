import { create } from "zustand";
import { persist } from "zustand/middleware";

const useStore = create(
  (set) => ({
    userId: "",
    userName: "",
    userProfile: 0,
    invitationCode: "",
    dateRange: [null, null],
    attendNum: 1,

    setUserId: (id) => set({ userId: id }),
    setUserName: (id) => set({ userName: id }),
    setUserProfile: (id) => set({ userProfile: id }),
    setInvitationCode: (id) => set({ invitationCode: id }),
    setDateRange: (range) => set({ dateRange: range }),
    setAttendNum: (num) => set({ attendNum: num })
  }),
);

export default useStore;