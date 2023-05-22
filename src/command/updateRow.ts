import { application, Control } from "@ijstech/components";
import { EVENT } from "../const/index";
import { pageObject } from "../store/index";
import { ICommand } from "./interface";

export class UpdateRowCommand implements ICommand {
  private element: any;
  private parent: any;
  private data: any
  private rowId: string;
  private isDeleted: boolean = false;
  private prependId: string = '';

  constructor(element: Control, parent: any, data: any, isDeleted?: boolean, prependId?: string) {
    this.element = element;
    this.data = JSON.parse(JSON.stringify(data));
    this.rowId = data.id;
    this.parent = parent || document.body;
    this.isDeleted = typeof isDeleted === 'boolean' ? isDeleted : false;
    this.prependId = prependId || '';
  }

  execute(): void {
    this.element.parent = this.parent as Control;
    if (this.isDeleted) {
      this.parent.removeChild(this.element);
      pageObject.removeRow(this.rowId);
      application.EventBus.dispatch(EVENT.ON_UPDATE_SECTIONS);
    } else {
      this.parent.appendChild(this.element);
      if (this.prependId) {
        const prependRow = this.parent.querySelector(`#${this.prependId}`);
        prependRow && prependRow.insertAdjacentElement('afterend', this.element);
      }
      console.log('add row', this.prependId)
      pageObject.addRow(this.data, this.rowId, this.prependId.replace('row-', ''));
    }
    if (this.element?.toggleUI) {
      const hasData = this.data?.elements?.length;
      this.element.toggleUI(hasData);
    }
  }

  undo(): void {
    if (this.isDeleted) {
      this.parent.appendChild(this.element);
      const sibling = this.parent.children[this.data.row];
      if (sibling)
        this.parent.insertBefore(this.element, sibling);
      pageObject.addRow(this.data, this.rowId);
      application.EventBus.dispatch(EVENT.ON_UPDATE_SECTIONS);
    } else {
      this.element.remove();
      this.data && pageObject.removeRow(this.rowId);
    }
    if (this.element?.toggleUI) {
      const hasData = this.data?.elements?.length;
      this.element.toggleUI(hasData);
    }
  }

  redo(): void {}
}
