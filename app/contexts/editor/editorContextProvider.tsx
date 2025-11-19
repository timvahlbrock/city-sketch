"use client";

import { PropsWithChildren, useState } from "react";
import { RankedNode, Section } from "@/app/contexts/editor/editorState";
import { EditorContext } from "@/app/contexts/editor/editorContext";

export default function EditorContextProvider({ children }: PropsWithChildren) {
  const [addedSections, setAddedSections] = useState<
    ReadonlyMap<number, Section>
  >(new Map());
  const [removedSections, setRemovedSections] = useState<ReadonlySet<number>>(
    new Set(),
  );

  const [addedNodes, setAddedNodes] = useState<
    ReadonlyMap<number, ReadonlyMap<number, RankedNode>>
  >(new Map());
  const [updatedNodes, setUpdatedNodes] = useState<
    ReadonlyMap<number, ReadonlyMap<number, RankedNode>>
  >(new Map());
  const [removedNodes, setRemovedNodes] = useState<
    ReadonlyMap<number, ReadonlySet<number>>
  >(new Map());

  return (
    <EditorContext
      value={{
        addedSections,
        addedNodes,
        removedSections,
        updatedNodes,
        removedNodes,
        addSections: (sections) =>
          setAddedSections((previous) => {
            const newMap = new Map(previous);
            sections.forEach((section) => newMap.set(section.id, section));
            return newMap;
          }),
        removeSections: (removedSections) =>
          setRemovedSections((previous) => {
            const newSet = new Set(previous);
            removedSections.forEach((section) => newSet.add(section));
            return newSet;
          }),
        addNodes: (sectionId, nodes) =>
          setAddedNodes((previous) => {
            const newMap = new Map(previous);
            const sectionMap = new Map(newMap.get(sectionId));
            nodes.forEach((node) => sectionMap.set(node.id, node));
            newMap.set(sectionId, sectionMap);
            return newMap;
          }),
        updateNodes: (sectionId, updatedNodes) =>
          setUpdatedNodes((previous) => {
            const newMap = new Map(previous);
            const sectionMap = new Map(newMap.get(sectionId));
            updatedNodes.forEach((node) => sectionMap.set(node.id, node));
            newMap.set(sectionId, sectionMap);
            return newMap;
          }),
        removeNodes: (sectionId, removedNodes) =>
          setRemovedNodes((previous) => {
            const newMap = new Map(previous);
            const sectionSet = new Set(newMap.get(sectionId));
            removedNodes.forEach((node) => sectionSet.add(node));
            newMap.set(sectionId, sectionSet);
            return newMap;
          }),
      }}
    >
      {children}
    </EditorContext>
  );
}
