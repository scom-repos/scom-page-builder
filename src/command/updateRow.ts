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

  constructor(element: Control, parent: any, data: any, isDeleted?: boolean, prependId?: string, appendId?: string) {
    this.element = element;
    this.data = JSON.parse(JSON.stringify(data));
    this.rowId = data.id;
    this.parent = parent || document.body;
    this.isDeleted = typeof isDeleted === 'boolean' ? isDeleted : false;
    this.prependId = prependId || '';
    this.appendId = appendId || '';
  }

  private addEventBus() {
    const toolbars = this.element.querySelectorAll('ide-toolbar');
    for (let toolbar of toolbars) {
      toolbar && toolbar.onShow();
    }
  }

  private removeEventBus() {
    const toolbars = this.element.querySelectorAll('ide-toolbar');
    for (let toolbar of toolbars) {
      toolbar && toolbar.onHide();
    }
  }

  execute(): void {
    this.element.parent = this.parent as Control;
    if (this.isDeleted) {
      this.removeEventBus();
      this.parent.removeChild(this.element);
      pageObject.removeRow(this.rowId);
      application.EventBus.dispatch(EVENT.ON_UPDATE_SECTIONS);
    } else {
      this.parent.appendChild(this.element);
      this.addEventBus();
      let index = -1;
      if (this.prependId) {
        const prependRow = this.parent.querySelector(`#${this.prependId}`);
        prependRow && prependRow.insertAdjacentElement('afterend', this.element);
        const prependId = this.prependId.replace('row-', '');
        const prependIndex = prependId ? pageObject.sections.findIndex(section => section.id === prependId) : -1;
        index = prependIndex === -1 ? -1 : prependIndex + 1;
        const prependRowContainer = prependRow.querySelector('#pnlRowContainer');
        const rowContainer = this.element.querySelector('#pnlRowContainer');
        if (this.element.getAttribute('data-cloned') && prependRowContainer && rowContainer) {
          rowContainer.style.setProperty('--background-main', prependRowContainer.style.getPropertyValue('--background-main'))
          rowContainer.style.setProperty('--text-primary', prependRowContainer.style.getPropertyValue('--text-primary'))
        }
      } else if (this.appendId) {
        const appendRow = this.parent.querySelector(`#${this.appendId}`);
        if (appendRow) {
          appendRow.insertAdjacentElement('afterend', this.element);
          this.element.insertAdjacentElement('afterend', appendRow);
        }
        const appendId = this.appendId.replace('row-', '');
        index = appendId ? pageObject.sections.findIndex(section => section.id === appendId) : -1;
      }
      pageObject.addRow(this.data, this.rowId, index);
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
      this.addEventBus();
      const prependRow = this.prependId && this.parent.querySelector(`#${this.prependId}`);
      if (prependRow) {
        prependRow.insertAdjacentElement('afterend', this.element);
        const prependId = this.prependId.replace('row-', '');
        const prependIndex = prependId ? pageObject.sections.findIndex(section => section.id === prependId) : -1;
        pageObject.addRow(this.data, this.rowId, prependIndex === -1 ? -1 : prependIndex + 1);
      } else {
        const appendId = this.appendId.replace('row-', '');
        const appendIndex = appendId ? pageObject.sections.findIndex(section => section.id === appendId) : -1;
        if (this.appendId) {
          const appendRow = this.parent.querySelector(`#${this.appendId}`);
          if (appendRow) {
            appendRow.insertAdjacentElement('afterend', this.element);
            this.element.insertAdjacentElement('afterend', appendRow);
          }
        }
        pageObject.addRow(this.data, this.rowId, appendIndex);
      }
      application.EventBus.dispatch(EVENT.ON_UPDATE_SECTIONS);
    } else {
      this.removeEventBus();
      this.element.remove();
      this.data && pageObject.removeRow(this.rowId);
    }
    if (this.element?.toggleUI) {
      const isEmpty = !this.data?.elements?.length || this.data?.elements.every(el => el.type === "composite" && !el.elements?.length);
      this.element.toggleUI(!isEmpty);
    }
  }

  redo(): void {}
}
