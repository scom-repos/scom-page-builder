import { ICommand } from "./interface";

export class MoveElementCommand implements ICommand {
  private element: HTMLElement;
  private dropElm: HTMLElement;
  private parent: HTMLElement;
  private dataList: any[];
  private dragIndex: number = 0;
  private dropIndex: number = 0;

  constructor(element: HTMLElement, dropElm: HTMLElement, parent: HTMLElement, data?: any[]) {
    this.element = element;
    this.dropElm = dropElm;
    this.parent = parent;
    this.dataList = data || [];
  }

  execute(): void {
    const rows = this.parent.querySelectorAll('ide-row');
    for (let i = 0; i < rows.length; i++) {
      if (this.element.isEqualNode(rows[i])) { this.dragIndex = i; }
      if (this.dropElm.isEqualNode(rows[i])) { this.dropIndex = i; }
    }
    const [dragRowData] = this.dataList.splice(this.dragIndex, 1);
    this.dataList.splice(this.dropIndex, 0, dragRowData);

    if (this.dragIndex < this.dropIndex) {
      this.parent.insertBefore(this.element, this.dropElm.nextSibling);
    } else {
      this.parent.insertBefore(this.element, this.dropElm);
    }
  }

  undo(): void {
    const [dragRowData] = this.dataList.splice(this.dropIndex, 1);
    this.dataList.splice(this.dragIndex, 0, dragRowData);

    if (this.dragIndex < this.dropIndex) {
      this.parent.insertBefore(this.dropElm, this.element.nextSibling);
    } else {
      this.parent.insertBefore(this.dropElm, this.element);
    }
  }
}
