import { application } from "@ijstech/components";
import { EVENT } from "../const/index";
import { pageObject } from "../store/index";
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
    const currentElm = this.pageRow?.querySelector(`ide-toolbar#${this.element.id}`);
    if (currentElm?.data) {
      this.data = JSON.parse(JSON.stringify(currentElm.data));
    }
    if (!this.element.closest('ide-row') && currentElm) {
      this.element = currentElm;
    }
    this.element.onHide();
    pageObject.removeElement(this.rowId, this.elementId, true);
    const sectionEl = this.element.closest('ide-section');
    this.element.remove();
    const section = pageObject.getRow(this.rowId);
    const isEmpty = !section?.elements?.length || section?.elements.every(el => !Object.keys(el.module || {}).length && !el.elements?.length);
    this.pageRow && this.pageRow.toggleUI(!isEmpty);
    if (!this.sectionId || this.sectionId === this.elementId) {
      const hasSectionData = !!section?.elements?.find(elm => elm.id === sectionEl?.id);
      if (sectionEl && !hasSectionData) sectionEl.remove();
    } else {
      const parentElement = (section?.elements || []).find(elm => elm.id === this.sectionId);
      const hasSectionData = !!parentElement?.elements?.length;
      if (sectionEl && !hasSectionData) sectionEl.remove();
    }
    application.EventBus.dispatch(EVENT.ON_UPDATE_SECTIONS);
  }

  undo(): void {
    pageObject.addElement(this.rowId, this.data, this.sectionId, this.elementIndex);
    const section = pageObject.getRow(this.rowId);
    const clonedSection = JSON.parse(JSON.stringify(section));
    if (this.pageRow && (this.rowId !== 'header' && this.rowId !== 'footer')) {
      this.pageRow.setData({ ...clonedSection, id: this.rowId });
      this.pageRow.toggleUI(true);
    }
    application.EventBus.dispatch(EVENT.ON_UPDATE_SECTIONS);
  }

  redo(): void { }
}
