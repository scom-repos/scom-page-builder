import { ICommand, IDataColumn, MAX_COLUMN, MIN_COLUMN } from "./interface";
import { pageObject } from "../store/index";
import { Control } from "@ijstech/components";
import { getColumn, getColumnSpan, getNextColumn, getPrevColumn, resetColumnData, updateColumnData } from "./columnUtils";

export class DragElementCommand implements ICommand {
  private element: any;
  private dropElm: HTMLElement;
  private oldDataColumn: IDataColumn;
  private oldDataRow: string;
  private data: any;
  private oldDataColumnMap: any[] = [];

  constructor(element: any, dropElm: HTMLElement) {
    this.element = element;
    this.dropElm = dropElm;
    this.oldDataColumn = {
      column: Number(element.dataset.column),
      columnSpan: Number(element.dataset.columnSpan)
    }
    const pageRow = element.closest('ide-row') as Control;
    this.oldDataRow = (pageRow?.id || '').replace('row-', '');
    this.data = JSON.parse(JSON.stringify(element.data));
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
    if (!isNaN(dropElmCol)) {
      let columnSpan = getColumnSpan(this.element);
      const maxColumn = (MAX_COLUMN - columnSpan) + 1;
      let newColumn = (columnSpan > 1 && dropElmCol > maxColumn) ? maxColumn : dropElmCol;
      let newColumnSpan = columnSpan;
      let prevDropElm = null;
      let afterDropElm = null;
      let currentSpan = 0;
      currentSpan = sortedSections.reduce((result: number, el: Control) => {
        if (!el.contains(this.element)) {
          const elCol = getColumn(el);
          result += getColumnSpan(el);
          if (getColumn(this.dropElm as Control) > elCol && (!prevDropElm || (prevDropElm && getColumn(prevDropElm) < elCol))) {
            prevDropElm = el;
          }
          if (getColumn(this.dropElm as Control) < elCol && (!afterDropElm || (afterDropElm && getColumn(afterDropElm) > elCol))) {
            afterDropElm = el;
          }
        }
        return result;
      }, 0);

      if (prevDropElm) {
        const prevColumn = getColumn(prevDropElm);
        const prevColumnSpan = getColumnSpan(prevDropElm);
        const columnData = prevColumn + prevColumnSpan;
        if (columnData < 13 && newColumn < columnData)
          newColumn = columnData;
      }
      if (afterDropElm) {
        const afterColumn = getColumn(afterDropElm);
        if (newColumn + columnSpan > afterColumn)
          newColumnSpan = afterColumn - newColumn;
      }
      const finalColumnSpan = Math.max(Math.min(newColumnSpan, MAX_COLUMN - currentSpan), 1);
      return { column: newColumn, columnSpan: finalColumnSpan };
    } else {
      const dropSection = this.dropElm.closest('ide-section') as Control;
      if (dropSection) {
        const pageRow = this.dropElm.closest('ide-row') as Control;
        const pageRowId = (pageRow?.id || '').replace('row-', '');
        let newColumn = getNextColumn(dropSection);
        if (pageRow.contains(this.element)) {
          const elementIndex = sortedSections.findIndex(el => getColumn(el as Control) === getColumn(this.element));
          const dropIndex = sortedSections.findIndex(el => getColumn(el as Control) === getColumn(dropSection));
          if (getColumn(this.element) > getColumn(dropSection)) {
            for (let j = elementIndex + 1; j < dropIndex; j++) {
              const elm = sortedSections[j] as Control;
              this.updateData(elm, pageRowId, getColumn(elm) + getColumnSpan(this.element));
            }
          } else if (getColumn(this.element) < getColumn(dropSection)) {
            for (let j = elementIndex - 1; j >= dropIndex; j--) {
              const elm = sortedSections[j] as Control;
              this.updateData(elm, pageRowId, getColumn(elm) - getColumnSpan(this.element));
            }
          }
          newColumn = getNextColumn(dropSection);
          return {column: newColumn, columnSpan: getColumnSpan(this.element)};
        }

        const hasSpace = sortedSections.find((section: Control) => getColumnSpan(section) > MIN_COLUMN);
        if (!hasSpace && sortedSections.length >= 6) return null;

        const columnSpan = Math.min(getColumnSpan(this.element), MIN_COLUMN);
        for (let i = 0; i < sortedSections.length; i++) {
          const el = sortedSections[i] as Control;
          const prevElm = sortedSections[i - 1] as Control;
          const nextElm = sortedSections[i + 1] as Control;

          if (getColumnSpan(el) > columnSpan) {
            const newElColSpan = getColumnSpan(el) - columnSpan;
            if (getColumn(dropSection) < getColumn(el)) {
              const nextPos = getColumn(el) - getColumnSpan(nextElm);
              if (getColumn(nextElm) !== nextPos && nextPos !== getNextColumn(dropSection)) {
                this.updateData(nextElm, pageRowId, nextPos);
              }
              this.updateData(el, pageRowId, getColumn(el) + columnSpan, newElColSpan);
              newColumn = getNextColumn(dropSection);
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
              newColumn = getNextColumn(dropSection);
            } else {
              this.updateData(el, pageRowId, getColumn(el), newElColSpan);
              newColumn = getColumn(el) + newElColSpan;
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
            newColumn = getNextColumn(dropSection);
          }
        }
        return { column: newColumn, columnSpan };
      }
    }
    return null;
  }

  execute(): void {
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

    if (!elementRow.isEqualNode(dropRow)) {
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
