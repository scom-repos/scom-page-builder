import { application } from "@ijstech/components";
import { EVENT } from "@page/const";
import { ICommand } from "./interface";

export class AddElementCommand implements ICommand {
  private element: HTMLElement;
  private parent: HTMLElement;

  constructor(element: HTMLElement, parent?: HTMLElement) {
    this.element = element;
    this.parent = parent || document.body;
  }

  execute(): void {
    this.parent.appendChild(this.element);
  }

  undo(): void {
    this.element.remove();
    application.EventBus.dispatch(EVENT.ON_UPDATE_SECTIONS);
  }
}