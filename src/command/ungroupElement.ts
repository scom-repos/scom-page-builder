import { ICommand } from "./interface";
import { pageObject } from "../store/index";
import { Control } from "@ijstech/components";
import { application } from "@ijstech/components";
import { EVENT } from "../const/index";

export class UngroupElementCommand implements ICommand {
    private draggingToolbar: any;
    private parent: any;
    private dropElm: Control;
    private data: any;
    private isReGroup: boolean;
    private prevParent: any;
    private prevSection: any;
    private newSection: Control;
    private oriCol: number;
    private oriColSpan: number;
    private oriElmIndex: number;
    private appendElm: any;
    private config: any;

  constructor(data: any, isReGroup: boolean, dragElm: Control, dropElm: Control, config: any) {
    this.prevParent = dragElm.closest('ide-row');
    const oriRowId = this.prevParent.id.replace("row-", "");
    const dragSection = dragElm.closest('ide-section') as Control;

    const oriSectionData = pageObject.getElement(oriRowId, dragSection.id);
    this.data = JSON.parse(JSON.stringify(data));
    this.dropElm = dropElm;
    this.prevSection = dragSection;
    this.parent = dropElm.closest('ide-row');
    this.isReGroup = isReGroup;
    this.draggingToolbar = dragElm.closest('ide-toolbar');
    this.newSection = dropElm.closest('ide-section')

    this.oriCol = parseInt(this.data.column);
    this.oriColSpan = this.data.columnSpan;
    const elmId = dragElm.id.replace("elm-", "");
    this.oriElmIndex = oriSectionData.elements.findIndex(e => e.id === elmId);
    this.config = config;
  }

  async execute() {
    if (!this.parent) return;
    this.prevSection = this.prevParent.querySelector(`[id='${this.prevSection.id}']`);
    const prevRow = this.prevSection.closest && this.prevSection.closest('ide-row') as any;
    const rowId = prevRow?.id.replace("row-", "")
    const elmId = this.draggingToolbar.id.replace("elm-", "")
    const currentElm = prevRow?.querySelector(`ide-toolbar#${this.draggingToolbar.id}`);
    if (currentElm?.data) {
      this.data = JSON.parse(JSON.stringify(currentElm.data));
      // this.data = this.getPrimitiveData(this.data)
    }
    if (!this.draggingToolbar.closest('ide-row') && currentElm) {
      this.draggingToolbar = currentElm;
    }

    // delete elm in the old section
    pageObject.removeElement(rowId, elmId, true);
    const sectionEl = this.draggingToolbar.closest('ide-section');
    this.draggingToolbar.remove();
    const section = pageObject.getRow(rowId);
    // const isEmpty = !section?.elements?.length || section?.elements.every(el => el.type === "composite" && !el.elements?.length);
    // prevRow && prevRow.toggleUI(!isEmpty);
    if (!this.prevSection.id || this.prevSection.id === elmId) {
        const hasSectionData = !!section?.elements?.find(elm => elm.id === sectionEl?.id);
        if (sectionEl && !hasSectionData) sectionEl.remove();
    } else {
        const parentElement = (section?.elements || []).find(elm => elm.id === this.prevSection.id);
        const hasSectionData = !!parentElement?.elements?.length;
        if (sectionEl && !hasSectionData) sectionEl.remove();
    }
    if (this.prevSection.data && this.prevSection.data.elements && this.prevSection.data.elements.length && this.prevSection.data.elements.length == 1) {
      pageObject.setElement(rowId, this.prevSection.id, this.prevSection.data.elements[0])
    }

    application.EventBus.dispatch(EVENT.ON_UPDATE_SECTIONS);

    // regroup with new section
    if (this.isReGroup) {
      this.newSection = this.parent.querySelector(`[id='${this.newSection.id}']`) as Control;
      const dropRow = this.newSection.closest('ide-row')
      const dropRowId = dropRow?.id.replace('row-', '');
      const dropSectionId = this.newSection.id
      const dropSection = this.newSection;
      const dropSectionData = pageObject.getElement(dropRowId, dropSectionId);
      const clonedDropSecData = JSON.parse(JSON.stringify(dropSectionData));
      if (!dropSectionId || !dropRowId || !dropSectionData) return;
      const newElement = this.getPrimitiveData(this.data);
      newElement.column = clonedDropSecData.column;
      newElement.columnSpan = clonedDropSecData.columnSpan;
      const dropElementId = (this.dropElm.closest('ide-toolbar') as any)?.elementId;
      const isComposite: boolean = clonedDropSecData?.elements && clonedDropSecData?.elements.length && clonedDropSecData?.elements.length > 0;
      if (isComposite) {
        const elementIndex = dropElementId ? dropSectionData.elements.findIndex(elm => elm.id === dropElementId) : -1;
        pageObject.addElement(dropRowId, newElement, dropSectionId, elementIndex + 1);
      } else if (!isComposite) {
        if (dropSectionId === clonedDropSecData.id) clonedDropSecData.id = this.config.id;
        pageObject.setElement(dropRowId, dropSectionId, {
          // type: ElementType.COMPOSITE, // to be removed
          elements: [clonedDropSecData, newElement],
          dropId: this.data?.id || ''
        })
      }
      const newDropData = pageObject.getElement(dropRowId, dropSectionId);
      (dropSection as any).setData(dropRowId, newDropData);

    // simple ungroup
    } else {
        // create elm in a new section
        // this.newId = generateUUID();
        const isMicroDapps = this.data?.module?.category === 'micro-dapps';
        const newElData = {
            id: this.data.id,
            column: parseInt(this.dropElm.dataset.column),
            columnSpan: this.data.columnSpan,
            // type: this.data.type, // to be removed
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

  // temporary workaround
  private getPrimitiveData(data: any) {
    if (data.elements && data.elements.length && data.elements.length > 0)
      return this.getPrimitiveData(data.elements[0]);
    else
      return data;
  }

  async undo() {
    this.draggingToolbar = this.parent.querySelector(`[id='${this.draggingToolbar.id}']`) as Control;
    // delete the elm
    const row = this.parent;
    const rowId = row? row.id.replace("row-", "") : undefined;
    const elmId = this.draggingToolbar.id.replace("elm-", "");
    pageObject.removeElement(rowId, elmId, true);
    
    const newElm = row.querySelector(`#elm-${elmId}`)
    if (newElm) {
      const sectionEl = newElm.closest('ide-section');
      newElm.remove();
      const section = pageObject.getRow(rowId);
      if (!this.prevSection.id || this.prevSection.id === elmId) {
        const hasSectionData = !!section?.elements?.find(elm => elm.id === sectionEl?.id);
        if (sectionEl && !hasSectionData) sectionEl.remove();
      } else {
        const parentElement = (section?.elements || []).find(elm => elm.id === this.prevSection.id);
        const hasSectionData = !!parentElement?.elements?.length;
        if (sectionEl && !hasSectionData) sectionEl.remove();
      }
    }
    application.EventBus.dispatch(EVENT.ON_UPDATE_SECTIONS);

    // merge the elms
    const isMicroDapps = this.data?.module?.category === 'micro-dapps';
    const newElData = {
        id: this.data.id,
        column: this.oriCol,
        columnSpan: this.oriColSpan,
        // type: this.data.type, // to be removed
        properties: {
          showHeader: isMicroDapps,
          showFooter: isMicroDapps
        },
        module: this.data.module
    };

    const elmParent = (this.appendElm ? this.appendElm.closest('ide-row') : this.dropElm.closest('ide-row')) as Control;
    this.prevSection = this.prevParent.querySelector(`[id='${this.prevSection.id}']`) as Control;
    const newParent = this.prevSection.closest('ide-row') as Control;
    const prevSectionId = this.prevSection.id;
    if (this.appendElm && elmParent) {
      this.appendElm = elmParent.querySelector(`[id='${this.data.id}']`) as Control;
    }
    const dropRowId = newParent?.id.replace('row-', '');
    const dropSection = newParent && newParent.querySelector(`[id='${prevSectionId}']`) as Control;

    const dropSectionData = pageObject.getElement(dropRowId, prevSectionId);
    const clonedDropSecData = JSON.parse(JSON.stringify(dropSectionData));

    if (!prevSectionId || !dropRowId || !dropSectionData || !dropSection) return;

    const elementList = [newElData];
    
    const isComposite: boolean = clonedDropSecData?.elements && clonedDropSecData?.elements.length && clonedDropSecData?.elements.length > 0;
    if (isComposite) {
      pageObject.addElement(dropRowId, newElData, prevSectionId, this.oriElmIndex);
    } else {
      const updatedList = [...elementList].map(elm => {
        elm.column = clonedDropSecData.column;
        elm.columnSpan = clonedDropSecData.columnSpan;
        return elm;
      })
      pageObject.setElement(dropRowId, prevSectionId, {
        // type: ElementType.COMPOSITE, // to be removed
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
        pageObject.removeElement(elementRowId, this.appendElm.id, true);
        elmParent.visible = !!elementSection?.elements?.length;
    }
    if (this.appendElm) this.appendElm.remove();
  }

  redo(): void {}
}
