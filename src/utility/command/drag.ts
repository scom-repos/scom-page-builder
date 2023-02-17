import { ICommand, IDataColumn, MAX_COLUMN } from "./interface";
import { pageObject } from "../../store/index";
import { Control } from "@ijstech/components";

export class DragElementCommand implements ICommand {
  private element: HTMLElement;
  private dropElm: HTMLElement;
  private toolbar: any;
  private oldDataColumn: IDataColumn;
  private oldRow: string;

  constructor(element: HTMLElement, dropElm: HTMLElement) {
    this.element = element;
    this.toolbar = element.querySelector('ide-toolbar');
    this.dropElm = dropElm;
    this.oldDataColumn = {
      column: Number(element.dataset.column),
      columnSpan: Number(element.dataset.columnSpan)
    }
    const pageRow = element.closest('ide-row') as Control;
    this.oldRow = pageRow?.dataset?.row;
  }

  private getColumnData() {
    const column = Number(this.dropElm.getAttribute('data-column'));
    if (!isNaN(column)) {
      const columnSpan = Number(this.element.dataset.columnSpan);
      let newColumn = column;
      const maxColumnStart = (MAX_COLUMN - columnSpan) + 1;
      if (columnSpan > 1 && column > maxColumnStart)
        newColumn = maxColumnStart;
      return { column: newColumn, columnSpan };
    } else {
      // For last child
      const grid = this.dropElm.closest('.grid');
      const sections = Array.from(grid?.querySelectorAll('ide-section'));
      const hasLastElm = sections.find(el => {
        const column = Number(el.getAttribute('data-column'));
        const columnSpan = Number(el.getAttribute('data-column-span'));
        return column + columnSpan === 13;
      }) as Control;
      if (hasLastElm) {
        const columnSpan = Number(this.element.dataset.columnSpan);
        const lastColumnSpan = Number(hasLastElm.dataset.columnSpan);
        const newSpan = lastColumnSpan - columnSpan;
        const lastColumn = Number(hasLastElm.dataset.column);
        hasLastElm.setAttribute('data-column-span', `${newSpan}`);
        hasLastElm.style.gridColumn = `${lastColumn} / span ${newSpan}`;
        const pageRow = this.dropElm.closest('ide-row') as Control;
        const lastRowId = (pageRow?.id || '').replace('row-', '');
        pageObject.setElement(lastRowId, hasLastElm.id, {column: lastColumn, columnSpan: newSpan});
        return { column: newSpan + 1, columnSpan };
      }
    }
    return null;
  }

  execute(): void {
    this.dropElm.style.border = "";
    const grid = this.dropElm.closest('.grid') as Control;
    if (!grid) return;
    const newColumnData = this.getColumnData();
    if (newColumnData) {
      this.element.style.gridRow = '1';
      this.element.style.gridColumn = `${newColumnData.column} / span ${newColumnData.columnSpan}`;
      this.element.setAttribute('data-column', `${newColumnData.column}`);
    }
    const elementRow = this.element.closest('ide-row') as Control;
    grid.appendChild(this.element);
    // TODO: update data in store
    if (!elementRow?.querySelectorAll('ide-section').length) {
      elementRow.remove();
    }
    if (this.toolbar) {
      const rowId = this.toolbar.rowId;
      const elementId = this.toolbar.elementId;
      pageObject.setElement(rowId, elementId, {...newColumnData});
      const dropRow = this.dropElm.closest('ide-row') as Control;
      pageObject.updateSection(rowId, {row: dropRow?.dataset.row});
    }
  }

  undo(): void {
    this.element.style.gridRow = '1';
    this.element.style.gridColumn = `${this.oldDataColumn.column} / span ${this.oldDataColumn.columnSpan}`;
    this.element.setAttribute('data-column', `${this.oldDataColumn.column}`);
    if (this.toolbar) {
      const rowId = this.toolbar.rowId;
      const elementId = this.toolbar.elementId;
      pageObject.setElement(rowId, elementId, {...this.oldDataColumn});
      pageObject.updateSection(rowId, {row: this.oldRow});
    }
  }

  redo(): void {}
}
