import { atom } from "recoil";

export const isLoadingAtom = atom<boolean>({
  key: "isLoading",
  default: false,
});
