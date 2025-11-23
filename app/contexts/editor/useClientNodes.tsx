import { RankedNode } from "@/app/types/rankedNodes";
import { useContext } from "react";
import { EditorContext } from "@/app/contexts/editor/editorContext";

export default function useClientNodes(
  sectionId: number,
  serverNodes: RankedNode[],
) {
  const { addedNodes, updatedNodes, removedNodes } = useContext(EditorContext);

  const serverNodeIds = serverNodes.map((serverNode) => serverNode.id);
  const addedNodesMap: ReadonlyMap<number, RankedNode> =
    addedNodes.get(sectionId) ?? new Map();

  return serverNodes
    .map((serverNode) => addedNodesMap.get(serverNode.id) ?? serverNode)
    .concat(
      Array.from(addedNodesMap.values()).filter(
        (node) => !serverNodeIds.includes(node.id),
      ),
    )
    .map((node) => updatedNodes.get(sectionId)?.get(node.id) ?? node)
    .filter((node) => !removedNodes.get(sectionId)?.has(node.id))
    .sort((a, b) => a.rank - b.rank);
}
