import { ICommand } from "./interface";
import { pageObject } from "../store/index";
import { Control } from "@ijstech/components";
import { application } from "@ijstech/components";
import { EVENT } from "../const/index";
import { IMergeType } from "./type"

export class UngroupElementCommand implements ICommand {
    private dragToolbar: any;
    private dragSection: any;
    private dragRow: any;
    private oriDragRowData: any;

    private dropElm: Control;
    private dropSection: Control;
    private dropRow: any;
    private oriDropRowData: any;

    private oriCol: number;
    private oriColSpan: number;
    private oriElmIndex: number;

    private data: any;
    private appendElm: any;
    private config: any;
    private mergeType: IMergeType;

  constructor(dragToolbar: Control, dropElm: Control, config: any, mergeType: IMergeType) {
    // set dragging related params
    this.dragToolbar = dragToolbar;
    this.dragRow = dragToolbar.closest('ide-row');
    this.dragSection = dragToolbar.closest('ide-section') as Control;
    this.oriDragRowData = JSON.parse(JSON.stringify(pageObject.getRow(this.dragRow.id.replace("row-", ""))));

    // set dropping  related params
    this.dropElm = dropElm;
    this.dropRow = dropElm.closest('ide-row');
    this.dropSection = dropElm.closest('ide-section')
    this.oriDropRowData = JSON.parse(JSON.stringify(pageObject.getRow(this.dropRow.id.replace("row-", ""))));

    const dragRowId = this.dragRow.id.replace("row-", "");
    const oriSectionData = pageObject.getElement(dragRowId, this.dragSection.id);
    this.data = JSON.parse(JSON.stringify((dragToolbar as any).data));
    this.oriCol = parseInt(this.data.column);
    this.oriColSpan = this.data.columnSpan;
    const elmId = dragToolbar.id.replace("elm-", "");
    this.oriElmIndex = oriSectionData.elements.findIndex(e => e.id === elmId);

    this.config = config;
    this.mergeType = mergeType;
  }

  async execute() {
    if (!this.dropRow) return;
    this.dragSection = this.dragRow.querySelector(`[id='${this.dragSection.id}']`);
    const dragRowId = this.dragRow?.id.replace("row-", "")
    const currentElm = this.dragRow?.querySelector(`ide-toolbar#${this.dragToolbar.id}`);
    if (currentElm?.data) {
      this.data = JSON.parse(JSON.stringify(currentElm.data));
    }
    if (!this.dropRow && currentElm) {
      this.dragToolbar = currentElm;
    }

    // delete elm in the old section
    const dragToolbarId = this.dragToolbar.id.replace("elm-", "")
    pageObject.removeElement(dragRowId, dragToolbarId, true);
    const sectionEl = this.dragToolbar.closest('ide-section');
    this.dragToolbar.remove();
    const section = pageObject.getRow(dragRowId);
    if (!this.dragSection.id || this.dragSection.id === dragToolbarId) {
        const hasSectionData = !!section?.elements?.find(elm => elm.id === sectionEl?.id);
        if (sectionEl && !hasSectionData) sectionEl.remove();
    } else {
        const parentElement = (section?.elements || []).find(elm => elm.id === this.dragSection.id);
        const hasSectionData = !!parentElement?.elements?.length;
        if (sectionEl && !hasSectionData) sectionEl.remove();
    }
    if (this.dragSection.data && this.dragSection.data.elements && this.dragSection.data.elements.length && this.dragSection.data.elements.length == 1) {
      pageObject.setElement(dragRowId, this.dragSection.id, this.dragSection.data.elements[0])
    }

    application.EventBus.dispatch(EVENT.ON_UPDATE_SECTIONS);

    const dropRowId = this.dropRow?.id.replace('row-', '');
    if (this.mergeType=="top" || this.mergeType=="bottom") {
      // regroup with new section
      const dragEnterElm = this.dropRow.closest('#pageBuilder').querySelector('.is-dragenter')
      if (!dragEnterElm) return;
      const dropToolbarId = (dragEnterElm.closest('ide-toolbar') as any)?.elementId;

      this.dropSection = this.dropRow.querySelector(`[id='${this.dropSection.id}']`) as Control;
      const dropSectionData = pageObject.getElement(dropRowId, this.dropSection.id);
      const clonedDropSecData = JSON.parse(JSON.stringify(dropSectionData));
      if (!this.dropSection.id || !dropRowId || !dropSectionData) return;
      this.data.column = clonedDropSecData.column;
      this.data.columnSpan = clonedDropSecData.columnSpan;
      
      const isComposite: boolean = clonedDropSecData?.elements && clonedDropSecData?.elements.length && clonedDropSecData?.elements.length > 0;
      if (isComposite) {
        const elementIndex: number = dropToolbarId ? dropSectionData.elements.findIndex(elm => elm.id === dropToolbarId) : -1;
        const idx: number = (this.mergeType == "bottom")? elementIndex + 1 : elementIndex;
        pageObject.addElement(dropRowId, this.data, this.dropSection.id, idx);
      } else if (!isComposite) {
        if (this.dropSection.id === clonedDropSecData.id) clonedDropSecData.id = this.config.id;
        pageObject.setElement(dropRowId, this.dropSection.id, {
          elements: [clonedDropSecData, this.data],
          dropId: this.data?.id || ''
        })
      }
      const newDropData = pageObject.getElement(dropRowId, this.dropSection.id);
      (this.dropSection as any).setData(dropRowId, newDropData);

    } else if (this.mergeType=="none") {
      // simple ungroup
      const newElData = {
        id: this.data.id,
        column: parseInt(this.dropElm.dataset.column),
        columnSpan: this.data.columnSpan,
        properties: this.data.properties,
        module: this.data.module
      };
      this.appendElm = await this.dropRow.addElement(newElData);
      pageObject.addElement(dropRowId, newElData);
      const dropSectionData = pageObject.getRow(dropRowId);
      this.dropRow.toggleUI(!!dropSectionData?.elements?.length);
    } else {
      // drop on the back/front block of a section
      const dropRowData = pageObject.getRow(dropRowId);

      // if the space left is enough: simply ungroup it
      const sortedSectionList = dropRowData.elements.sort((a, b) => a.column - b.column);
      const currSectionIdx = sortedSectionList.findIndex((e) => e.column === parseInt(this.data.column));
      if (this.mergeType == "front") {
        // drag to front block and ungroup
        const frontLimit: number = (currSectionIdx == 0)? 1 : 
          sortedSectionList[currSectionIdx-1].column + sortedSectionList[currSectionIdx-1].columnSpan - 1;
        const backLimit: number = sortedSectionList[currSectionIdx].column-1;
        const emptySpace = backLimit - frontLimit + 1;

        // the columnSpan of new element should be same with the original section's
        if (emptySpace >= sortedSectionList[currSectionIdx].columnSpan) {
          // have enough space to place the dragging toolbar
          const newElData = {
            id: this.data.id,
            column: sortedSectionList[currSectionIdx].column - this.data.columnSpan,
            columnSpan: this.data.columnSpan,
            properties: this.data.properties,
            module: this.data.module
          };
          this.appendElm = await this.dropRow.addElement(newElData);
          pageObject.addElement(dropRowId, newElData);

        } else if (emptySpace >= 1) {
          // no enough space to place the dragging toolbar
          // if emptySpace>=1, resize the dragging element to fit the space

          const newElData = {
            id: this.data.id,
            column: frontLimit,
            columnSpan: emptySpace,
            properties: this.data.properties,
            module: this.data.module
          };
          this.appendElm = await this.dropRow.addElement(newElData);
          pageObject.addElement(dropRowId, newElData);

        } else {
          // if no any space, check if moving the current section can allocate enough space for the new section
          const softBackLimit = (currSectionIdx==sortedSectionList.length-1)? 12 : sortedSectionList[currSectionIdx+1].column-1;
          const softEmptySpace = softBackLimit - frontLimit + 1;
          
          if (softEmptySpace>=sortedSectionList[currSectionIdx].columnSpan*2) {
            // if moving the current section can allocate enough space for the new section, do it

            // move the currect section
            sortedSectionList[currSectionIdx].column = frontLimit + sortedSectionList[currSectionIdx].columnSpan;
            dropRowData.elements = sortedSectionList
            this.dropRow.setData(dropRowData);

            // add new section
            const newElData = {
              id: this.data.id,
              column: frontLimit,
              columnSpan: sortedSectionList[currSectionIdx].columnSpan,
              properties: this.data.properties,
              module: this.data.module
            };
            this.appendElm = await this.dropRow.addElement(newElData);
            pageObject.addElement(dropRowId, newElData);

          } else if (sortedSectionList[currSectionIdx].columnSpan!=1) {
            // if moving the current section cannot allocate enough space for the new section,
            // check if the current section colSpan = 1

            // if the current section colSpan != 1, current section collapse to allocate space for new elm

            const splitIndex = softEmptySpace / 2;

            // resize & move the currect section
            this.dropRow.clearData();
            sortedSectionList[currSectionIdx].column = frontLimit + splitIndex;
            sortedSectionList[currSectionIdx].columnSpan = softEmptySpace - splitIndex;
            dropRowData.elements = sortedSectionList
            const newRowData = {
              id: (dropRowData as any).id,
              row: (dropRowData as any).row,
              elements: sortedSectionList
            }
            this.dropRow.setData(newRowData);

            // add new section
            const newElData = {
              id: this.data.id,
              column: frontLimit,
              columnSpan: splitIndex,
              properties: this.data.properties,
              module: this.data.module
            };
            this.appendElm = await this.dropRow.addElement(newElData);
            pageObject.addElement(dropRowId, newElData);
          } else {
            // if the current section colSpan == 1, cannot resize and ungroup
            this.dropRow.setData(this.oriDropRowData)
            this.dragRow.setData(this.oriDragRowData)
          }
        }
      } else {
        // drag to back block and ungroup
        const frontLimit: number = sortedSectionList[currSectionIdx].column + sortedSectionList[currSectionIdx].columnSpan;
        const backLimit: number = (currSectionIdx == sortedSectionList.length-1)? 12 : 
          sortedSectionList[currSectionIdx+1].column - 1;
        const emptySpace = backLimit - frontLimit;
        // the columnSpan of new element should be same with the original section's
        if (emptySpace >= sortedSectionList[currSectionIdx].columnSpan) {
          // have enough space to place the dragging toolbar
          const newElData = {
            id: this.data.id,
            column: sortedSectionList[currSectionIdx].column + sortedSectionList[currSectionIdx].columnSpan,
            columnSpan: this.data.columnSpan,
            properties: this.data.properties,
            module: this.data.module
          };
          this.appendElm = await this.dropRow.addElement(newElData);
          pageObject.addElement(dropRowId, newElData);

        } else if (emptySpace >= 1) {
          // no enough space to place the dragging toolbar
          // if emptySpace>=1, resize the dragging element to fit the space

          const newElData = {
            id: this.data.id,
            column: frontLimit,
            columnSpan: emptySpace,
            properties: this.data.properties,
            module: this.data.module
          };
          this.appendElm = await this.dropRow.addElement(newElData);
          pageObject.addElement(dropRowId, newElData);

        } else {
          // if no any space, check if moving the current section can allocate enough space for the new section
          const softFrontLimit = (currSectionIdx==0)? 1 : 
            sortedSectionList[currSectionIdx-1].column + sortedSectionList[currSectionIdx-1].columnSpan;
          const softEmptySpace = backLimit - softFrontLimit + 1;

          if (softEmptySpace>=sortedSectionList[currSectionIdx].columnSpan*2) {
            // if moving the current section can allocate enough space for the new section, do it

            // move the currect section
            sortedSectionList[currSectionIdx].column = 12 - sortedSectionList[currSectionIdx].columnSpan*2 + 1;
            dropRowData.elements = sortedSectionList
            this.dropRow.setData(dropRowData);

            // add new section
            const newElData = {
              id: this.data.id,
              column: 12 - sortedSectionList[currSectionIdx].columnSpan + 1,
              columnSpan: sortedSectionList[currSectionIdx].columnSpan,
              properties: this.data.properties,
              module: this.data.module
            };
            this.appendElm = await this.dropRow.addElement(newElData);
            pageObject.addElement(dropRowId, newElData);

          } else if (sortedSectionList[currSectionIdx].columnSpan!=1) {
            // if moving the current section cannot allocate enough space for the new section,
            // check if the current section colSpan = 1

            // if the current section colSpan != 1, current section collapse to allocate space for new elm

            const splitIndex = softEmptySpace / 2;

            // resize & move the currect section
            this.dropRow.clearData();
            sortedSectionList[currSectionIdx].column = softFrontLimit;
            sortedSectionList[currSectionIdx].columnSpan = splitIndex;
            dropRowData.elements = sortedSectionList
            const newRowData = {
              id: (dropRowData as any).id,
              row: (dropRowData as any).row,
              elements: sortedSectionList
            }
            this.dropRow.setData(newRowData);

            // add new section
            const newElData = {
              id: this.data.id,
              column: softFrontLimit + splitIndex,
              columnSpan: softEmptySpace - splitIndex,
              properties: this.data.properties,
              module: this.data.module
            };
            this.appendElm = await this.dropRow.addElement(newElData);
            pageObject.addElement(dropRowId, newElData);
          } else {
            // if the current section colSpan == 1, cannot resize and ungroup
            this.dropRow.setData(this.oriDropRowData)
            this.dragRow.setData(this.oriDragRowData)
          }
        }
      }
      // const dropSectionData = pageObject.getRow(dropRowId);
      // this.dropRow.toggleUI(!!dropSectionData?.elements?.length);
    }
  }

  async undo() {
    this.dragToolbar = this.dropRow.querySelector(`[id='${this.dragToolbar.id}']`) as Control;
    // delete the elm
    const row = this.dropRow;
    const rowId = row? row.id.replace("row-", "") : undefined;
    const elmId = this.dragToolbar.id.replace("elm-", "");
    pageObject.removeElement(rowId, elmId, true);
    
    const newElm = row.querySelector(`#elm-${elmId}`)
    if (newElm) {
      const sectionEl = newElm.closest('ide-section');
      newElm.remove();
      const section = pageObject.getRow(rowId);
      if (!this.dragSection.id || this.dragSection.id === elmId) {
        const hasSectionData = !!section?.elements?.find(elm => elm.id === sectionEl?.id);
        if (sectionEl && !hasSectionData) sectionEl.remove();
      } else {
        const parentElement = (section?.elements || []).find(elm => elm.id === this.dragSection.id);
        const hasSectionData = !!parentElement?.elements?.length;
        if (sectionEl && !hasSectionData) sectionEl.remove();
      }
    }
    application.EventBus.dispatch(EVENT.ON_UPDATE_SECTIONS);

    // merge the elms
    // const isMicroDapps = this.data?.module?.category === 'micro-dapps' || this.config?.module?.category === 'offers';
    const newElData = {
        id: this.data.id,
        column: this.oriCol,
        columnSpan: this.oriColSpan,
        properties: this.data.properties,
        module: this.data.module
    };

    const elmParent = (this.appendElm ? this.appendElm.closest('ide-row') : this.dropElm.closest('ide-row')) as Control;
    this.dragSection = this.dragRow.querySelector(`[id='${this.dragSection.id}']`) as Control;
    const newRow = this.dragSection.closest('ide-row') as Control;
    const prevSectionId = this.dragSection.id;
    if (this.appendElm && elmParent) {
      this.appendElm = elmParent.querySelector(`[id='${this.data.id}']`) as Control;
    }
    const dropRowId = newRow?.id.replace('row-', '');
    const dropSection = newRow && newRow.querySelector(`[id='${prevSectionId}']`) as Control;

    const dropSectionData = pageObject.getElement(dropRowId, prevSectionId);
    const clonedDropSecData = JSON.parse(JSON.stringify(dropSectionData));

    if (!prevSectionId || !dropRowId || !dropSectionData || !dropSection) return;

    const elementList = [newElData];
    
    const isComposite: boolean = clonedDropSecData?.elements && clonedDropSecData?.elements.length && clonedDropSecData?.elements.length > 0;
    if (isComposite) {
      const idx: number = (this.mergeType == "bottom")? this.oriElmIndex : this.oriElmIndex - 1;
      pageObject.addElement(dropRowId, newElData, prevSectionId, idx);
    } else {
      const updatedList = [...elementList].map(elm => {
        elm.column = clonedDropSecData.column;
        elm.columnSpan = clonedDropSecData.columnSpan;
        return elm;
      })
      pageObject.setElement(dropRowId, prevSectionId, {
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
