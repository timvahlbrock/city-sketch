"use client";

import { createContext } from "react";
import { EditorState } from "@/app/contexts/editorContext/editorState";

export interface EditorContext {
  state: EditorState | null;
  setState: (editorState: EditorState | null) => void;
}

export const editorContext = createContext<EditorContext>({
  state: null,
  setState: () => {
    void 0;
  },
});

export default editorContext;
