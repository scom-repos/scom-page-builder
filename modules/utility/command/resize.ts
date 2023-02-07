import { Control } from "@ijstech/components";
import { ICommand } from "./interface";

export class ResizeElementCommand implements ICommand {
  private element: Control;
  private initialWidth: string;
  private initialHeight: string;
  private finalWidth: string;
  private finalHeight: string;

  constructor(element: Control, initialWidth: number|string, initialHeight: number|string) {
    this.element = element;
    this.finalWidth = typeof element.width === 'number' ? `${element.width}px` : element.width;
    this.finalHeight = typeof element.height === 'number' ? `${element.height}px` : element.height;
    this.initialWidth = typeof initialWidth === 'number' ? `${initialWidth}px` : initialWidth;
    this.initialHeight = typeof initialHeight === 'number' ? `${initialHeight}px` : initialHeight;
  }

  execute(): void {
    this.element.style.width = this.finalWidth;
    this.element.style.height = this.finalHeight;
    const initData = (this.element as any).data || {};
    if ((this.element as any).setData)
      (this.element as any).setData({...initData, width: this.finalWidth, height: this.finalHeight});
  }

  undo(): void {
    this.element.style.width = this.initialWidth;
    this.element.style.height = this.initialHeight;
    const initData = (this.element as any).data || {};
    if ((this.element as any).setData)
      (this.element as any).setData({...initData, width: this.initialWidth, height: this.initialHeight});
  }

  redo(): void {}
}
