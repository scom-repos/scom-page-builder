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

  constructor(element: Control, initialWidth: number, initialHeight: number, finalWidth: number, finalHeight: number) {
    this.element = element;
    this.toolbar = element.querySelector('ide-toolbar');
    this.finalWidth = finalWidth;
    this.finalHeight = finalHeight;
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
    currentSpan = sections.reduce((result: number, el: HTMLElement) => {
      if (!el.contains(this.element)) {
        const columnSpan = Number(el.dataset.columnSpan);
        result += (columnSpan);
      }
      return result;
    }, 0);

    const numberOfColumns = Math.ceil((this.finalWidth + this.gapWidth) / (this.gridColumnWidth + this.gapWidth));
    const finalColumnSpan = Math.max(Math.min(numberOfColumns, MAX_COLUMN - currentSpan), 1);
    const column = Math.ceil((Number(this.element.left) + this.gapWidth) / (this.gridColumnWidth + this.gapWidth));
    const finalColumn = Math.max(Math.min(column, (MAX_COLUMN - finalColumnSpan) + 1), 1);
    return { column: finalColumn, columnSpan: finalColumnSpan };
  }

  execute(): void {
    const newColumnData = this.getColumnData();
    if (newColumnData) {
      this.element.setAttribute('data-column-span', `${newColumnData.columnSpan}`);
      this.element.setAttribute('data-column', `${newColumnData.column}`);
      this.element.style.gridColumn = `${newColumnData.column} / span ${newColumnData.columnSpan}`;
      // const maxWidth = this.gridColumnWidth * newColumnData.columnSpan +  this.gapWidth * (newColumnData.columnSpan - 1)
      // this.element.maxWidth = maxWidth;
    }
    if (this.toolbar) {
      const rowId = this.toolbar.rowId;
      const elementId = this.toolbar.elementId;
      const currentProp = this.toolbar?.data?.properties || {};
      const properties = {...currentProp, width: this.finalWidth, height: this.finalHeight};
      this.toolbar.setProperties(properties);
      pageObject.setElement(rowId, elementId, {properties, ...newColumnData});
    }
  }

  undo(): void {
    this.element.style.gridColumn = `${this.oldDataColumn.column} / span ${this.oldDataColumn.columnSpan}`;
    this.element.setAttribute('data-column', `${this.oldDataColumn.column}`);
    this.element.setAttribute('data-column-span', `${this.oldDataColumn.columnSpan}`);
    // const maxWidth = this.gridColumnWidth * this.oldDataColumn.columnSpan +  this.gapWidth * (this.oldDataColumn.columnSpan - 1)
    // this.element.maxWidth = maxWidth;
    if (this.toolbar) {
      const rowId = this.toolbar.rowId;
      const elementId = this.toolbar.elementId;
      const currentProp = this.toolbar?.data?.properties || {};
      const properties = {...currentProp, width: this.initialWidth, height: this.initialHeight};
      this.toolbar.setProperties(properties);
      pageObject.setElement(rowId, elementId, {properties, ...this.oldDataColumn});
    }
  }

  redo(): void {}
}
