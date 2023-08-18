export type IMergeDropSide = "front" | "back" | "top" | "bottom";
export type DragDropResultDetails = {
    section?: HTMLElement;
    toolbar?: HTMLElement;
    dropSide?: IMergeDropSide;
    rowBlock?: HTMLElement;
    column?: number;
    columnSpan?: number;
}

export type DragDropResult = {
    canDrop: boolean;
    details?: DragDropResultDetails
};

export interface checkDragDropResultParams {
    dropTarget: HTMLElement,
    dragSection: HTMLElement,
    dragToolbardata: any,
    clientX: number, 
    clientY: number, 
    startX: number
    isUngroup: boolean
}