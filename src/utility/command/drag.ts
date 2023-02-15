import { ICommand } from "./interface";
interface IDataColumn {
  column: number;
  columnSpan: number;
}

export class DragElementCommand implements ICommand {
  private element: HTMLElement;
  private dropElm: HTMLElement;
  private oldDataColumn: IDataColumn;

  constructor(element: HTMLElement, dropElm: HTMLElement) {
    this.element = element;
    this.dropElm = dropElm;
    this.oldDataColumn = {
      column: Number(element.dataset.column),
      columnSpan: Number(element.dataset.columnSpan)
    }
  }

  execute(): void {
    this.dropElm.style.border = "";
    const column = Number(this.dropElm.getAttribute('data-column'));
    const grid = this.dropElm.closest('.grid');
    const columnSpan = Number(this.element.dataset.columnSpan);
    let startCol = column;
    let distance = (12 - columnSpan) + 1;
    if (columnSpan > 1 && column > distance)
      startCol = distance;
    this.element.style.gridRow = '1';
    this.element.style.gridColumn = `${startCol} / span ${columnSpan}`;
    this.element.setAttribute('data-column', `${startCol}`);
    grid.appendChild(this.element);
  }

  undo(): void {
    this.element.style.gridRow = '1';
    this.element.style.gridColumn = `${this.oldDataColumn.column} / span ${this.oldDataColumn.columnSpan}`;
    this.element.setAttribute('data-column', `${this.oldDataColumn.column}`);
  }

  redo(): void {}
}
