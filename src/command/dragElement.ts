import { ICommand, IDataColumn, MAX_COLUMN, MIN_COLUMN } from "./interface";
import { pageObject } from "../store/index";
import { Control } from "@ijstech/components";
import { getAppendColumnData, getColumn, getColumnSpan, getDropColumnData, getNextColumn, getPrevColumn, resetColumnData, updateColumnData } from "./columnUtils";

export class DragElementCommand implements ICommand {
  private element: any;
  private dropElm: Control;
  private oldDataColumn: IDataColumn;
  private oldDataRow: string;
  private data: any;
  private oldDataColumnMap: any[] = [];

  constructor(element: any, dropElm: Control) {
    this.element = element;
    this.dropElm = dropElm;
    this.oldDataColumn = {
      column: Number(element.dataset.column),
      columnSpan: Number(element.dataset.columnSpan)
    }
    const pageRow = element.closest('ide-row') as Control;
    this.oldDataRow = (pageRow?.id || '').replace('row-', '');
    this.data = JSON.parse(JSON.stringify(element.data));
    this.updateData = this.updateData.bind(this);
  }

  private updateData(el: Control, rowId: string, column?: number, columnSpan?: number) {
    if (!column && !columnSpan) return;
    const oldColumnData = {el, rowId, column: getColumn(el), columnSpan: getColumnSpan(el)};
    this.oldDataColumnMap.push(oldColumnData);
    updateColumnData(el, rowId, column, columnSpan);
  }

  private getColumnData() {
    const grid = this.dropElm.closest('.grid');
    const sections = Array.from(grid?.querySelectorAll('ide-section'));
    const sortedSections = sections.sort((a: HTMLElement, b: HTMLElement) => Number(b.dataset.column) - Number(a.dataset.column));
    const dropElmCol = Number(this.dropElm.getAttribute('data-column'));
    return isNaN(dropElmCol) ?
      getAppendColumnData(this.dropElm, sortedSections as HTMLElement[], this.updateData, this.element) :
      getDropColumnData(this.dropElm, sortedSections as HTMLElement[]);
  }

  execute(): void {
    this.element = document.getElementById(`${this.element.id}`) as Control;
    this.dropElm.style.border = "";
    const grid = this.dropElm.closest('.grid') as Control;
    if (!grid) return;
    const newColumnData = this.getColumnData();
    if (!newColumnData) return;

    this.element.style.gridRow = '1';
    this.element.style.gridColumn = `${newColumnData.column} / span ${newColumnData.columnSpan}`;
    this.element.setAttribute('data-column', `${newColumnData.column}`);
    this.element.setAttribute('data-column-span', `${newColumnData.columnSpan}`);

    const elementRow = this.element.closest('ide-row') as Control;
    const dropRow = this.dropElm.closest('ide-row') as Control;
    const dropRowId = (dropRow?.id || '').replace('row-', '');
    const elementRowId = (elementRow?.id || '').replace('row-', '');
    pageObject.setElement(elementRowId, this.element.id, {...newColumnData});

    if (elementRow && !elementRow.isEqualNode(dropRow)) {
      pageObject.addElement(dropRowId, {...this.data, ...newColumnData});
      pageObject.removeElement(elementRowId, this.element.id);
      grid.appendChild(this.element);
      const toolbar = this.element.querySelector('ide-toolbar') as any;
      if (toolbar) toolbar.rowId = dropRowId;
      this.element.rowId = dropRowId;
      this.element.parent = grid;
    }
    const elementSection = pageObject.getRow(elementRowId);
    elementRow.visible = !!elementSection?.elements?.length;
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
      pageObject.addElement(this.oldDataRow, {...this.data, ...this.oldDataColumn});
      pageObject.removeElement(elementRowId, this.element.id);
      const oldGrid = oldElementRow.querySelector('.grid');
      if (oldGrid) {
        oldGrid.appendChild(this.element);
        const toolbar = this.element.querySelector('ide-toolbar') as any;
        if (toolbar) toolbar.rowId = this.oldDataRow;
        this.element.rowId = this.oldDataRow;
        this.element.parent = oldGrid;
      }
    }
    const oldElementSection = pageObject.getRow(this.oldDataRow);
    oldElementRow && (oldElementRow.visible = !!oldElementSection?.elements?.length);

    for (let columnData of this.oldDataColumnMap) {
      const { el, rowId, column, columnSpan } = columnData;
      resetColumnData(el, rowId, column, columnSpan);
    }
  }

  redo(): void {}
}
