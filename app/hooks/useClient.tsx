import { createFrontendClient } from "@/app/utils/createFrontendClient";
import { useMemo } from "react";

export default function useClient() {
  return useMemo(() => createFrontendClient(), []);
}
