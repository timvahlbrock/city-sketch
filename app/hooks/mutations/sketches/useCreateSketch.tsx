"use client";

import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

export function useCreateSketch() {
  return useMutation(api.sketches.create);
}
