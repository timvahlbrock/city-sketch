"use client";

import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

export function useCreateVision() {
  return useMutation(api.visions.create);
}
