import { Control } from "@ijstech/components";
import { pageObject } from "../store/index";

const updateColumnData = (el: Control, rowId: string, column?: number, columnSpan?: number) => {
  if (!column && !columnSpan) return;
  const col = column || getColumn(el);
  const colSpan = columnSpan || getColumnSpan(el);
  const newColumnData: any = {column: col, columnSpan: colSpan};
  pageObject.setElement(rowId, el.id, newColumnData);
  el.setAttribute('data-column', `${col}`);
  el.setAttribute('data-column-span', `${colSpan}`);
  el.style.gridColumn = `${col} / span ${colSpan}`;
}

const resetColumnData = (el: Control, rowId: string, column: number, columnSpan: number) => {
  pageObject.setElement(rowId, el.id, {column, columnSpan});
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

export {
  updateColumnData,
  resetColumnData,
  getColumn,
  getColumnSpan,
  getNextColumn,
  getPrevColumn
}


// private updateColumnData(el: Control, rowId: string, column?: number, columnSpan?: number) {
//   if (!column && !columnSpan) return;
//   this.oldDataColumnMap.push({el, rowId, column: this.getColumn(el), columnSpan: this.getColumnSpan(el)});
//   const col = column || this.getColumn(el);
//   const colSpan = columnSpan || this.getColumnSpan(el);
//   const newColumnData: any = {column: col, columnSpan: colSpan};
//   pageObject.setElement(rowId, el.id, newColumnData);
//   el.setAttribute('data-column', `${col}`);
//   el.setAttribute('data-column-span', `${colSpan}`);
//   el.style.gridColumn = `${col} / span ${colSpan}`;
// }
// private resetColumnData(el: Control, rowId: string, column: number, columnSpan: number) {
//   pageObject.setElement(rowId, el.id, {column, columnSpan});
//   el.setAttribute('data-column', `${column}`);
//   el.setAttribute('data-column-span', `${columnSpan}`);
//   el.style.gridColumn = `${column} / span ${columnSpan}`;
// }
// private getColumn(el: Control) {
//   return Number(el.dataset.column);
// }
// private getColumnSpan(el: Control) {
//   return Number(el.dataset.columnSpan);
// }
// private getNextColumn(el: Control) {
//   return this.getColumn(el) + this.getColumnSpan(el);
// }
// private getPrevColumn(el: Control) {
//   return this.getColumn(el) - this.getColumnSpan(el);
// }