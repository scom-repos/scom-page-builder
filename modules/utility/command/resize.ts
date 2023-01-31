import { Control } from "@ijstech/components";
import { ICommand } from "./interface";

export class ResizeElementCommand implements ICommand {
  private element: Control;
  private initialWidth: string;
  private initialHeight: string;
  private finalWidth: string;
  private finalHeight: string;

  constructor(element: Control, finalWidth: number|string, finalHeight: number|string) {
    this.element = element;
    this.initialWidth = typeof element.width === 'number' ? `${element.width}px` : element.width;
    this.initialHeight = typeof element.height === 'number' ? `${element.height}px` : element.height;
    this.finalWidth = typeof finalWidth === 'number' ? `${finalWidth}px` : finalWidth;
    this.finalHeight = typeof finalHeight === 'number' ? `${finalHeight}px` : finalHeight;
  }

  execute(): void {
    this.element.style.width = this.finalWidth;
    this.element.style.height = this.finalHeight;
  }

  undo(): void {
    this.element.style.width = this.initialWidth;
    this.element.style.height = this.initialHeight;
  }
}
