"use client";

import { PropsWithChildren, useState } from "react";
import { EditorState } from "@/app/contexts/editorContext/editorState";
import EditorContext from "@/app/contexts/editorContext/editorContext";

export default function EditorContextProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<EditorState | null>(null);

  return (
    <EditorContext
      value={{
        state,
        setState,
      }}
    >
      {children}
    </EditorContext>
  );
}
