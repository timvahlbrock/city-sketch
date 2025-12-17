import { IMapHelper } from "@/e2e/mapHelper";

declare global {
  interface Window {
    mapHelper: IMapHelper;
  }
}
