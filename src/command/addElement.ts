import { Control } from "@ijstech/components";
import { pageObject } from "../store/index";
import { ICommand, MAX_COLUMN, MIN_COLUMN } from "./interface";
import { generateUUID } from "../utility/index";
import { getColumn, getColumnSpan, getNextColumn, getPrevColumn, resetColumnData, updateColumnData } from "./columnUtils";

export class AddElementCommand implements ICommand {
  private element: any;
  private parent: any;
  private data: any
  private sectionId: string = '';
  private isAppend: boolean = true;
  private oldDataColumnMap: any[] = [];

  constructor(parent: any, data: any, isAppend: boolean, sectionId?: string) {
    this.data = JSON.parse(JSON.stringify(data));
    this.parent = parent;
    this.sectionId = sectionId || '';
    this.isAppend = isAppend;
  }

  private updateData(el: Control, rowId: string, column?: number, columnSpan?: number) {
    if (!column && !columnSpan) return;
    const oldColumnData = {el, rowId, column: getColumn(el), columnSpan: getColumnSpan(el)};
    this.oldDataColumnMap.push(oldColumnData);
    updateColumnData(el, rowId, column, columnSpan);
  }

  private getNewColumn(oldDropColumn: number) {
    const dropSection = document.getElementById(`${this.sectionId}`) as Control;
    if (!dropSection) return oldDropColumn;
    return this.isAppend ? getNextColumn(dropSection) : oldDropColumn;
  }

  private getColumnData() {
    if (!this.sectionId) return null;
    const dropSection = document.getElementById(`${this.sectionId}`) as Control;
    if (!dropSection) return null;

    const grid = dropSection.closest('.grid');
    const sections = Array.from(grid?.querySelectorAll('ide-section'));
    const sortedSections = sections.sort((a: HTMLElement, b: HTMLElement) => Number(b.dataset.column) - Number(a.dataset.column));

    const pageRow = dropSection.closest('ide-row') as Control;
    const pageRowId = (pageRow?.id || '').replace('row-', '');
    const oldDropColumn = getColumn(dropSection);
    let newColumn = this.getNewColumn(oldDropColumn);
    const hasSpace = sortedSections.find((section: Control) => getColumnSpan(section) > MIN_COLUMN);
    if (!hasSpace && sortedSections.length >= 6) return null;

    const columnSpan = MIN_COLUMN;
    if (!this.isAppend) {
      this.updateData(dropSection, pageRowId, columnSpan + newColumn);
    }
    for (let i = 0; i < sortedSections.length; i++) {
      const el = sortedSections[i] as Control;
      const prevElm = sortedSections[i - 1] as Control;
      const nextElm = sortedSections[i + 1] as Control;

      if (getColumnSpan(el) > columnSpan) {
        const newElColSpan = getColumnSpan(el) - columnSpan;
        if (getColumn(dropSection) < getColumn(el)) {
          const nextPos = getColumn(el) - getColumnSpan(nextElm);
          if (getColumn(nextElm) !== nextPos && nextPos !== getNextColumn(dropSection))
            this.updateData(nextElm, pageRowId, nextPos);
          this.updateData(el, pageRowId, getColumn(el) + columnSpan, newElColSpan);
          newColumn = this.getNewColumn(oldDropColumn);
        } else if (getColumn(dropSection) > getColumn(el)) {
          this.updateData(el, pageRowId, getColumn(el), newElColSpan);
          if (prevElm) {
            for (let j = i - 1; j >= 0; j--) {
              const elm = sortedSections[j] as Control;
              const newElmCol = getColumn(elm) - columnSpan;
              if (newElmCol !== getNextColumn(dropSection))
                this.updateData(elm, pageRowId, newElmCol);
            }
          }
          newColumn = this.getNewColumn(oldDropColumn);
        } else {
          this.updateData(el, pageRowId, getColumn(el), newElColSpan);
          newColumn = this.isAppend ? getColumn(el) + newElColSpan : oldDropColumn;
        }
        break;
      } else {
        if (getNextColumn(el) < MAX_COLUMN + 1 && i === 0) {
          this.updateData(el, pageRowId, (MAX_COLUMN + 1) - getColumnSpan(el));
        }
        if (nextElm) {
          const canUpdated = getNextColumn(nextElm) !== getColumn(el) &&
            getColumnSpan(nextElm) <= MIN_COLUMN;
          if (canUpdated) {
            if (getColumn(dropSection) < getColumn(el)) {
              const pos = getColumn(el) - getColumnSpan(nextElm);
              pos !== getNextColumn(dropSection) && this.updateData(nextElm, pageRowId, pos);
            } else if (getColumn(dropSection) > getColumn(el)) {
              for (let j = i; j >= 0; j--) {
                const elm = sortedSections[j] as Control;
                if (getPrevColumn(elm) !== getNextColumn(dropSection)) {
                  this.updateData(elm, pageRowId, getPrevColumn(elm));
                }
              }
            } else {
              this.updateData(el, pageRowId, getPrevColumn(dropSection));
            }
          }
        }
        newColumn = this.getNewColumn(oldDropColumn);
      }
    }
    return { column: newColumn, columnSpan };
  }

  async execute() {
    const { column, columnSpan } = this.getColumnData() || {};
    if (!column && !columnSpan) return;
    const isMicroDapps= this.data?.module?.category === 'micro-dapps';
    const newElData = {
      id: generateUUID(),
      column,
      columnSpan,
      type: this.data.type,
      properties: {
        showHeader: isMicroDapps,
        showFooter: isMicroDapps
      },
      module: this.data.module
    };
    this.element = await this.parent.addElement(newElData);
    const parentId = this.parent.id.replace('row-', '');
    pageObject.addElement(parentId, this.element.data || newElData);
  }

  undo(): void {
    this.element.remove();
    const parentId = this.parent.id.replace('row-', '');
    pageObject.removeElement(parentId, this.element.id);
    for (let columnData of this.oldDataColumnMap) {
      const { el, rowId, column, columnSpan } = columnData;
      resetColumnData(el, rowId, column, columnSpan);
    }
  }

  redo(): void {}
}
