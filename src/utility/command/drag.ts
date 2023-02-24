import { ICommand, IDataColumn, MAX_COLUMN } from "./interface";
import { pageObject } from "../../store/index";
import { Control } from "@ijstech/components";

export class DragElementCommand implements ICommand {
  private element: any;
  private dropElm: HTMLElement;
  private oldDataColumn: IDataColumn;
  private oldDataRow: string;
  private data: any;

  constructor(element: any, dropElm: HTMLElement) {
    this.element = element;
    this.dropElm = dropElm;
    this.oldDataColumn = {
      column: Number(element.dataset.column),
      columnSpan: Number(element.dataset.columnSpan)
    }
    const pageRow = element.closest('ide-row') as Control;
    this.oldDataRow = (pageRow?.id || '').replace('row-', '');
    this.data = element.data;
  }

  private getColumnData() {
    const grid = this.dropElm.closest('.grid');
    const sections = Array.from(grid?.querySelectorAll('ide-section'));
    const column = Number(this.dropElm.getAttribute('data-column'));
    if (!isNaN(column)) {
      let columnSpan = Number(this.element.dataset.columnSpan);
      const maxColumn = (MAX_COLUMN - columnSpan) + 1;
      let newColumn = (columnSpan > 1 && column > maxColumn) ? maxColumn : column;
      let prevDropElm = null;
      let afterDropElm = null;
      let currentSpan = 0;
      const dropColumn = Number(this.dropElm.dataset.column);
      currentSpan = sections.reduce((result: number, el: HTMLElement) => {
        if (!el.contains(this.element)) {
          const columnSpan = Number(el.dataset.columnSpan);
          result += (columnSpan);
          const column = Number(el.dataset.column);
          if (dropColumn > column)
            prevDropElm = el;
          if (dropColumn < column)
            afterDropElm = el;
        }
        return result;
      }, 0);

      if (prevDropElm) {
        const prevColumn = Number(prevDropElm.dataset.column);
        const prevColumnSpan = Number(prevDropElm.dataset.columnSpan);
        if (newColumn < prevColumn + prevColumnSpan)
          newColumn = prevColumn + prevColumnSpan;
      }
      if (afterDropElm) {
        const afterColumn = Number(afterDropElm.dataset.column);
        // const afterColumnSpan = Number(afterDropElm.dataset.columnSpan);
        if (newColumn + columnSpan > afterColumn) {
          newColumn = afterColumn - columnSpan;
        }
      }
      const finalColumnSpan = Math.max(Math.min(columnSpan, MAX_COLUMN - currentSpan), 1);
      return { column: newColumn, columnSpan: finalColumnSpan };
    } else {
      // For last child
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
        const pageRow = this.dropElm.closest('ide-row') as Control;
        const pageRowId = (pageRow?.id || '').replace('row-', '');
        if (sections.length === 1 && (newSpan * 2 < MAX_COLUMN) && lastColumn > columnSpan) {
          const newLastColumn = lastColumn - columnSpan;
          pageObject.setElement(pageRowId, hasLastElm.id, {column: newLastColumn, columnSpan: lastColumnSpan});
          hasLastElm.setAttribute('data-column-span', `${lastColumnSpan}`);
          hasLastElm.style.gridColumn = `${newLastColumn} / span ${lastColumnSpan}`;
        } else {
          pageObject.setElement(pageRowId, hasLastElm.id, {column: lastColumn, columnSpan: newSpan});
          hasLastElm.setAttribute('data-column-span', `${newSpan}`);
          hasLastElm.style.gridColumn = `${lastColumn} / span ${newSpan}`;
        }
        return { column: lastColumn + newSpan, columnSpan };
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
      this.element.setAttribute('data-column-span', `${newColumnData.columnSpan}`);
    }
    const elementRow = this.element.closest('ide-row') as Control;
    const dropRow = this.dropElm.closest('ide-row') as Control;
    const dropRowId = (dropRow?.id || '').replace('row-', '');
    const elementRowId = (elementRow?.id || '').replace('row-', '');
    pageObject.setElement(elementRowId, this.element.id, {...newColumnData});

    if (!elementRow.isEqualNode(dropRow)) {
      pageObject.addElement(dropRowId, this.data);
      pageObject.removeElement(elementRowId, this.element.id);
      grid.appendChild(this.element);
      const toolbar = this.element.querySelector('ide-toolbar') as any;
      if (toolbar) toolbar.rowId = dropRowId;
    }

    const elementSection = pageObject.getSection(elementRowId);
    elementRow.visible =  !!elementSection?.elements?.length;
  }

  undo(): void {
    this.element.style.gridRow = '1';
    this.element.style.gridColumn = `${this.oldDataColumn.column} / span ${this.oldDataColumn.columnSpan}`;
    this.element.setAttribute('data-column', `${this.oldDataColumn.column}`);
    this.element.setAttribute('data-column-span', `${this.oldDataColumn.columnSpan}`);

    const elementRow = this.element.closest('ide-row') as Control;
    const elementRowId = (elementRow?.id || '').replace('row-', '');
    pageObject.setElement(elementRowId, this.element.id, {...this.oldDataColumn});

    if (!this.oldDataRow) return;
    const oldElementRow = document.querySelector(`#row-${this.oldDataRow}`) as Control;
    if (oldElementRow && !elementRow.isEqualNode(oldElementRow)) {
      pageObject.addElement(this.oldDataRow, this.data);
      pageObject.removeElement(elementRowId, this.element.id);
      const oldGrid = oldElementRow.querySelector('.grid');
      if (oldGrid) {
        oldGrid.appendChild(this.element);
        const toolbar = this.element.querySelector('ide-toolbar') as any;
        if (toolbar) toolbar.rowId = this.oldDataRow;
      }
    }
    const oldElementSection = pageObject.getSection(this.oldDataRow);
    oldElementRow && (oldElementRow.visible = !!oldElementSection?.elements?.length);
  }

  redo(): void {}
}
