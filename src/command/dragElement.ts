import { ICommand, IDataColumn } from "./interface";
import { pageObject } from "../store/index";
import { Control } from "@ijstech/components";
import { getAppendColumnData, getColumn, getColumnSpan, getDropColumnData, updateColumnData } from "./columnUtils";

export class DragElementCommand implements ICommand {
  private parent: Control;
  private element: any;
  private dropElm: Control;
  private dropRow: Control;
  private dropGrid: Control;
  private oldDataColumn: IDataColumn;
  private data: any;
  private oldDataColumnMap: any[] = [];
  private isAppend: boolean = true;
  private isNew: boolean = false;

  constructor(element: any, dropElm: Control, isAppend: boolean = true, isNew: boolean = false) {
    this.element = element;
    this.dropElm = dropElm;
    this.dropRow = dropElm.closest('ide-row');
    this.dropGrid = this.dropRow ? this.dropRow.querySelector('.grid') : null;
    this.oldDataColumn = {
      column: Number(element.dataset.column),
      columnSpan: Number(element.dataset.columnSpan)
    }
    this.parent = element.closest('ide-row') as Control;
    this.data = JSON.parse(JSON.stringify(element.data));
    this.isAppend = isAppend;
    this.isNew = isNew;
    this.updateData = this.updateData.bind(this);
  }

  private updateData(el: Control, rowId: string, column?: number, columnSpan?: number) {
    if (!column && !columnSpan) return;
    const oldColumnData = {el, rowId, column: getColumn(el), columnSpan: getColumnSpan(el)};
    const hasItem = this.oldDataColumnMap.find(data => data.el.id === el.id);
    !hasItem && this.oldDataColumnMap.push(oldColumnData);
    const col = column || getColumn(el);
    const colSpan = columnSpan || getColumnSpan(el);
    updateColumnData(el, rowId, col, colSpan);
  }

  private getColumnData() {
    const sections = this.dropGrid ? Array.from(this.dropGrid.querySelectorAll('ide-section')) : [];
    const sortedSections = sections.sort((a: HTMLElement, b: HTMLElement) => Number(b.dataset.column) - Number(a.dataset.column));
    const dropElmCol = Number(this.dropElm.dataset.column);
    return isNaN(dropElmCol) ?
      getAppendColumnData(this.dropGrid, this.dropElm, sortedSections as HTMLElement[], this.updateData, this.element, this.isAppend) :
      getDropColumnData(this.dropElm, sortedSections as HTMLElement[], this.element);
  }

  execute(): void {
    if (!this.parent || !this.dropRow) return;
    this.element = this.parent.querySelector(`[id='${this.data.id}']`) as Control;
    if (!this.element) return;
    let column = 1;
    let columnSpan = Number(this.element.dataset.columnSpan);

    if (this.dropGrid && !this.isNew) {
      const columnData = this.getColumnData();
      if (!columnData) return;
      column = columnData.column;
      columnSpan = columnData.columnSpan;
    }
  
    this.element.style.gridRow = '1';
    this.element.style.gridColumn = `${column} / span ${columnSpan}`;
    this.element.setAttribute('data-column', `${column}`);
    this.element.setAttribute('data-column-span', `${columnSpan}`);

    const dropRowId = this.dropRow.id.replace('row-', '');
    const elementRowId = (this.parent?.id || '').replace('row-', '');
    pageObject.setElement(elementRowId, this.element.id, {column, columnSpan});

    if (this.parent && !this.parent.isEqualNode(this.dropRow)) {
      pageObject.addElement(dropRowId, {...this.data, column, columnSpan});
      pageObject.removeElement(elementRowId, this.element.id);
      if (this.dropGrid) this.dropGrid.appendChild(this.element);
      const toolbar = this.element.querySelector('ide-toolbar') as any;
      if (toolbar) toolbar.rowId = dropRowId;
      this.element.rowId = dropRowId;
      this.element.parent = this.dropGrid;
      (this.dropRow as any).toggleUI(true);
    }
    if (this.parent) {
      const elementSection = pageObject.getRow(elementRowId);
      this.parent.visible = !!elementSection?.elements?.length;
    }
  }

  undo(): void {
    if (!this.parent || !this.element) return;
    this.element.style.gridRow = '1';
    this.element.style.gridColumn = `${this.oldDataColumn.column} / span ${this.oldDataColumn.columnSpan}`;
    this.element.setAttribute('data-column', `${this.oldDataColumn.column}`);
    this.element.setAttribute('data-column-span', `${this.oldDataColumn.columnSpan}`);

    const elementRow = this.element.parent.closest('ide-row') as Control;
    const elementRowId = (elementRow?.id || '').replace('row-', '');
    pageObject.setElement(elementRowId, this.element.id, {...this.oldDataColumn});

    if (!this.parent.id) return;
    const oldRowId = (this.parent?.id || '').replace('row-', '');
    if (this.parent && elementRow && !elementRow.isEqualNode(this.parent)) {
      pageObject.addElement(oldRowId, {...this.data, ...this.oldDataColumn});
      pageObject.removeElement(elementRowId, this.element.id);
      const oldGrid = this.parent.querySelector('.grid');
      if (oldGrid) {
        oldGrid.appendChild(this.element);
        const toolbar = this.element.querySelector('ide-toolbar') as any;
        if (toolbar) toolbar.rowId = oldRowId;
        this.element.rowId = oldRowId;
        this.element.parent = oldGrid;
      }
    }
    if (this.parent) {
      const oldElementSection = pageObject.getRow(oldRowId);
      this.parent.visible = !!oldElementSection?.elements?.length;
    }

    for (let columnData of this.oldDataColumnMap) {
      const { el, rowId, column, columnSpan } = columnData;
      updateColumnData(el, rowId, column, columnSpan);
    }
  }

  redo(): void {}
}
