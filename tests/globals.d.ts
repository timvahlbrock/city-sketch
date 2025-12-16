import { IMapHelper } from "@/tests/mapHelper";

declare global {
  interface Window {
    mapHelper: IMapHelper;
  }
}
