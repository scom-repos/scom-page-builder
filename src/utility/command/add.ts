import { application, Control } from "@ijstech/components";
import { EVENT } from "../../const/index";
import { pageObject } from "../../store/index";
import { ICommand } from "./interface";

export class ElementCommand implements ICommand {
  private element: Control;
  private parent: HTMLElement;
  private data: any
  private isDeleted: boolean = false;

  constructor(element: Control, parent: HTMLElement, data: any, isDeleted?: boolean) {
    this.element = element;
    this.data = data;
    this.parent = parent || document.body;
    this.isDeleted = typeof isDeleted === 'boolean' ? isDeleted : false;
  }

  execute(): void {
    this.element.parent = this.parent as Control;
    if (this.isDeleted) {
      this.parent.removeChild(this.element);
      pageObject.removeSection(this.data.id);
      application.EventBus.dispatch(EVENT.ON_UPDATE_SECTIONS);
    } else {
      this.parent.appendChild(this.element);
      pageObject.addSection(this.data);
    }
  }

  undo(): void {
    if (this.isDeleted) {
      this.parent.appendChild(this.element);
      const sibling = this.parent.children[this.data.row];
      if (sibling)
        this.parent.insertBefore(this.element, sibling);
      pageObject.addSection(this.data);
      application.EventBus.dispatch(EVENT.ON_UPDATE_SECTIONS);
    } else {
      this.element.remove();
      this.data && pageObject.removeSection(this.data.id);
    }
  }

  redo(): void {}
}
