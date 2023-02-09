import { Control } from "@ijstech/components";
import { pageObject } from "../../store/index";
import { ICommand } from "./interface";

export class AddElementCommand implements ICommand {
  private element: Control;
  private parent: HTMLElement;
  private data: any

  constructor(element: Control, parent?: HTMLElement, data?: any) {
    this.element = element;
    this.data = data;
    this.parent = parent || document.body;
  }

  execute(): void {
    this.element.parent = this.parent as Control;
    this.parent.appendChild(this.element);
    this.data && pageObject.addSection(this.data);
  }

  undo(): void {
    this.element.remove();
    this.data && pageObject.addSection(this.data.id);
  }

  redo(): void {}
}
