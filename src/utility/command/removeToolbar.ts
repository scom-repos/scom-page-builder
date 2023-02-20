import { pageObject } from "../../store/index";
import { ICommand } from "./interface";

export class RemoveToolbarCommand implements ICommand {
  private element: any;
  private pageRow: any;
  private data: any;
  private rowId: string;
  private elementId: string;

  constructor(element: any) {
    this.element = element;
    this.data = this.element.data;
    this.rowId = this.element.rowId;
    this.elementId = this.element.elementId;
    this.pageRow = this.element.closest('ide-row');
  }

  execute(): void {
    this.element.remove();
    pageObject.removeElement(this.rowId, this.elementId);
    const section = pageObject.getSection(this.rowId);
    if (this.pageRow) {
      const toolbars = this.pageRow.querySelectorAll('ide-toolbar');
      this.pageRow.visible = toolbars.length;  //TODO: check with !!section.elements.length
    }
  }

  undo(): void {
    pageObject.addElement(this.rowId, this.elementId, this.data);
    const section = pageObject.getSection(this.rowId);
    if (this.pageRow) {
      this.pageRow.setData(section);
      this.pageRow.visible = true;
    }
  }

  redo(): void {}
}
