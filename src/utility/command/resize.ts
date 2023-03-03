import { Control } from "@ijstech/components";
import { pageObject } from "../../store/index";
import { ICommand, IDataColumn, MAX_COLUMN } from "./interface";

export class ResizeElementCommand implements ICommand {
  private element: Control;
  private toolbar: any;
  private initialWidth: number;
  private initialHeight: number;
  private finalWidth: number;
  private finalHeight: number;
  private oldDataColumn: IDataColumn;
  private gapWidth: number = 15;
  private gridColumnWidth: number = 0;
  private finalLeft: number;

  constructor(element: Control, initialWidth: number, initialHeight: number, finalWidth: number, finalHeight: number) {
    this.element = element;
    this.toolbar = element.querySelector('ide-toolbar');
    this.finalWidth = finalWidth || initialWidth;
    this.finalHeight = finalHeight || initialHeight;
    this.finalLeft = Number(this.element.left);
    this.initialWidth = initialWidth;
    this.initialHeight = initialHeight;
    this.oldDataColumn = {
      column: Number(element.dataset.column),
      columnSpan: Number(element.dataset.columnSpan)
    }
    const grid = this.element.closest('.grid') as HTMLElement;
    if (grid)
      this.gridColumnWidth = (grid.offsetWidth - this.gapWidth * (MAX_COLUMN - 1)) / MAX_COLUMN;
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
    const finalColumnSpan = Math.max(Math.min(numberOfColumns, MAX_COLUMN - currentSpan), 1);
    const column = Math.ceil((this.finalLeft + this.gapWidth) / (this.gridColumnWidth + this.gapWidth));
    let finalColumn = Math.max(Math.min(column, (MAX_COLUMN - finalColumnSpan) + 1), 1);
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

  execute(): void {
    const newColumnData = this.getColumnData();
    if (newColumnData) {
      this.element.setAttribute('data-column-span', `${newColumnData.columnSpan}`);
      this.element.setAttribute('data-column', `${newColumnData.column}`);
      this.element.style.gridColumn = `${newColumnData.column} / span ${newColumnData.columnSpan}`;
    }
    if (this.toolbar) {
      const rowId = this.toolbar.rowId;
      const elementId = this.toolbar.elementId;
      const isContainer = this.toolbar?.data?.properties?.content && typeof this.toolbar?.data?.properties?.content === 'object';
      const contentTag = isContainer ? this.toolbar?.data?.properties?.content?.tag : null;
      const currentTag = contentTag || this.toolbar?.data?.tag || {};
      const tag = {...currentTag, width: '100%', height: this.finalHeight || this.initialHeight};
      this.toolbar.setTag(tag);
      if (newColumnData.column !== this.oldDataColumn.column || newColumnData.columnSpan !== this.oldDataColumn.columnSpan)
        pageObject.setElement(rowId, elementId, {tag, ...newColumnData});
    }
  }

  undo(): void {
    this.element.style.gridColumn = `${this.oldDataColumn.column} / span ${this.oldDataColumn.columnSpan}`;
    this.element.setAttribute('data-column', `${this.oldDataColumn.column}`);
    this.element.setAttribute('data-column-span', `${this.oldDataColumn.columnSpan}`);
    if (this.toolbar) {
      const rowId = this.toolbar.rowId;
      const elementId = this.toolbar.elementId;
      const isContainer = this.toolbar?.data?.properties?.content && typeof this.toolbar?.data?.properties?.content === 'object';
      const contentTag = isContainer ? this.toolbar?.data?.properties?.content?.tag : null;
      const currentTag = contentTag || this.toolbar?.data?.tag || {};
      const tag = {...currentTag, width: this.initialWidth, height: this.initialHeight};
      this.toolbar.setTag(tag);
      pageObject.setElement(rowId, elementId, {tag, ...this.oldDataColumn});
    }
  }

  redo(): void {}
}
