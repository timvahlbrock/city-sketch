import { createContext } from "react";
import { EditorState } from "@/app/contexts/editor/editorState";

export const EditorContext = createContext<EditorState>({
  addedSections: new Map(),
  addedNodes: new Map(),
  addNodes: () => {
    void 0;
  },
  addSections: () => {
    void 0;
  },
  removedSections: new Set(),
  removeSections: () => {
    void 0;
  },
  removedNodes: new Map(),
  removeNodes: () => {
    void 0;
  },
  updatedNodes: new Map(),
  updateNodes: () => {
    void 0;
  },
});
