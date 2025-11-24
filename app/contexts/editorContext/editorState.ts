export type EditorState = AddingNodeState | RemovingSectionState;

export interface AddingNodeState {
  stateType: "addingNode";
}

export interface RemovingSectionState {
  stateType: "removeSection";
}
