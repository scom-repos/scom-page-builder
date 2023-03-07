import { application, Control } from "@ijstech/components";
import { EVENT } from "../../const/index";
import { pageObject } from "../../store/index";
import { ICommand } from "./interface";

export class RemoveToolbarCommand implements ICommand {
  private element: any;
  private pageRow: any;
  private data: any;
  private rowId: string;
  private elementId: string;
  private sectionId: string = '';
  private elementIndex: number;

  constructor(element: any) {
    this.element = element;
    this.data = JSON.parse(JSON.stringify(element.data));
    this.rowId = this.element.rowId;
    this.elementId = this.element.elementId;
    this.pageRow = this.element.closest('ide-row');
    const section = JSON.parse(JSON.stringify(pageObject.getRow(this.rowId)));
    const ideSection = this.element.closest('ide-section');
    this.sectionId = ideSection.id;
    if (this.sectionId !== this.elementId) {
      const parentElm = ideSection.id && section.elements.find(el => el.id === this.sectionId);
      if (parentElm)
        this.elementIndex = parentElm.elements.findIndex(el => el.id === this.elementId);
    }
  }

  execute(): void {
    pageObject.removeElement(this.rowId, this.elementId);
    this.element.remove();
    const section = pageObject.getRow(this.rowId);
    if (this.pageRow) {
      if (!this.sectionId || this.sectionId === this.elementId) {
        this.pageRow.visible = !!section?.elements?.length;
      } else {
        const parentElement = (section?.elements || []).find(elm => elm.id === this.sectionId);
        this.pageRow.visible = !!parentElement?.elements?.length;
      }
    }
    application.EventBus.dispatch(EVENT.ON_UPDATE_SECTIONS);
  }

  undo(): void {
    pageObject.addElement(this.rowId, this.data, this.sectionId, this.elementIndex);
    const section = pageObject.getRow(this.rowId);
    const clonedSection = JSON.parse(JSON.stringify(section));
    if (this.pageRow && (this.rowId !== 'header' && this.rowId !== 'footer')) {
      this.pageRow.setData({...clonedSection, id: this.rowId});
      this.pageRow.visible = true;
    }
    application.EventBus.dispatch(EVENT.ON_UPDATE_SECTIONS);
  }

  redo(): void {}
}
