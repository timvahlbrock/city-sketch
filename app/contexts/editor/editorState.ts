export interface Section {
  id: number;
  // nodes: number[];
}

export interface Node {
  id: number;
  latitude: number;
  longitude: number;
}

export interface EditorState {
  addedSections: ReadonlyMap<number, Section>;
  addSections: (newSections: Section[]) => void;
  addedNodes: ReadonlyMap<number, Node>;
  addNodes: (newNodes: Node[]) => void;
  removedSections: ReadonlySet<number>;
  removeSections: (removedSectionIds: number[]) => void;
}
