"use client";

import { ConvexReactClient } from "convex/react";
import { ReactNode, useEffect } from "react";
import { ConvexAuthNextjsProvider } from "@convex-dev/auth/nextjs";
import { useAuthActions } from "@convex-dev/auth/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexAuthNextjsProvider client={convex}>
      <AutoSignIn />
      {children}
    </ConvexAuthNextjsProvider>
  );
}

function AutoSignIn() {
  const { signIn } = useAuthActions();
  useEffect(() => {
    signIn("anonymous").catch(console.error);
  }, []);
  return null;
}
