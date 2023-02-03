import { Control } from "@ijstech/components";
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
    if (!this.parent.contains(this.element)) return;
    const rows = this.parent.querySelectorAll('.dropzone') || [];
    for (let i = 0; i < rows.length; i++) {
      if (this.element.isEqualNode(rows[i])) { this.dragIndex = i; }
      if (this.dropElm.isEqualNode(rows[i])) { this.dropIndex = i; }
    }
    if (this.dataList.length) {
      const [dragRowData] = this.dataList.splice(this.dragIndex, 1);
      this.dataList.splice(this.dropIndex, 0, dragRowData);
    }
    if (this.dragIndex < this.dropIndex) {
      this.parent.insertBefore(this.element, this.dropElm.nextSibling);
    } else {
      this.parent.insertBefore(this.element, this.dropElm);
    }
    let templateColumns = [];
    const length = this.parent.children.length;
    const unitWidth = Number(this.parent.offsetWidth) / 12;
    for (let i = 0; i < length; i++) {
      templateColumns.push(i === this.dropIndex ? 'minmax(auto, 100%)' : `${unitWidth}px`);
    }
    (this.parent as any).templateColumns = templateColumns;
  }

  undo(): void {
    if (!this.parent.contains(this.element)) return;
    if (this.dataList.length) {
      const [dragRowData] = this.dataList.splice(this.dropIndex, 1);
      this.dataList.splice(this.dragIndex, 0, dragRowData);
    }
    const rows = this.parent.querySelectorAll('.dropzone') || [];
    for (let i = 0; i < rows.length; i++) {
      if (i === this.dragIndex) {
        const temp = rows[i];
        this.parent.replaceChild(this.element, rows[i]);
        this.parent.appendChild(temp);
      }
    }
    let templateColumns = [];
    const length = this.parent.children.length;
    const unitWidth = Number(this.parent.offsetWidth) / 12;
    for (let i = 0; i < length; i++) {
      templateColumns.push(i === this.dragIndex ? 'minmax(auto, 100%)' : `${unitWidth}px`);
    }
    (this.parent as any).templateColumns = templateColumns;
  }

  redo(): void {}
}
