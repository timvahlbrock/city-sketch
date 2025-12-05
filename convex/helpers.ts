import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";
import { MutationCtx } from "@/convex/_generated/server";

export function notEmpty<TValue>(
  value: TValue | null | undefined,
): value is TValue {
  return value !== null && value !== undefined;
}

export async function getUserIdOrThrow(ctx: MutationCtx) {
  const id = await getAuthUserId(ctx);
  if (!id) {
    throw new ConvexError({ code: 401 });
  }
  return id;
}
