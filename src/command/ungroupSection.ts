import { ICommand } from "./interface";
import { pageObject } from "../store/index";
import { Control } from "@ijstech/components";
import { application } from "@ijstech/components";
import { EVENT } from "../const/index";
import { ElementType } from "../interface/index";

export class UngroupSectionCommand implements ICommand {
    private draggingToolbar: any;
    private parent: any;
    private dropElm: Control;
    private data: any;
    private isReGroup: boolean;
    private prevSection: Control;
    private oriCol: number;
    private oriColSpan: number;
    private oriElmIndex: number;
    private appendElm: any;

  constructor(data: any, isReGroup: boolean, dragElm: Control, dropElm: Control) {
    const oriRowId = dragElm.closest('ide-row').id.replace("row-", "");
    const dragSection = dragElm.closest('ide-section') as Control;

    const oriSectionData = pageObject.getElement(oriRowId, dragSection.id);
    this.data = JSON.parse(JSON.stringify(data));
    this.dropElm = dropElm;
    this.prevSection = dragSection;
    this.parent = dropElm.closest('ide-row');
    this.isReGroup = isReGroup;
    this.draggingToolbar = dragElm.closest('ide-toolbar');
    this.oriCol = parseInt(this.data.column);
    this.oriColSpan = this.data.columnSpan;
    const elmId = dragElm.id.replace("elm-", "");
    this.oriElmIndex = oriSectionData.elements.findIndex(e => e.id === elmId);
  }

  async execute() {

    // regroup with new section
    if (this.isReGroup) {
      // TODO

    // simple ungroup
    } else {
        const prevRow = this.prevSection.closest && this.prevSection.closest('ide-row') as any;
        const rowId = prevRow.id.replace("row-", "")
        const elmId = this.draggingToolbar.id.replace("elm-", "")
        const currentElm = prevRow?.querySelector(`ide-toolbar#${this.draggingToolbar.id}`);
        if (currentElm?.data) {
          this.data = JSON.parse(JSON.stringify(currentElm.data));
        }
        if (!this.draggingToolbar.closest('ide-row') && currentElm) {
          this.draggingToolbar = currentElm;
        }

        // delete elm in the old section
        pageObject.removeElement(rowId, elmId);
        const sectionEl = this.draggingToolbar.closest('ide-section');
        this.draggingToolbar.remove();
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

        this.appendElm = await this.parent.addElement(newElData);
        const parentId = this.parent.id.replace('row-', '');
        pageObject.addElement(parentId, newElData);
        const elementRowId = (this.parent?.id || '').replace('row-', '');
        const elementSection = pageObject.getRow(elementRowId);
        this.parent.toggleUI(!!elementSection?.elements?.length);
    }  
  }


  async undo() {

    if (this.isReGroup) {
      // TODO

    } else {

      // delete the elm
      const row = this.dropElm.closest('ide-row') as any;
      const rowId = row? row.id.replace("row-", "") : undefined;
      const elmId = this.draggingToolbar.id.replace("elm-", "");
      pageObject.removeElement(rowId, elmId);

      const sectionEl = this.draggingToolbar.closest('ide-section');
      this.draggingToolbar.remove();
      const section = pageObject.getRow(rowId);
      const isEmpty = !section?.elements?.length || section?.elements.every(el => el.type === "composite" && !el.elements?.length);
      row && row.toggleUI(!isEmpty);
      if (!this.prevSection.id || this.prevSection.id === elmId) {
          const hasSectionData = !!section?.elements?.find(elm => elm.id === sectionEl?.id);
          if (sectionEl && !hasSectionData) sectionEl.remove();
      } else {
          const parentElement = (section?.elements || []).find(elm => elm.id === this.prevSection.id);
          const hasSectionData = !!parentElement?.elements?.length;
          if (sectionEl && !hasSectionData) sectionEl.remove();
      }
      application.EventBus.dispatch(EVENT.ON_UPDATE_SECTIONS);

      // merge the elms
      const isMicroDapps = this.data?.module?.category === 'micro-dapps';
      const newElData = {
          id: this.data.id,
          column: this.oriCol,
          columnSpan: this.oriColSpan,
          type: this.data.type,
          properties: {
            showHeader: isMicroDapps,
            showFooter: isMicroDapps
          },
          module: this.data.module
      };

      const elmParent = (this.appendElm ? this.appendElm.closest('ide-row') : this.dropElm.closest('ide-row')) as Control;
      const newParent = this.prevSection.closest('ide-row') as Control;
      const prevSectionId = this.prevSection.id;
      if (this.appendElm && elmParent) {
        this.appendElm = elmParent.querySelector(`[id='${this.data.id}']`) as Control;
      }
      const dropRowId = newParent?.id.replace('row-', '');
      const dropSection = newParent.querySelector(`[id='${prevSectionId}']`) as Control;
  
      const dropSectionData = pageObject.getElement(dropRowId, prevSectionId);
      const clonedDropSecData = JSON.parse(JSON.stringify(dropSectionData));
  
      if (!prevSectionId || !dropRowId || !dropSectionData) return;
  
      const elementList = [newElData];
      if (clonedDropSecData?.type === ElementType.COMPOSITE) {
        for (let i = 0; i < elementList.length; i++) {
          pageObject.addElement(dropRowId, elementList[i], prevSectionId, this.oriElmIndex + i + 1);
        }
      } else if (clonedDropSecData?.type === ElementType.PRIMITIVE) {
        const updatedList = [...elementList].map(elm => {
          elm.column = clonedDropSecData.column;
          elm.columnSpan = clonedDropSecData.columnSpan;
          return elm;
        })
        pageObject.setElement(dropRowId, prevSectionId, {
          type: ElementType.COMPOSITE,
          elements: [clonedDropSecData, ...updatedList],
          dropId: this.data?.id || ''
        })
      }
      const newDropData = pageObject.getElement(dropRowId, prevSectionId);
      (dropSection as any).setData(dropRowId, newDropData);
      if (elmParent) {
        const elementRowId = (elmParent?.id || '').replace('row-', '');
        const elementSection = pageObject.getRow(elementRowId);
        if (elementRowId !== dropRowId && this.appendElm)
          pageObject.removeElement(elementRowId, this.appendElm.id);
          elmParent.visible = !!elementSection?.elements?.length;
      }
      if (this.appendElm) this.appendElm.remove();
    }
  }

  redo(): void {}
}
