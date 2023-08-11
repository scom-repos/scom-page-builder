import { pageObject } from "../store/index";

export const getUngroupData = (dropRow: any, nearestDropSection: any, dragSection: any, isFront: boolean, data: any): {
  newElmdata: any,
  newRowData: any
} => {
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

export const findNearestSection = (parent: any, point: number) => {
  const sections = parent.querySelectorAll('ide-section');
  if (sections.length === 0) {
    return null; // Return null for an empty list of elements
  }

  let isFront = false;
  let nearestDistance = Infinity;
  let nearestSection = null;

  for (const section of sections) {

    const sectionRect = (section as HTMLElement).getBoundingClientRect();
    const leftPoint = sectionRect.left;
    const rightPoint = sectionRect.right;

    // Calculate the distances between the point and both the left and right points of the element
    const leftDistance = Math.abs(leftPoint - point);
    const rightDistance = Math.abs(rightPoint - point);

    // Check if the left point is nearer than the current nearest point
    if (leftDistance < nearestDistance) {
      isFront = true;
      nearestDistance = leftDistance;
      nearestSection = section;
    }

    // Check if the right point is nearer than the current nearest point
    if (rightDistance < nearestDistance) {
      isFront = false;
      nearestDistance = rightDistance;
      nearestSection = section;
    }
  }

  return { isFront: isFront, element: nearestSection };
}