import { Control } from "@ijstech/components";
import { pageObject } from "../store/index";
import { ICommand, IDataColumn } from "./interface";
import { GAP_WIDTH } from "../interface/index";

export class ResizeElementCommand implements ICommand {
  private parent: Control;
  private element: any;
  private toolbar: any;
  // private initialWidth: number;
  private initialHeight: number;
  private finalWidth: number;
  private finalHeight: number;
  private oldDataColumn: IDataColumn;
  private gapWidth: number = GAP_WIDTH;
  private gridColumnWidth: number = 0;
  private finalLeft: number;

  private get maxColumn() {
    const rowId = this.parent?.id.replace('row-', '');
    return pageObject.getColumnsNumber(rowId);
  }

  constructor(element: any, toolbar: any, initialWidth: number, initialHeight: number, finalWidth: number, finalHeight: number) {
    this.element = element;
    this.toolbar = toolbar;
    this.parent = this.element.closest('ide-row');
    this.finalWidth = finalWidth || initialWidth;
    this.finalHeight = finalHeight || initialHeight;
    this.finalLeft = Number(this.element.left);
    // this.initialWidth = initialWidth;
    this.initialHeight = initialHeight;
    this.oldDataColumn = {
      column: Number(this.element.dataset.column),
      columnSpan: Number(this.element.dataset.columnSpan)
    }
    const grid = this.element.parentElement.closest('.grid') as HTMLElement;
    if (grid)
      this.gridColumnWidth = (grid.offsetWidth - this.gapWidth * (this.maxColumn - 1)) / this.maxColumn;
  }

  private getColumnData() {
    const grid = this.element.closest('.grid') as HTMLElement;
    let currentSpan = 0;
    if (!grid) return null;

    const sections = Array.from(grid.querySelectorAll('ide-section'));
    let prevElm = null;
    let afterElm = null;
    currentSpan = sections.reduce((result: number, el: HTMLElement) => {
      if (!el.contains(this.element)) {
        const columnSpan = Number(el.dataset.columnSpan);
        result += (columnSpan);
        const column = Number(el.dataset.column);
        if (this.oldDataColumn.column > column)
          prevElm = el;
        if (this.oldDataColumn.column < column)
          afterElm = el;
      }
      return result;
    }, 0);

    const numberOfColumns = Math.ceil((this.finalWidth + this.gapWidth) / (this.gridColumnWidth + this.gapWidth));
    const finalColumnSpan = Math.max(Math.min(numberOfColumns, this.maxColumn - currentSpan), 1);
    const column = Math.ceil((this.finalLeft + this.gapWidth) / (this.gridColumnWidth + this.gapWidth));
    let finalColumn = Math.max(Math.min(column, (this.maxColumn - finalColumnSpan) + 1), 1);
    if (prevElm) {
      const prevColumn = Number(prevElm.dataset.column);
      const prevColumnSpan = Number(prevElm.dataset.columnSpan);
      if (finalColumn < prevColumn + prevColumnSpan)
        finalColumn = prevColumn + prevColumnSpan;
    }
    if (afterElm) {
      const afterColumn = Number(afterElm.dataset.column);
      if (finalColumn >= afterColumn)
        finalColumn = afterColumn - finalColumnSpan;
    }
    return { column: finalColumn, columnSpan: finalColumnSpan };
  }

  private updateElement(columnData: IDataColumn) {
    const {column, columnSpan} = columnData;
    this.element.setAttribute('data-column-span', `${columnSpan}`);
    this.element.setAttribute('data-column', `${column}`);
    this.element.style.gridColumn = `${column} / span ${columnSpan}`;
  }

  private updateToolbars(isChangedColumn: boolean, rowId: string, columnData: IDataColumn, changedHeight: number) {
    const {column, columnSpan} = columnData;
    const toolbars = this.element.querySelectorAll('ide-toolbar');
    for (const toolbar of toolbars) {
      const currentTag = toolbar?.data?.tag || {};
      const height = toolbar.id === this.toolbar.id ? changedHeight : '100%';
      const tag = {...currentTag, width: '100%', height};
      toolbar.setTag(tag);
      const elementId = toolbar.elementId;
      if (isChangedColumn && elementId !== this.element.id)
        pageObject.setElement(rowId, elementId, {column, columnSpan});
    }
  }

  execute(): void {
    this.element = this.parent && this.parent.querySelector(`[id='${this.element.id}']`) as Control;
    if (!this.element) return;
    const columnData = this.getColumnData();
    if (!columnData) return;
    this.updateElement(columnData);
    const rowId = this.parent?.id.replace('row-', '');
    const elementId = this.element.id;
    const isChangedColumn = columnData.column !== this.oldDataColumn.column || columnData.columnSpan !== this.oldDataColumn.columnSpan;
    if (isChangedColumn) pageObject.setElement(rowId, elementId, {...columnData});
    this.updateToolbars(isChangedColumn, rowId, columnData, this.finalHeight);
  }

  undo(): void {
    const {column, columnSpan} = this.oldDataColumn;
    this.updateElement({column, columnSpan});
    const rowId = this.parent?.id.replace('row-', '');
    const elementId = this.element.id;
    pageObject.setElement(rowId, elementId, {column, columnSpan});
    this.updateToolbars(true, rowId, {column, columnSpan}, this.initialHeight);
  }

  redo(): void {}
}
