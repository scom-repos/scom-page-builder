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
    pageObject.removeElement(this.rowId, this.elementId);
    const ideSection = this.element.closest('ide-section');
    if (ideSection) ideSection.remove();
    const section = pageObject.getSection(this.rowId);
    if (this.pageRow) {
      // const toolbars = this.pageRow.querySelectorAll('ide-toolbar');
      this.pageRow.visible = !!section?.elements?.length;
    }
  }

  undo(): void {
    pageObject.addElement(this.rowId, this.data);
    const section = pageObject.getSection(this.rowId);
    if (this.pageRow) {
      this.pageRow.setData(section);
      this.pageRow.visible = true;
    }
  }

  redo(): void {}
}
