import { Control } from "@ijstech/components";
import { pageObject } from "../../store/index";
import { ICommand } from "./interface";

export class UpdateElementCommand implements ICommand {
  private element: any;
  private color: string
  private oldColor: string;

  constructor(element: Control, color: string) {
    this.element = element;
    this.color = color;
    this.oldColor = this.element?.data?.color || '';
  }

  execute(): void {
    this.element.style.backgroundColor = this.color;
    const id = this.element.id.replace('row-', '');
    pageObject.updateSection(id, {backgroundColor: this.color});
  }

  undo(): void {
    this.element.style.backgroundColor = this.oldColor;
    const id = this.element.id.replace('row-', '');
    pageObject.updateSection(id, {backgroundColor: this.oldColor});
  }

  redo(): void {}
}
