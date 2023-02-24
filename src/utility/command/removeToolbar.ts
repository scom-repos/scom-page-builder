import { application } from "@ijstech/components";
import { EVENT } from "../../const/index";
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
    const section = pageObject.getRow(this.rowId);
    if (this.pageRow) {
      this.pageRow.visible = !!section?.elements?.length;
    }
    application.EventBus.dispatch(EVENT.ON_UPDATE_SECTIONS);
  }

  undo(): void {
    pageObject.addElement(this.rowId, this.data);
    const section = pageObject.getRow(this.rowId);
    const clonedSection = JSON.parse(JSON.stringify(section));
    if (this.pageRow) {
      this.pageRow.setData({...clonedSection, id: this.rowId});
      this.pageRow.visible = true;
    }
    application.EventBus.dispatch(EVENT.ON_UPDATE_SECTIONS);
  }

  redo(): void {}
}
