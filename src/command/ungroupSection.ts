import { ICommand } from "./interface";
import { pageObject } from "../store/index";
import { Control } from "@ijstech/components";
import { application } from "@ijstech/components";
import { EVENT } from "../const/index";

export class UngroupSectionCommand implements ICommand {
    private element: any;
    private parent: any;
    private dropElm: Control;
    private data: any;
    private oldDataColumnMap: any[] = [];
    private isReGroup: boolean;
    private prevSection: Control;

  constructor(data: any, isReGroup: boolean, elm: Control, dropElm: Control, prevSection: Control, parent?: any) {
    this.data = JSON.parse(JSON.stringify(data));
    this.dropElm = dropElm;
    this.prevSection = prevSection;
    this.parent = parent || dropElm.closest('ide-row');
    this.isReGroup = isReGroup;
    this.element = elm.closest('ide-toolbar');
  }

  async execute() {

    // regroup with new section
    if (this.isReGroup) {
    
    // simple ungroup
    } else {
        const prevRow = this.prevSection.closest && this.prevSection.closest('ide-row') as any;
        const rowId = prevRow.id.replace("row-", "")
        const elmId = this.element.id.replace("elm-", "")

        const currentElm = prevRow?.querySelector(`ide-toolbar#${this.element.id}`);
        if (currentElm?.data) {
          this.data = JSON.parse(JSON.stringify(currentElm.data));
        }
        if (!this.element.closest('ide-row') && currentElm) {
          this.element = currentElm;
        }

        // delete elm in the old section
        pageObject.removeElement(rowId, elmId);
        const sectionEl = this.element.closest('ide-section');
        this.element.remove();
        const section = pageObject.getRow(rowId);
        const isEmpty = !section?.elements?.length || section?.elements.every(el => el.type === "composite" && !el.elements?.length);
        prevRow && prevRow.toggleUI(!isEmpty);
        if (!this.prevSection.id || this.prevSection.id === elmId) {
            const hasSectionData = !!section?.elements?.find(elm => elm.id === sectionEl?.id);
            if (sectionEl && !hasSectionData) sectionEl.remove();
        } else {
            const parentElement = (section?.elements || []).find(elm => elm.id === this.prevSection.id);
            const hasSectionData = !!parentElement?.elements?.length;
            if (sectionEl && !hasSectionData) sectionEl.remove();
        }
        application.EventBus.dispatch(EVENT.ON_UPDATE_SECTIONS);

        // create elm in a new section
        const isMicroDapps = this.data?.module?.category === 'micro-dapps';
        const newElData = {
            id: this.data.id,
            column: parseInt(this.dropElm.dataset.column),
            columnSpan: this.data.columnSpan,
            type: this.data.type,
            properties: {
              showHeader: isMicroDapps,
              showFooter: isMicroDapps
            },
            module: this.data.module
        };

        this.element = await this.parent.addElement(newElData);
        const parentId = this.parent.id.replace('row-', '');
        pageObject.addElement(parentId, newElData);
        const elementRowId = (this.parent?.id || '').replace('row-', '');
        const elementSection = pageObject.getRow(elementRowId);
        this.parent.toggleUI(!!elementSection?.elements?.length);
    }  
  }


  undo(): void {
    // TODO
  }

  redo(): void {}
}
