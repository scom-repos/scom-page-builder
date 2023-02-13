import { Control } from "@ijstech/components";
import { pageObject } from "../../store/index";
import { ICommand } from "./interface";

export class ResizeElementCommand implements ICommand {
  private element: Control;
  private parent: any;
  private initialWidth: string;
  private initialHeight: string;
  private finalWidth: string;
  private finalHeight: string;

  constructor(parent: any, element: Control, initialWidth: number|string, initialHeight: number|string) {
    this.parent = parent;
    this.element = element;
    this.finalWidth = typeof element.width === 'number' ? `${element.width}px` : element.width;
    this.finalHeight = typeof element.height === 'number' ? `${element.height}px` : element.height;
    this.initialWidth = typeof initialWidth === 'number' ? `${initialWidth}px` : initialWidth;
    this.initialHeight = typeof initialHeight === 'number' ? `${initialHeight}px` : initialHeight;
  }

  execute(): void {
    this.element.style.width = this.finalWidth;
    this.element.style.height = this.finalHeight;
    if (this.parent) {
      const rowId = this.parent.rowId;
      const elementId = this.parent.elementId;
      const data = this.parent?.data?.properties || {};
      pageObject.setElement(rowId, elementId, {...data, width: this.finalWidth, height: this.finalHeight});
    }
  }

  undo(): void {
    this.element.style.width = this.initialWidth;
    this.element.style.height = this.initialHeight;
    if (this.parent) {
      const rowId = this.parent.rowId;
      const elementId = this.parent.elementId;
      const data = this.parent?.data?.properties || {};
      pageObject.setElement(rowId, elementId, {...data, width: this.initialWidth, height: this.initialHeight});
    }
  }

  redo(): void {}
}
