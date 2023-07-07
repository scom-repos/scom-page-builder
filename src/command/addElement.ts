import { Control } from "@ijstech/components";
import { pageObject } from "../store/index";
import { ICommand } from "./interface";
import { getColumn, getColumnSpan, updateColumnData, getDropColumnData, getAppendColumnData } from "./columnUtils";

export class AddElementCommand implements ICommand {
  private element: any;
  private parent: any;
  private dropElm: Control;
  private data: any
  private isAppend: boolean = true;
  private isNew: boolean = false;
  private oldDataColumnMap: any[] = [];

  constructor(data: any, isAppend: boolean = true, isNew: boolean = false, dropElm?: Control, parent?: any) {
    this.data = JSON.parse(JSON.stringify(data));
    this.dropElm = dropElm;
    this.parent = parent || dropElm.closest('ide-row');
    this.isAppend = isAppend;
    this.isNew = isNew;
    this.updateData = this.updateData.bind(this);
  }

  private updateData(el: Control, rowId: string, column?: number, columnSpan?: number) {
    if (!column && !columnSpan) return;
    const oldColumnData = { el, rowId, column: getColumn(el), columnSpan: getColumnSpan(el) };
    const hasItem = this.oldDataColumnMap.find(data => data.el.id === el.id);
    !hasItem && this.oldDataColumnMap.push(oldColumnData);
    const col = column || getColumn(el);
    const colSpan = columnSpan || getColumnSpan(el);
    updateColumnData(el, rowId, col, colSpan);
  }

  private getColumnData() {
    if (!this.dropElm) return null;
    const grid = this.dropElm.closest('.grid') || this.parent;
    const sections = grid ? Array.from(grid.querySelectorAll('ide-section')) : [];
    const sortedSections = sections.sort((a: HTMLElement, b: HTMLElement) => Number(b.dataset.column) - Number(a.dataset.column));
    const dropElmCol = Number(this.dropElm.dataset.column);
    return isNaN(dropElmCol) ?
      getAppendColumnData(grid, this.dropElm, sortedSections as HTMLElement[], this.updateData, null, this.isAppend) :
      getDropColumnData(this.dropElm, sortedSections as HTMLElement[]);
  }

  async execute() {
    if (!this.parent) return;
    let column = 1;
    let columnSpan = 6;

    if (!this.isNew) {
      const columnData = this.getColumnData();
      if (!columnData) return;
      column = columnData.column;
      columnSpan = columnData.columnSpan;
    }

    const isMicroDapps = this.data?.module?.category === 'micro-dapps';
    // const newElData = {
    //   id: this.data.id,
    //   column,
    //   columnSpan,
    //   type: ElementType.COMPOSITE,
    //   properties: {},
    //   elements: [{
    //     id: this.data.elementId,
    //     column,
    //     columnSpan,
    //     type: ElementType.PRIMITIVE,
    //     properties: {
    //       showHeader: isMicroDapps,
    //       showFooter: isMicroDapps
    //     },
    //     module: this.data.module
    //   }]
    // };
    const newElData = {
      id: this.data.id,
      column,
      columnSpan,
      // type: ElementType.PRIMITIVE,
      properties: {
        showHeader: isMicroDapps,
        showFooter: isMicroDapps
      },
      module: this.data.module
    };
    const parentData = this.parent?.data;
    // Remove any elements that are not currently listed
    if (parentData?.elements) {
      const selections = this.parent.querySelectorAll('ide-section');
      for (const section of selections) {
        const elm = parentData.elements.find((f: any) => f.id === section.id);
        if (!elm || (Object.keys(elm.module || {}).length === 0 && !elm.elements?.length)) {
          section.remove();
        }
      }
    }
    this.element = await this.parent.addElement(newElData);
    const parentId = this.parent.id.replace('row-', '');
    pageObject.addElement(parentId, newElData);
    const elementRowId = (this.parent?.id || '').replace('row-', '');
    const elementSection = pageObject.getRow(elementRowId);
    this.parent.toggleUI(!!elementSection?.elements?.length);
  }

  undo(): void {
    if (!this.element || !this.parent) return;
    this.element = this.parent.querySelector(`[id='${this.element.id}']`);
    if (!this.element) return;
    this.element.remove();
    const parentId = this.parent.id.replace('row-', '');
    pageObject.removeElement(parentId, this.element.id);
    for (let columnData of [...this.oldDataColumnMap]) {
      const { el, rowId, column, columnSpan } = columnData;
      updateColumnData(el, rowId, column, columnSpan);
    }
    const elementSection = pageObject.getRow(parentId);
    this.parent.toggleUI(!!elementSection?.elements?.length);
  }

  redo(): void { }
}
