import { atom } from "recoil";

export const configration = atom({
  key: "constraints",
  default: {
    video: true,
    audio: true,
  }
});

export const mic = atom({
  key: "isMic",
  default: false,
});

export const video = atom({
  key: "isVideo",
  default: false,
});

export const voice = atom({
  key: "isVoice",
  default: false,
});
