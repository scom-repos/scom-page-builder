import { application, Control } from "@ijstech/components";
import { EVENT } from "../../const/index";
import { ICommand } from "./interface";

export class AddElementCommand implements ICommand {
  private element: Control;
  private parent: HTMLElement;

  constructor(element: Control, parent?: HTMLElement) {
    this.element = element;
    this.parent = parent || document.body;
  }

  execute(): void {
    this.element.parent = this.parent as Control;
    this.parent.appendChild(this.element);
  }

  undo(): void {
    this.element.remove();
    application.EventBus.dispatch(EVENT.ON_UPDATE_SECTIONS);
  }

  redo(): void {}
}