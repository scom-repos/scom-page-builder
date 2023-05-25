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
  private appendId: string = '';

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
      const appendRow = this.element.nextElementSibling;
      this.appendId = appendRow?.id || '';
      this.parent.removeChild(this.element);
      pageObject.removeRow(this.rowId);
      application.EventBus.dispatch(EVENT.ON_UPDATE_SECTIONS);
    } else {
      this.parent.appendChild(this.element);
      if (this.prependId) {
        const prependRow = this.parent.querySelector(`#${this.prependId}`);
        prependRow && prependRow.insertAdjacentElement('afterend', this.element);
      }
      const prependId = this.prependId.replace('row-', '');
      const prependIndex = prependId ? pageObject.sections.findIndex(section => section.id === prependId) : -1;
      pageObject.addRow(this.data, this.rowId, prependIndex + 1);
    }
    if (this.element?.toggleUI) {
      const hasData = this.data?.elements?.length;
      this.element.toggleUI(hasData);
    }
  }

  undo(): void {
    if (this.isDeleted) {
      this.element.parent = this.parent;
      this.parent.appendChild(this.element);
      const prependRow = this.prependId && this.parent.querySelector(`#${this.prependId}`);
      if (prependRow) {
        prependRow.insertAdjacentElement('afterend', this.element);
        const prependId = this.prependId.replace('row-', '');
        const prependIndex = prependId ? pageObject.sections.findIndex(section => section.id === prependId) : -1;
        pageObject.addRow(this.data, this.rowId, prependIndex + 1);
      } else {
        const appendId = this.appendId.replace('row-', '');
        const appendIndex = appendId ? pageObject.sections.findIndex(section => section.id === appendId) : -1;
        if (this.appendId) {
          const appendRow = this.parent.querySelector(`#${this.appendId}`);
          appendRow && appendRow.insertAdjacentElement('afterend', this.element);
          this.element.insertAdjacentElement('afterend', appendRow);
        }
        pageObject.addRow(this.data, this.rowId, appendIndex);
      }
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
