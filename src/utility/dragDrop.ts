import { IMergeDropSide, DragDropResult, DragDropResultDetails, checkDragDropResultParams } from './interface'
// import { GAP_WIDTH } from '../interface/index';
import { Control } from '@ijstech/components'
import { pageObject } from "../store/index";

export const checkDragDropResult = (dragDrop: checkDragDropResultParams): DragDropResult => {
    if (!dragDrop.dropTarget) return { canDrop: false };

    const dropRow = dragDrop.dropTarget.closest('ide-row') as any;
    const rowRect = dropRow.getBoundingClientRect();

    // case 1: mouse on/near the top/bottom block of row
    const INNER_LIMIT = 15;
    const OUTER_LIMIT = 3;
    if (dragDrop.clientY >= rowRect.top - OUTER_LIMIT && dragDrop.clientY <= rowRect.top + INNER_LIMIT) {
        // mouse is on the top row block
        return {
            canDrop: true,
            details: {
                type: 'move',
                rowBlock: dropRow.querySelector('.row-top-block')
            }
        };
    } else if (dragDrop.clientY >= rowRect.bottom - INNER_LIMIT && dragDrop.clientY <= rowRect.bottom + OUTER_LIMIT) {
        // mouse is on the bottom row block
        return {
            canDrop: true,
            details: {
                type: 'move',
                rowBlock: dropRow.querySelector('.row-bottom-block')
            }
        };
    }

    // if it is ungroup, need to include the current section
    const mouseOnSection = dragDrop.isUngroup || !dragDrop.dragSection ?
        findNearestSectionInRow(dropRow, dragDrop.clientX, dragDrop.clientY, true) :
        findNearestSectionInRow(dropRow, dragDrop.clientX, dragDrop.clientY, true, [dragDrop.dragSection.id]);

    if (mouseOnSection) {
        // case 0: drag from toolbar to an element
        const nearestToolbar = (!dragDrop.dragSection) ?
            findNearestToolbarInSection(mouseOnSection, dragDrop.clientY, dragDrop.clientX, false) :
            findNearestToolbarInSection(mouseOnSection, dragDrop.clientY, dragDrop.clientX, false, [dragDrop.dragToolbar.id]);

        if (!nearestToolbar) return { canDrop: false }

        // case 2: mouse on other section (group, ungroup to another widget group)
        // or
        // case 3 mouse on same section (move, ungroup to itself)
        const mergeSide = decideMergeSide(nearestToolbar, dragDrop.clientX, dragDrop.clientY);
        if (mergeSide == "top" || mergeSide == "bottom") {
            return {
                canDrop: true,
                details: {
                    type: 'merge',
                    toolbar: nearestToolbar,
                    dropSide: mergeSide,
                    isMouseOn: true
                }
            };
        } else if (mergeSide == "back" || mergeSide == "front") {
            const isFront = mergeSide == "front" ? true : false;
            const dragSectionCol = dragDrop.dragSection ? parseInt((dragDrop.dragSection as any).dataset.column) : 4;
            const dragSectionColSpan = dragDrop.dragSection ? parseInt((dragDrop.dragSection as any).dataset.columnSpan) : 4;
            const dropFrontBackResult = getDropFrontBackResult(dropRow, mouseOnSection, dragSectionCol, dragSectionColSpan, isFront, dragDrop.dragToolbar?.dataset);
            // check if it can merge with the drop section
            if (dropFrontBackResult) {
                return {
                    canDrop: true,
                    details: {
                        type: 'move',
                        section: mouseOnSection,
                        dropSide: mergeSide,
                        column: dropFrontBackResult.newElmdata.column,
                        columnSpan: dropFrontBackResult.newElmdata.columnSpan,
                        isMouseOn: true
                    }
                }
            } else {
                return { canDrop: false }
            }
        }
    } else {
        const fromSidebar: boolean = (!dragDrop.dragSection) ? true : false;
        const nearestPanel = findNearestFixedGridInRow(dragDrop.clientX, dragDrop.dropTarget);

        const rowId = dragDrop.dropTarget.closest('ide-row').id.replace('row-', "")
        const rowData = pageObject.getSection(rowId);

        let dropOutSide = false;
        if (nearestPanel) {
            const nearestPanelCol = parseInt(nearestPanel.getAttribute("data-column"))
            if (nearestPanelCol == 1) {
                if (rowData.elements.find(elm => elm.column == 1)) dropOutSide = true;
            } else if (nearestPanelCol == 12) {
                if (rowData.elements.find(elm => (elm.column + elm.columnSpan - 1 == 12))) dropOutSide = true;
            }
        }

        // case 4: mouse on empty space
        if (nearestPanel && !dropOutSide) {
            if (fromSidebar) {
                return { canDrop: true, details: { type: 'move', nearestPanel: nearestPanel } }
            } else {
                // check if collide
                const collidedSection = checkCollisionIfDropOnGrid(dragDrop, dropRow);
                if (collidedSection) {
                    const collidedSectionBound = collidedSection.getBoundingClientRect();
                    const isFront = (dragDrop.clientX < collidedSectionBound.left) ? true : false;
                    const dragSectionCol = dragDrop.dragSection ? parseInt((dragDrop.dragSection as any).dataset.column) : 4;
                    const dragSectionColSpan = dragDrop.dragSection ? parseInt((dragDrop.dragSection as any).dataset.columnSpan) : 4;
                    const dropFrontBackResult = getDropFrontBackResult(dropRow, collidedSection, dragSectionCol, dragSectionColSpan, isFront, dragDrop.dragToolbar?.dataset);
                    return {
                        canDrop: true,
                        details: {
                            type: 'move',
                            section: collidedSection,
                            dropSide: isFront ? "front" : "back",
                            column: dropFrontBackResult.newElmdata.column,
                            columnSpan: dropFrontBackResult.newElmdata.columnSpan,
                            isMouseOn: false
                        }
                    }
                } else {
                    const nearestPanel = findNearestFixedGridInRow(dragDrop.clientX, dragDrop.dropTarget);
                    return { canDrop: true, details: { type: 'move', nearestPanel: nearestPanel } }
                }
            }
        } else if (dropOutSide) {
            // if drop outside of grid, append a new row
            const dropRow = dragDrop.dropTarget.closest('ide-row');
            return {
                canDrop: true,
                details: {
                    type: 'move',
                    rowBlock: dropRow.querySelector('.row-bottom-block')
                }
            };
        } else {
            // if drop under all rows, append a new row
            const pnlEditor = dragDrop.dropTarget.closest('#pnlEditor');
            const rows = pnlEditor.querySelectorAll('ide-row');
            const lastRow = rows[rows.length - 1];
            return {
                canDrop: true,
                details: {
                    type: 'move',
                    rowBlock: lastRow.querySelector('.row-bottom-block')
                }
            };
        }
    }
}

// const getDropResultOnEmptyRow = (dragDrop: checkDragDropResultParams): { column: number, columnSpan: number } => {

//     let target: Control = findNearestFixedGridInRow(dragDrop.clientX, dragDrop.dropTarget);

//     // if (collision.collisionType == 'self') target = findNearestFixedGridInRow(clientX);
//     // else target = enterTarget.closest('.fixed-grid-item') as Control;
//     const dropRow = target.closest('ide-row') as any;
//     let offsetLeft = Math.floor((dragDrop.startX + GAP_WIDTH) / (dropRow.gridColumnWidth + GAP_WIDTH));

//     const targetCol = Number(target.dataset.column);
//     const column = targetCol - offsetLeft > 0 ? targetCol - offsetLeft : targetCol
//     const columnSpan = dragDrop.dragSection && dragDrop.dragSection.dataset.columnSpan
//         ? Number(dragDrop.dragSection.dataset.columnSpan)
//         : INIT_COLUMN_SPAN;
//     let colSpan = Math.min(columnSpan, dropRow.maxColumn);
//     let colStart = Math.min(column, dropRow.maxColumn);
//     const sections = Array.from(dropRow?.querySelectorAll('ide-section'));
//     const sortedSections = sections.sort(
//         (a: HTMLElement, b: HTMLElement) => Number(b.dataset.column) - Number(a.dataset.column)
//     );
//     let spaces = 0;
//     let findedSection = null;
//     let isUpdated: boolean = false;
//     // const isFromToolbar = !self.currentElement?.id;
//     for (let i = 0; i < sortedSections.length; i++) {
//         const section = sortedSections[i] as Control;
//         const sectionColumn = Number(section.dataset.column);
//         const sectionColumnSpan = Number(section.dataset.columnSpan);
//         const sectionData = sectionColumn + sectionColumnSpan;
//         if (colStart >= sectionData && (dropRow.maxColumn - colStart) + 1 < colSpan && !isUpdated) {
//             colStart = sectionData;
//             isUpdated = true;
//         }
//         const colData = colStart + colSpan;
//         if ((colStart >= sectionColumn && colData <= sectionData) || (colStart < sectionData && colData > sectionData)) {
//             findedSection = section;
//         }
//         if (dragDrop.dragSection?.id !== section.id) {
//             spaces += sectionColumnSpan;
//         }
//     }

//     return {
//         column: colStart,
//         columnSpan: Math.min(columnSpan, MAX_COLUMN - spaces)
//     }
// }

const checkCollisionIfDropOnGrid = (dragDrop: checkDragDropResultParams, dropRow: any) => {
    const nearestCol = findNearestFixedGridInRow(dragDrop.clientX, dragDrop.dropTarget);
    // drop/dragover outside grid
    if (!nearestCol) return;

    const dropColumn: number = parseInt(nearestCol.getAttribute('data-column'));
    const grid = dragDrop.dropTarget.closest('.grid');
    // drop/dragover outside grid
    if (!grid) return;

    const sections: HTMLElement[] = Array.from(grid.querySelectorAll('ide-section'));
    const sortedSections: HTMLElement[] = sections.sort(
        (a: HTMLElement, b: HTMLElement) => Number(a.dataset.column) - Number(b.dataset.column)
    );

    const gridColumnWidth = (dropRow as any).gridColumnWidth

    const offsetLeft = Math.floor((dragDrop.startX + 15/*GAP_WIDTH*/) / (gridColumnWidth + 15/*GAP_WIDTH*/));
    const startOfDragingElm: number = dropColumn - offsetLeft;
    const endOfDragingElm: number = dragDrop.dragSection ? (dropColumn - offsetLeft + parseInt(dragDrop.dragSection.dataset.columnSpan) - 1) : (dropColumn - offsetLeft + 4 - 1);

    for (let i = 0; i < sortedSections.length; i++) {
        const element = sortedSections[i];
        const condition = dragDrop.isUngroup ? true : element.id != dragDrop.dragSection.id;
        if (condition && element) {
            const startOfDroppingElm: number = parseInt(element.dataset.column);
            const endOfDroppingElm: number = parseInt(element.dataset.column) + parseInt(element.dataset.columnSpan) - 1;
            const condition1: boolean = startOfDragingElm >= startOfDroppingElm && startOfDragingElm <= endOfDroppingElm;
            const condition2: boolean = startOfDroppingElm >= startOfDragingElm && startOfDroppingElm <= endOfDragingElm;

            // overlap with other section
            if (condition1 || condition2) {
                return element;
            }
        }
    }
}

const findNearestFixedGridInRow = (clientX: number, dropTarget: HTMLElement) => {
    const pnlRow = dropTarget.closest('ide-row');
    const elements = pnlRow.querySelectorAll('.fixed-grid-item');

    let nearestElement = null;
    let minDistance = Number.MAX_VALUE;

    elements.forEach((element) => {
        const bounds = element.getBoundingClientRect();
        const distanceLeft = Math.abs(bounds.left - clientX);
        const distanceRight = Math.abs(bounds.right - clientX);
        if (distanceLeft < minDistance) {
            minDistance = distanceLeft;
            nearestElement = element;
        }
        if (distanceRight < minDistance) {
            minDistance = distanceRight;
            nearestElement = element;
        }
    });
    return nearestElement;
}

const findNearestToolbarInSection = (section: Control, clientY: number, clientX: number, mouseOn: boolean, excludingToolbarId?: string[]): any => {
    if (mouseOn) {
        const toolbars = section.querySelectorAll('ide-toolbar');
        for (let i = 0; i < toolbars.length; i++) {
            const sectionBound = toolbars[i].getBoundingClientRect();
            const checkExcludingToolbar = excludingToolbarId ? !excludingToolbarId.includes(toolbars[i].id) : true;
            if (checkExcludingToolbar &&
                sectionBound.top <= clientY && sectionBound.bottom >= clientY &&
                sectionBound.left <= clientX && sectionBound.right >= clientX) {
                return toolbars[i] as any;
            }
        }
    } else {
        const toolbars = section.querySelectorAll('ide-toolbar');
        if (toolbars.length === 0) {
            return null; // Return null for an empty list of elements
        }

        let nearestDistance = Infinity;
        let nearestToolbar = null;

        for (const toolbar of toolbars) {
            const checkExcludingToolbar = excludingToolbarId ? !excludingToolbarId.includes(toolbar.id) : true;
            if (checkExcludingToolbar) {
                const sectionRect = (toolbar as HTMLElement).getBoundingClientRect();
                const topPoint = sectionRect.top;
                const bottomPoint = sectionRect.right;

                // Calculate the distances between the point and both the left and right points of the element
                const topDistance = Math.abs(topPoint - clientY);
                const bottomDistance = Math.abs(bottomPoint - clientY);

                // Check if the left point is nearer than the current nearest point
                if (topDistance < nearestDistance) {
                    // isFront = true;
                    nearestDistance = topDistance;
                    nearestToolbar = toolbar;
                }

                // Check if the right point is nearer than the current nearest point
                if (bottomDistance < nearestDistance) {
                    // isFront = false;
                    nearestDistance = bottomDistance;
                    nearestToolbar = toolbar;
                }
            }
        }
        return nearestToolbar as any;
    }
}

const findNearestSectionInRow = (row: any, clientX: number, clientY: number, mouseOn: boolean, excludingSectionId?: string[]) => {
    if (mouseOn) {
        const sections = row.querySelectorAll('ide-section');
        for (let i = 0; i < sections.length; i++) {
            const sectionBound = sections[i].getBoundingClientRect();
            const checkExcludingSection = excludingSectionId ? !excludingSectionId.includes(sections[i].id) : true;
            if (checkExcludingSection &&
                sectionBound.top <= clientY && sectionBound.bottom >= clientY &&
                sectionBound.left <= clientX && sectionBound.right >= clientX) {
                return sections[i] as any;
            }
        }
    } else {
        const sections = row.querySelectorAll('ide-section');
        if (sections.length === 0) {
            return null; // Return null for an empty list of elements
        }

        let nearestDistance = Infinity;
        let nearestSection = null;

        for (const section of sections) {
            const checkExcludingSection = excludingSectionId ? !excludingSectionId.includes(section.id) : true;
            if (checkExcludingSection) {
                const sectionRect = (section as HTMLElement).getBoundingClientRect();
                const leftPoint = sectionRect.left;
                const rightPoint = sectionRect.right;

                // Calculate the distances between the point and both the left and right points of the element
                const leftDistance = Math.abs(leftPoint - clientX);
                const rightDistance = Math.abs(rightPoint - clientX);

                // Check if the left point is nearer than the current nearest point
                if (leftDistance < nearestDistance) {
                    // isFront = true;
                    nearestDistance = leftDistance;
                    nearestSection = section;
                }

                // Check if the right point is nearer than the current nearest point
                if (rightDistance < nearestDistance) {
                    // isFront = false;
                    nearestDistance = rightDistance;
                    nearestSection = section;
                }
            }
        }
        return nearestSection as any;
    }
}

const decideMergeSide = (dropToolbar: HTMLElement, clientX: number, clientY: number): IMergeDropSide => {
    let rect = dropToolbar.getBoundingClientRect();
    let offsetX = clientX - rect.left;
    let offsetY = clientY - rect.top;

    if (offsetY <= rect.height * 0.3) return 'top';
    else if (offsetY >= rect.height * 0.7) return 'bottom';
    else if (offsetX <= rect.width * 0.5) return 'front';
    else return 'back';
}

const getDropFrontBackResult = (dropRow: any, nearestDropSection: any, dragSectionCol: number,
    dragSectionColSpan: number, isFront: boolean, data: any): { newElmdata: any, newRowData: any } => {
    // drop on the back/front block of a section
    const dropRowId = dropRow.id.replace('row-', '')
    const dropRowData = pageObject.getRow(dropRowId);
    const MAX_COLUMN = pageObject.getColumnsNumber(dropRowId);

    // if the space left is enough: simply ungroup it
    const sortedSectionList = dropRowData.elements.sort((a, b) => a.column - b.column);
    // const dragSectionIdx = sortedSectionList.findIndex((e) => e.column === parseInt(data.column));
    const dropSectionIdx = sortedSectionList.findIndex((e) => e.column === parseInt(nearestDropSection.data.column));
    // drag to front block and ungroup
    const frontLimit: number = isFront ?
        (dropSectionIdx == 0) ? 1 : sortedSectionList[dropSectionIdx - 1].column + sortedSectionList[dropSectionIdx - 1].columnSpan :
        sortedSectionList[dropSectionIdx].column + sortedSectionList[dropSectionIdx].columnSpan;

    const backLimit: number = isFront ?
        sortedSectionList[dropSectionIdx].column - 1 :
        (dropSectionIdx == sortedSectionList.length - 1) ? MAX_COLUMN : sortedSectionList[dropSectionIdx + 1].column - 1;

    const emptySpace = backLimit - frontLimit + 1;

    // the columnSpan of new element should be same with the original section's
    if (emptySpace >= dragSectionColSpan) {
        // have enough space to place the dragging toolbar
        const newColumn = isFront ?
            sortedSectionList[dropSectionIdx].column - dragSectionColSpan :
            sortedSectionList[dropSectionIdx].column + sortedSectionList[dropSectionIdx].columnSpan;
        const newElData = {
            id: data.id,
            column: newColumn,
            columnSpan: dragSectionColSpan,
            properties: data.properties,
            module: data.module,
            tag: data.tag
        };
        return {
            newElmdata: newElData,
            newRowData: undefined
        };

    } else if (emptySpace >= 1) {
        // no enough space to place the dragging toolbar
        // if emptySpace>=1, resize the dragging element to fit the space
        const newElData = {
            id: data.id,
            column: frontLimit,
            columnSpan: emptySpace,
            properties: data.properties,
            module: data.module,
            tag: data.tag
        };
        return {
            newElmdata: newElData,
            newRowData: undefined
        };

    } else {
        // if no any space, check if moving the current section can allocate enough space for the new section
        const softBackLimit = (dropSectionIdx == sortedSectionList.length - 1) ? MAX_COLUMN : sortedSectionList[dropSectionIdx + 1].column - 1;
        const softFrontLimit = (dropSectionIdx == 0) ? 1 : sortedSectionList[dropSectionIdx - 1].column + sortedSectionList[dropSectionIdx - 1].columnSpan;
        const softEmptySpace = isFront ?
            softBackLimit - frontLimit + 1 :
            backLimit - softFrontLimit + 1;

        if (softEmptySpace >= dragSectionColSpan + sortedSectionList[dropSectionIdx].columnSpan) {
            // if moving the current section can allocate enough space for the new section, do it

            // move the currect section
            const sortedSectionListDeepCopy = JSON.parse(JSON.stringify(sortedSectionList));
            sortedSectionListDeepCopy[dropSectionIdx].column = isFront ?
                frontLimit + dragSectionColSpan :
                MAX_COLUMN - dragSectionColSpan * 2 + 1;

            const dropRowDataDeepCopy = JSON.parse(JSON.stringify(dropRowData));
            dropRowDataDeepCopy.elements = sortedSectionListDeepCopy

            // add new section
            const newColumn = isFront ?
                frontLimit :
                MAX_COLUMN - sortedSectionList[dropSectionIdx].columnSpan + 1;

            const newElData = {
                id: data.id,
                column: newColumn,
                columnSpan: dragSectionColSpan,
                properties: data.properties,
                module: data.module,
                tag: data.tag
            };
            return {
                newElmdata: newElData,
                newRowData: dropRowDataDeepCopy
            };

        } else if (sortedSectionList[dropSectionIdx].columnSpan != 1) {
            // if moving the current section cannot allocate enough space for the new section,
            // check if the current section colSpan = 1

            // if the current section colSpan != 1, current section collapse to allocate space for new elm

            const splitIndex = Math.ceil(softEmptySpace / 2);

            // resize & move the currect section
            const sortedSectionListDeepCopy = JSON.parse(JSON.stringify(sortedSectionList));

            sortedSectionListDeepCopy[dropSectionIdx].column = isFront ?
                frontLimit + splitIndex :
                softFrontLimit;

            sortedSectionListDeepCopy[dropSectionIdx].columnSpan = isFront ?
                softEmptySpace - splitIndex :
                splitIndex;

            const newRowData = {
                id: (dropRowData as any).id,
                row: (dropRowData as any).row,
                elements: sortedSectionListDeepCopy
            }

            // add new section
            const newColumn = isFront ?
                frontLimit :
                softFrontLimit + splitIndex;

            const newColumnSpan = isFront ?
                splitIndex :
                softEmptySpace - splitIndex;

            const newElData = {
                id: data?.id,
                column: newColumn,
                columnSpan: newColumnSpan,
                properties: data?.properties,
                module: data?.module,
                tag: data?.tag
            };
            return {
                newElmdata: newElData,
                newRowData: newRowData
            };

        } else {
            // if the current section colSpan == 1, cannot resize and ungroup
            return;
        }
    }
}

const distributeElementsEvenly = (numberOfElement: number, numberOfColumn: number): number[] => {
    const elementsPerColumn = Math.floor(numberOfElement / numberOfColumn);
    const extraElements = numberOfElement % numberOfColumn;

    const distribution: number[] = [];

    for (let column = 0; column < numberOfColumn; column++) {
        const columnElements = elementsPerColumn + (column < extraElements ? 1 : 0);
        distribution.push(columnElements);
    }

    return distribution;
}

const resizeDefaultLayout = (column: number, columnSpan: number, elmList: any[]) => {
    const resizedDefaultLayout = elmList;
    const sortedElmList = elmList.slice().sort((a, b) => Number(a.column) - Number(b.column));

    // const elmListStartCol = sortedElmList[0].column;
    // const elmListEndCol = sortedElmList[sortedElmList.length - 1].column + sortedElmList[sortedElmList.length - 1].columnSpan - 1;
    // const elmListColumn = elmListStartCol;
    // const elmListColumnSpan = elmListEndCol - elmListStartCol + 1;

    const distribution = distributeElementsEvenly(sortedElmList.length, columnSpan);

    let endOfElms = column;
    for (let i = 0; i < sortedElmList.length; i++) {
        resizedDefaultLayout[i].column = endOfElms;
        resizedDefaultLayout[i].columnSpan = endOfElms + distribution[i] - 1;
        endOfElms += endOfElms + distribution[i];
    }

    return resizedDefaultLayout;
}

export {
    findNearestSectionInRow,
    getDropFrontBackResult,
    resizeDefaultLayout
}
