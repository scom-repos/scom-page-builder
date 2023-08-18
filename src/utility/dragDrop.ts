import { IMergeDropSide, DragDropResult, DragDropResultDetails, checkDragDropResultParams } from './type'
import { IPageElement, IPageSection, GAP_WIDTH, IPageSectionConfig, INIT_COLUMN_SPAN, MAX_COLUMN } from '../interface/index';
import { PageRow, PageSection } from '../page'
import { Control } from '@ijstech/components'
import { IDEToolbar } from '../common'
import { pageObject } from "../store/index";

export function checkDragDropResult(dragDrop: checkDragDropResultParams): DragDropResult {
    if (!dragDrop.dropTarget || !dragDrop.dragSection) return { canDrop: false };

    const dropRow = dragDrop.dropTarget.closest('ide-row') as PageRow;
    const rowRect = dropRow.getBoundingClientRect();

    // case 1: mouse on/near the top/bottom block of row
    const INNER_LIMIT = 15;
    const OUTER_LIMIT = 3;
    if (dragDrop.clientY >= rowRect.top - OUTER_LIMIT && dragDrop.clientY <= rowRect.top + INNER_LIMIT) {
        // mouse is on the top row block
        return {
            canDrop: true,
            details: {
                rowBlock: dropRow.querySelector('.row-top-block')
            }
        };
    } else if (dragDrop.clientY >= rowRect.bottom - INNER_LIMIT && dragDrop.clientY <= rowRect.bottom + OUTER_LIMIT) {
        // mouse is on the bottom row block
        return {
            canDrop: true,
            details: {
                rowBlock: dropRow.querySelector('.row-bottom-block')
            }
        };
    }

    // case 0: drag from toolbar
    // if (!dragDrop.dragSection) {
    // }

    // if it is ungroup, need to include the current section
    const mouseOnSection = dragDrop.isUngroup ?
        findNearestSectionInRow(dropRow, dragDrop.clientX, dragDrop.clientY, true) :
        findNearestSectionInRow(dropRow, dragDrop.clientX, dragDrop.clientY, true, [dragDrop.dragSection.id]);

    if (mouseOnSection) {
        // case 2: mouse on other section (group, ungroup to another widget group)
        // or
        // case 3 mouse on same section (move, ungroup to itself)
        const nearestToolbar = findNearestToolbarInSection(mouseOnSection, dragDrop.clientY, dragDrop.clientX, false);
        if (!nearestToolbar) return;
        const mergeSide = decideMergeSide(nearestToolbar.toolbar, dragDrop.clientX, dragDrop.clientY);
        if (mergeSide == "top" || mergeSide == "bottom") {
            return {
                canDrop: true,
                details: {
                    toolbar: nearestToolbar.toolbar,
                    dropSide: mergeSide
                }
            };
        } else if (mergeSide == "back" || mergeSide == "front") {
            const isFront = mergeSide == "front" ? true : false;
            const dropFrontBackResult = getDropFrontBackResult(dropRow, mouseOnSection, dragDrop.dragSection, isFront, dragDrop.dragToolbardata);
            // check if it can merge with the drop section
            if (dropFrontBackResult) {
                return {
                    canDrop: true,
                    details: {
                        section: mouseOnSection,
                        dropSide: mergeSide,
                        column: dropFrontBackResult.newElmdata.column,
                        columnSpan: dropFrontBackResult.newElmdata.columnSpan
                    }
                }
            } else {
                return { canDrop: false }
            }
        }
    } else {
        // case 4: mouse on empty space

        // check if collide
        const collidedSection = checkCollisionIfDropOnGrid(dragDrop, dropRow);
        if (collidedSection) {
            const collidedSectionBound = collidedSection.getBoundingClientRect();
            const isFront = (dragDrop.clientX < collidedSectionBound.left) ? true : false;
            const dropFrontBackResult = getDropFrontBackResult(dropRow, collidedSection, dragDrop.dragSection, isFront, dragDrop.dragToolbardata);
            return {
                canDrop: true,
                details: {
                    section: collidedSection,
                    dropSide: isFront ? "front" : "back",
                    column: dropFrontBackResult.newElmdata.column,
                    columnSpan: dropFrontBackResult.newElmdata.columnSpan
                }
            }
        } else {
            return { canDrop: true }
        }
    }
}

function checkCollisionIfDropOnGrid(dragDrop: checkDragDropResultParams, dropRow: PageRow) {
    const nearestCol = findNearestFixedGridInRow(dragDrop.clientX, dragDrop.dropTarget);
    const dropColumn: number = parseInt(nearestCol.getAttribute('data-column'));
    const grid = dragDrop.dropTarget.closest('.grid');
    // drop/dragover outside grid

    const sections: HTMLElement[] = Array.from(grid?.querySelectorAll('ide-section'));
    const sortedSections: HTMLElement[] = sections.sort(
        (a: HTMLElement, b: HTMLElement) => Number(a.dataset.column) - Number(b.dataset.column)
    );

    const gridColumnWidth = (dropRow as PageRow).gridColumnWidth

    const offsetLeft = Math.floor((dragDrop.startX + GAP_WIDTH) / (gridColumnWidth + GAP_WIDTH));
    const startOfDragingElm: number = dropColumn - offsetLeft;
    const endOfDragingElm: number = dropColumn - offsetLeft + parseInt(dragDrop.dragSection.dataset.columnSpan) - 1;

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

function findNearestFixedGridInRow(clientX: number, dropTarget: HTMLElement) {
    const pnlRow = dropTarget.closest('#pnlRow');
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

function findNearestToolbarInSection(section: Control, clientY: number, clientX: number, mouseOn: boolean): { toolbar: IDEToolbar; index: number } {
    if (!section || !clientY) return;

    const sectionBound = section.getBoundingClientRect();
    if (clientY < sectionBound.top || clientY > sectionBound.bottom || clientX < sectionBound.left || clientX > sectionBound.right) return;

    const toolbars = section.querySelectorAll('ide-toolbar');
    for (let i = 0; i < toolbars.length; i++) {
        const toolbarBound = toolbars[i].getBoundingClientRect();

        const condition = mouseOn ?
            (toolbarBound.top <= clientY && toolbarBound.top + toolbarBound.height >= clientY)
            : ((i == 0 && clientY <= toolbarBound.top) ||
                (i == toolbars.length - 1 && clientY >= toolbarBound.bottom) ||
                (toolbarBound.top <= clientY && toolbarBound.top + toolbarBound.height >= clientY));

        if (condition) {
            return { toolbar: toolbars[i] as IDEToolbar, index: i };
        }
    }
}

function findNearestSectionInRow(row: PageRow, clientX: number, clientY: number, mouseOn: boolean, excludingSectionId?: string[]) {
    if (mouseOn) {
        const sections = row.querySelectorAll('ide-section');
        for (let i = 0; i < sections.length; i++) {
            const sectionBound = sections[i].getBoundingClientRect();
            const checkExcludingSection = excludingSectionId ? !excludingSectionId.includes(sections[i].id) : true;
            if (checkExcludingSection &&
                sectionBound.top <= clientY && sectionBound.bottom >= clientY &&
                sectionBound.left <= clientX && sectionBound.right >= clientX) {
                return sections[i] as PageSection;
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
        return nearestSection as PageSection;
    }
}

function decideMergeSide(dropToolbar: HTMLElement, clientX: number, clientY: number): IMergeDropSide {
    let rect = dropToolbar.getBoundingClientRect();
    let offsetX = clientX - rect.left;
    let offsetY = clientY - rect.top;

    if (offsetY <= rect.height * 0.3) return 'top';
    else if (offsetY >= rect.height * 0.7) return 'bottom';
    else if (offsetX <= rect.width * 0.5) return 'front';
    else return 'back';
}

function getDropFrontBackResult(dropRow: any, nearestDropSection: any, dragSection: any, isFront: boolean, data: any): { newElmdata: any, newRowData: any } {
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
    if (emptySpace >= dragSection.columnSpan) {
        // have enough space to place the dragging toolbar
        const newColumn = isFront ?
            sortedSectionList[dropSectionIdx].column - data.columnSpan :
            sortedSectionList[dropSectionIdx].column + sortedSectionList[dropSectionIdx].columnSpan;
        const newElData = {
            id: data.id,
            column: newColumn,
            columnSpan: data.columnSpan,
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

        if (softEmptySpace >= dragSection.columnSpan + sortedSectionList[dropSectionIdx].columnSpan) {
            // if moving the current section can allocate enough space for the new section, do it

            // move the currect section
            sortedSectionList[dropSectionIdx].column = isFront ?
                frontLimit + dragSection.columnSpan :
                MAX_COLUMN - dragSection.columnSpan * 2 + 1;
            dropRowData.elements = sortedSectionList

            // add new section
            const newColumn = isFront ?
                frontLimit :
                MAX_COLUMN - sortedSectionList[dropSectionIdx].columnSpan + 1;

            const newElData = {
                id: data.id,
                column: newColumn,
                columnSpan: dragSection.columnSpan,
                properties: data.properties,
                module: data.module,
                tag: data.tag
            };
            return {
                newElmdata: newElData,
                newRowData: dropRowData
            };

        } else if (sortedSectionList[dropSectionIdx].columnSpan != 1) {
            // if moving the current section cannot allocate enough space for the new section,
            // check if the current section colSpan = 1

            // if the current section colSpan != 1, current section collapse to allocate space for new elm

            const splitIndex = Math.ceil(softEmptySpace / 2);

            // resize & move the currect section
            // dropRow.clearData();

            sortedSectionList[dropSectionIdx].column = isFront ?
                frontLimit + splitIndex :
                softFrontLimit;

            sortedSectionList[dropSectionIdx].columnSpan = isFront ?
                softEmptySpace - splitIndex :
                splitIndex;

            const newRowData = {
                id: (dropRowData as any).id,
                row: (dropRowData as any).row,
                elements: sortedSectionList
            }

            // add new section
            const newColumn = isFront ?
                frontLimit :
                softFrontLimit + splitIndex;

            const newColumnSpan = isFront ?
                splitIndex :
                softEmptySpace - splitIndex;

            const newElData = {
                id: data.id,
                column: newColumn,
                columnSpan: newColumnSpan,
                properties: data.properties,
                module: data.module,
                tag: data.tag
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