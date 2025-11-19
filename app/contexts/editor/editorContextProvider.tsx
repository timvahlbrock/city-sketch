"use client";

import { PropsWithChildren, useState } from "react";
import { Node, Section } from "@/app/contexts/editor/editorState";
import { EditorContext } from "@/app/contexts/editor/editorContext";

export default function EditorContextProvider({ children }: PropsWithChildren) {
  const [addedSections, setAddedSections] = useState<
    ReadonlyMap<number, Section>
  >(new Map());
  const [addedNodes, setAddedNodes] = useState<ReadonlyMap<number, Node>>(
    new Map(),
  );
  const [removedSections, setRemovedSections] = useState<ReadonlySet<number>>(
    new Set(),
  );

  return (
    <EditorContext
      value={{
        addedSections,
        addedNodes,
        removedSections,
        addSections: (sections) =>
          setAddedSections((previous) => {
            const newMap = new Map(previous);
            sections.forEach((section) => newMap.set(section.id, section));
            return newMap;
          }),
        addNodes: (nodes) =>
          setAddedNodes((previous) => {
            const newMap = new Map(previous);
            nodes.forEach((node) => newMap.set(node.id, node));
            return newMap;
          }),
        removeSections: (removedSections) =>
          setRemovedSections((previous) => {
            const newSet = new Set(previous);
            removedSections.forEach((section) => newSet.add(section));
            return newSet;
          }),
      }}
    >
      {children}
    </EditorContext>
  );
}
