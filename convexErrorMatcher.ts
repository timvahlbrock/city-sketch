import { ConvexError } from "convex/values";
import { expect } from "vitest";

export function convexErrorWithCode(code: number) {
  return expect.toSatisfy(function convexErrorWithCodeChecker(received) {
    return (
      received instanceof ConvexError && JSON.parse(received.data).code === code
    );
  });
}
