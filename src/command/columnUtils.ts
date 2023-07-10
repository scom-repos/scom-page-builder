import { Control } from "@ijstech/components";
import { pageObject } from "../store/index";
import { INIT_COLUMN_SPAN, MIN_COLUMN } from "../interface/index";

const updateColumnData = (el: Control, rowId: string, column: number, columnSpan: number) => {
  const newColumnData: any = {column, columnSpan};
  pageObject.setElement(rowId, el.id, newColumnData);
  el.setAttribute('data-column', `${column}`);
  el.setAttribute('data-column-span', `${columnSpan}`);
  el.style.gridColumn = `${column} / span ${columnSpan}`;
}

const getColumn = (el: Control) => {
  return Number(el.dataset.column);
}

const getColumnSpan = (el: Control) => {
  return Number(el.dataset.columnSpan);
}

const getNextColumn = (el: Control) => {
  return getColumn(el) + getColumnSpan(el);
}

const getPrevColumn = (el: Control) => {
  return getColumn(el) - getColumnSpan(el);
}

const getDropColumnData = (dropElm: Control, sortedSections: HTMLElement[], element?: Control) => {
  const dropRow = dropElm.closest('ide-row') as Control;
  const dropElmCol = getColumn(dropElm);
  let columnSpan = element ? getColumnSpan(element) : INIT_COLUMN_SPAN;
  const dropRowId = (dropRow?.id || '').replace('row-', '');
  const MAX_COLUMN = pageObject.getColumnsNumber(dropRowId);
  const maxColumn = (MAX_COLUMN - columnSpan) + 1;
  let newColumn = (columnSpan > 1 && dropElmCol > maxColumn) ? maxColumn : dropElmCol;
  let newColumnSpan = columnSpan;
  let prevDropElm = null;
  let afterDropElm = null;
  let currentSpan = sortedSections.reduce((result: number, el: Control) => {
    if (!element || (element && !el.contains(element))) {
      const elCol = getColumn(el);
      result += getColumnSpan(el);
      if (getColumn(dropElm as Control) > elCol && (!prevDropElm || (prevDropElm && getColumn(prevDropElm) < elCol))) {
        prevDropElm = el;
      }
      if (getColumn(dropElm as Control) < elCol && (!afterDropElm || (afterDropElm && getColumn(afterDropElm) > elCol))) {
        afterDropElm = el;
      }
    }
    return result;
  }, 0);

  if (prevDropElm) {
    const prevColumn = getColumn(prevDropElm);
    const prevColumnSpan = getColumnSpan(prevDropElm);
    const columnData = prevColumn + prevColumnSpan;
    if (columnData <= MAX_COLUMN + 1 && newColumn < columnData)
      newColumn = columnData;
  }
  if (afterDropElm) {
    const afterColumn = getColumn(afterDropElm);
    if (newColumn + columnSpan > afterColumn)
      newColumnSpan = afterColumn - newColumn;
  }
  const finalColumnSpan = Math.max(Math.min(newColumnSpan, MAX_COLUMN - currentSpan), 1);
  return { column: newColumn, columnSpan: finalColumnSpan };
}

const getNewColumn = (dropSection: Control, oldDropColumn: number, isAppend: boolean = true) => {
  return isAppend ? getNextColumn(dropSection) : oldDropColumn;
}

const getAppendColumnData = (grid: Control, dropElm: Control, sortedSections: HTMLElement[], updateData: any, element?: Control, isAppend: boolean = true) => {
  let dropSection = dropElm.closest('ide-section') as Control;
  if (!dropSection?.id) return null;
  dropSection = grid.querySelector(`[id='${dropSection.id}']`) as Control;
  const pageRow = dropSection.closest('ide-row') as Control;
  const pageRowId = (pageRow?.id || '').replace('row-', '');
  const MAX_COLUMN = pageObject.getColumnsNumber(pageRowId);
  const oldDropColumn = getColumn(dropSection);
  let newColumn = getNewColumn(dropSection, oldDropColumn, isAppend);
  if (element && pageRow.contains(element)) {
    const elementIndex = sortedSections.findIndex(el => getColumn(el as Control) === getColumn(element));
    const dropIndex = sortedSections.findIndex(el => getColumn(el as Control) === getColumn(dropSection));
    if (getColumn(element) > getColumn(dropSection)) {
      for (let j = elementIndex + 1; j < dropIndex; j++) {
        const elm = sortedSections[j] as Control;
        updateData(elm, pageRowId, getColumn(elm) + getColumnSpan(element));
      }
    } else if (getColumn(element) < getColumn(dropSection)) {
      for (let j = elementIndex - 1; j >= dropIndex; j--) {
        const elm = sortedSections[j] as Control;
        updateData(elm, pageRowId, getColumn(elm) - getColumnSpan(element));
      }
    }
    if (!isAppend) {
      updateData(dropSection, pageRowId, oldDropColumn + getColumnSpan(element));
    }
    newColumn = getNewColumn(dropSection, oldDropColumn, isAppend);
    return {column: newColumn, columnSpan: getColumnSpan(element)};
  }

  const hasSpace = sortedSections.find((section: Control) => getColumnSpan(section) > MIN_COLUMN);
  if (!hasSpace && sortedSections.length >= Math.ceil(MAX_COLUMN / MIN_COLUMN)) return null;

  const columnSpan = element ? Math.min(getColumnSpan(element), MIN_COLUMN) : MIN_COLUMN;
  for (let i = 0; i < sortedSections.length; i++) {
    const el = sortedSections[i] as Control;
    const prevElm = sortedSections[i - 1] as Control;
    const nextElm = sortedSections[i + 1] as Control;
    if (getColumnSpan(el) > columnSpan) {
      const newElColSpan = getColumnSpan(el) - columnSpan;
      if (getColumn(dropSection) < getColumn(el)) {
        updateData(el, pageRowId, getColumn(el) + columnSpan, newElColSpan);
        if (nextElm) {
          for (let j = i + 1; j < sortedSections.length; j++) {
            const elm = sortedSections[j] as Control;
            if (getColumn(elm) < getNextColumn(dropSection)) break;
            updateData(elm, pageRowId, getColumn(elm) + columnSpan);
          }
        }
        if (!isAppend) {
          updateData(dropSection, pageRowId, getColumn(dropSection) + columnSpan);
        }
        newColumn = getNewColumn(dropSection, oldDropColumn, isAppend);
      } else if (getColumn(dropSection) > getColumn(el)) {
        updateData(el, pageRowId, getColumn(el), newElColSpan);
        if (prevElm) {
          for (let j = i - 1; j >= 0; j--) {
            const elm = sortedSections[j] as Control;
            const newElmCol = getColumn(elm) - columnSpan;
            if (newElmCol === getNextColumn(dropSection)) break;
            updateData(elm, pageRowId, newElmCol);
          }
        }
        newColumn = getNewColumn(dropSection, oldDropColumn, isAppend);
      } else {
        const updatedCol = isAppend ? getColumn(el) : getColumn(el) + columnSpan;
        updateData(el, pageRowId, updatedCol, newElColSpan);
        newColumn = isAppend ? getColumn(el) + newElColSpan : oldDropColumn;
      }
      break;
    } else {
      if (getNextColumn(el) < MAX_COLUMN + 1 && i === 0) {
        updateData(el, pageRowId, (MAX_COLUMN + 1) - getColumnSpan(el));
      }
      if (nextElm) {
        const canUpdated = getNextColumn(nextElm) !== getColumn(el) &&
          getColumnSpan(nextElm) <= MIN_COLUMN;
        if (canUpdated) {
          if (getColumn(dropSection) < getColumn(el)) {
            const pos = getColumn(el) - getColumnSpan(nextElm);
            pos !== getNextColumn(dropSection) && updateData(nextElm, pageRowId, pos);
          } else if (getColumn(dropSection) > getColumn(el)) {
            for (let j = i; j >= 0; j--) {
              const elm = sortedSections[j] as Control;
              if (getPrevColumn(elm) !== getNextColumn(dropSection)) {
                updateData(elm, pageRowId, getPrevColumn(elm));
              }
            }
          } else {
            updateData(el, pageRowId, getPrevColumn(dropSection));
          }
        }
      }
      newColumn = getNewColumn(dropSection, oldDropColumn, isAppend);
    }
  }
  return { column: newColumn, columnSpan };
}

export {
  updateColumnData,
  getColumn,
  getColumnSpan,
  getNextColumn,
  getPrevColumn,
  getDropColumnData,
  getAppendColumnData
}
