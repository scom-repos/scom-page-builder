import { Control } from "@ijstech/components";
import { pageObject } from "../../store/index";
import { ICommand } from "./interface";

export class ResizeElementCommand implements ICommand {
  private element: Control;
  private toolbar: any;
  private initialWidth: number;
  private initialHeight: number;
  private finalWidth: number;
  private finalHeight: number;

  constructor(element: Control, initialWidth: number, initialHeight: number) {
    this.element = element;
    this.toolbar = element.querySelector('ide-toolbar');
    this.finalWidth = Number(element.width);
    this.finalHeight = Number(element.height);
    this.initialWidth = initialWidth;
    this.initialHeight = initialHeight;
  }

  execute(): void {
    this.element.style.width = `${this.finalWidth}px`;
    this.element.style.height = `${this.finalHeight}px`;
    if (this.toolbar) {
      const rowId = this.toolbar.rowId;
      const elementId = this.toolbar.elementId;
      const data = this.toolbar?.data?.properties || {};
      pageObject.setElement(rowId, elementId, {...data, width: this.finalWidth, height: this.finalHeight});
    }
  }

  undo(): void {
    this.element.style.width = `${this.initialWidth}px`;
    this.element.style.height = `${this.initialHeight}px`;
    if (this.toolbar) {
      const rowId = this.toolbar.rowId;
      const elementId = this.toolbar.elementId;
      const data = this.toolbar?.data?.properties || {};
      pageObject.setElement(rowId, elementId, {...data, width: this.initialWidth, height: this.initialHeight});
    }
  }

  redo(): void {}
}
