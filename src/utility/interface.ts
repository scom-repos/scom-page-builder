export type IMergeDropSide = "front" | "back" | "top" | "bottom";
export type DragDropResultType = "move" | "merge";
export type DragDropResultDetails = {
    type: DragDropResultType;
    row?: HTMLElement;
    section?: HTMLElement;
    toolbar?: HTMLElement;
    dropSide?: IMergeDropSide;
    rowBlock?: HTMLElement;
    column?: number;
    columnSpan?: number;
    isMouseOn?: boolean;
    nearestPanel?: HTMLElement;
}

export type DragDropResult = {
    canDrop: boolean;
    details?: DragDropResultDetails;
};

export interface checkDragDropResultParams {
    dropTarget: HTMLElement,
    dragSection: HTMLElement,
    dragToolbar: HTMLElement,
    clientX: number,
    clientY: number,
    startX: number,
    isUngroup: boolean,
    isLayout: boolean,
    layoutLength?: number
}