import { ICommand } from "./interface";
import { pageObject } from "../store/index";
import { Control } from "@ijstech/components";
import { application } from "@ijstech/components";
import { EVENT } from "../const/index";
import { IMergeType } from "./type"

export class UngroupElementCommand implements ICommand {
  private dragToolbarId: string;
  private dragSectionId: string;
  private dragRowId: string;
  private oriDragRowData: any;

  private dropElm: Control;
  private dropSectionId: string;
  private dropRowId: string;
  private oriDropRowData: any;

  private data: any;
  private appendElm: any;
  private config: any;
  private mergeType: IMergeType;

  constructor(dragToolbar: Control, dragSection: Control, dropElm: Control, config: any, mergeType: IMergeType) {
    // set dragging related params
    this.dragToolbarId = dragToolbar.id.replace('elm-', '');
    this.dragRowId = dragToolbar.closest('ide-row').id.replace('row-', '');
    this.dragSectionId = dragSection.id;
    this.oriDragRowData = JSON.parse(JSON.stringify(pageObject.getRow(this.dragRowId)));

    // set dropping  related params
    this.dropElm = dropElm;
    this.dropRowId = dropElm.closest('ide-row').id.replace('row-', '');
    this.dropSectionId = dropElm.closest('ide-section')?.id;
    this.oriDropRowData = JSON.parse(JSON.stringify(pageObject.getRow(this.dropRowId)));
    this.data = JSON.parse(JSON.stringify((dragToolbar as any).data));

    this.config = config;
    this.mergeType = mergeType;
  }

  async execute() {
    const dropRow = document.getElementById(`row-${this.dropRowId}`) as any;
    const dragRow = document.getElementById(`row-${this.dragRowId}`) as any;
    if (!dropRow) return;
    const dragSection = (dragRow as HTMLElement).querySelector(`[id='${this.dragSectionId}']`) as any;
    const currentElm = (dragRow as HTMLElement)?.querySelector(`ide-toolbar#elm-${this.dragToolbarId}`) as any;
    if (currentElm?.data) {
      this.data = JSON.parse(JSON.stringify(currentElm.data));
    }

    // delete elm in the old section
    pageObject.removeElement(this.dragRowId, this.dragToolbarId, true);
    const removeToolbar = document.getElementById(`elm-${this.dragToolbarId}`);
    const removeSection = document.getElementById(this.dragSectionId);
    removeToolbar && removeToolbar.remove();
    const section = JSON.parse(JSON.stringify(pageObject.getRow(this.dragRowId)));
    if (!this.dragSectionId || this.dragSectionId === this.dragToolbarId) {
      const hasSectionData = !!section?.elements?.find(elm => elm.id === removeSection?.id);
      if (removeSection && !hasSectionData) removeSection.remove();
    } else {
      const parentElement = (section?.elements || []).find(elm => elm.id === this.dragSectionId);
      const hasSectionData = !!parentElement?.elements?.length;
      if (removeSection && !hasSectionData) removeSection.remove();
    }
    if (dragSection.data && dragSection.data.elements && dragSection.data.elements.length && dragSection.data.elements.length == 1) {
      pageObject.setElement(this.dragRowId, this.dragSectionId, dragSection.data.elements[0])
    }

    application.EventBus.dispatch(EVENT.ON_UPDATE_SECTIONS);

    const MAX_COLUMN = pageObject.getColumnsNumber(this.dropRowId);
    if (this.mergeType == "top" || this.mergeType == "bottom") {
      // regroup with new section
      const dropSection = (dropRow as HTMLElement).querySelector(`[id='${this.dropSectionId}']`) as Control;
      const dragEnterElm = dropRow.closest('#pageBuilder').querySelector('.is-dragenter')
      if (!dragEnterElm) return;
      const dropToolbarId = (dragEnterElm.closest('ide-toolbar') as any)?.elementId;

      const dropSectionData = pageObject.getElement(this.dropRowId, this.dropSectionId);
      const clonedDropSecData = JSON.parse(JSON.stringify(dropSectionData));
      if (!this.dropSectionId || !this.dropRowId || !dropSectionData) return;
      this.data.column = clonedDropSecData.column;
      this.data.columnSpan = clonedDropSecData.columnSpan;

      const isComposite: boolean = clonedDropSecData?.elements && clonedDropSecData?.elements.length && clonedDropSecData?.elements.length > 0;
      if (isComposite) {
        const elementIndex: number = dropToolbarId ? dropSectionData.elements.findIndex(elm => elm.id === dropToolbarId) : -1;
        const idx: number = (this.mergeType == "bottom") ? elementIndex + 1 : elementIndex;
        pageObject.addElement(this.dropRowId, this.data, this.dropSectionId, idx);
      } else if (!isComposite) {
        if (this.dropSectionId === clonedDropSecData.id) clonedDropSecData.id = this.config.id;
        pageObject.setElement(this.dropRowId, this.dropSectionId, {
          elements: [clonedDropSecData, this.data],
          dropId: this.data?.id || ''
        })
      }
      const newDropData = pageObject.getElement(this.dropRowId, this.dropSectionId);
      (dropSection as any).setData(this.dropRowId, newDropData);
    } else if (this.mergeType=="none") {
      // simple ungroup
      let dropColumn = parseInt(this.dropElm?.dataset?.column) || 1
      const emptySpace = this.data.columnSpan - ((MAX_COLUMN - dropColumn) + 1)
      if (emptySpace > 0) dropColumn = dropColumn - emptySpace
      const dropColumnSpan = Math.min((MAX_COLUMN - dropColumn) + 1, this.data.columnSpan)

      let spaces = 0;
      const dropRowData = JSON.parse(JSON.stringify(pageObject.getRow(this.dropRowId)));
      const sortedSectionList = dropRowData.elements.sort((a, b) => a.column - b.column);
      for (let i = 0; i < sortedSectionList.length; i++) {
        const section = sortedSectionList[i];
        spaces += Number(section.columnSpan);
      }
      const newColumnSpan = MAX_COLUMN - spaces > 0 ? Math.min(MAX_COLUMN - spaces, dropColumnSpan) : dropColumnSpan;
      const newElData = {
        id: this.data.id,
        column: dropColumn,
        columnSpan: newColumnSpan,
        properties: this.data.properties,
        module: this.data.module
      };
      this.appendElm = await dropRow.addElement(newElData);
      pageObject.addElement(this.dropRowId, newElData);
      const dropSectionData = pageObject.getRow(this.dropRowId);
      dropRow.toggleUI(!!dropSectionData?.elements?.length);
    } else {
      // drop on the back/front block of a section
      const dropRowData = pageObject.getRow(this.dropRowId);
      const dropSection = (dropRow as HTMLElement).querySelector(`[id='${this.dropSectionId}']`) as any;

      // if the space left is enough: simply ungroup it
      const sortedSectionList = dropRowData.elements.sort((a, b) => a.column - b.column);
      // const dragSectionIdx = sortedSectionList.findIndex((e) => e.column === parseInt(this.data.column));
      const dropSectionIdx = sortedSectionList.findIndex((e) => e.column === parseInt(dropSection.data.column));
      const isFront = this.mergeType == "front";

      // drag to front block and ungroup
      const frontLimit: number = isFront? 
        (dropSectionIdx == 0)? 1 : sortedSectionList[dropSectionIdx-1].column + sortedSectionList[dropSectionIdx-1].columnSpan :
        sortedSectionList[dropSectionIdx].column + sortedSectionList[dropSectionIdx].columnSpan;

      const backLimit: number = isFront?  
        sortedSectionList[dropSectionIdx].column - 1 :
        (dropSectionIdx == sortedSectionList.length-1)? MAX_COLUMN : sortedSectionList[dropSectionIdx+1].column - 1;

      const emptySpace = backLimit - frontLimit + 1;

      // the columnSpan of new element should be same with the original section's
      if (emptySpace >= dragSection.columnSpan) {
        // have enough space to place the dragging toolbar
        const newColumn = isFront? 
          sortedSectionList[dropSectionIdx].column - this.data.columnSpan :
          sortedSectionList[dropSectionIdx].column + sortedSectionList[dropSectionIdx].columnSpan;
        const newElData = {
          id: this.data.id,
          column: newColumn,
          columnSpan: this.data.columnSpan,
          properties: this.data.properties,
          module: this.data.module
        };
        this.appendElm = await dropRow.addElement(newElData);
        pageObject.addElement(this.dropRowId, newElData);

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
        this.appendElm = await dropRow.addElement(newElData);
        pageObject.addElement(this.dropRowId, newElData);

      } else {
        // if no any space, check if moving the current section can allocate enough space for the new section
        const softBackLimit = (dropSectionIdx==sortedSectionList.length-1)? MAX_COLUMN : sortedSectionList[dropSectionIdx+1].column-1;
        const softFrontLimit = (dropSectionIdx==0)? 1 : sortedSectionList[dropSectionIdx-1].column + sortedSectionList[dropSectionIdx-1].columnSpan;
        const softEmptySpace = isFront? 
          softBackLimit - frontLimit + 1 :
          backLimit - softFrontLimit + 1 ;
        
        if (softEmptySpace>=dragSection.columnSpan + sortedSectionList[dropSectionIdx].columnSpan) {
          // if moving the current section can allocate enough space for the new section, do it

          // move the currect section
          sortedSectionList[dropSectionIdx].column = isFront? 
            frontLimit + dragSection.columnSpan :
            MAX_COLUMN - dragSection.columnSpan*2 + 1;
          dropRowData.elements = sortedSectionList
          dropRow.setData(dropRowData);

          // add new section
          const newColumn = isFront?
            frontLimit :
            MAX_COLUMN - sortedSectionList[dropSectionIdx].columnSpan + 1;

          const newElData = {
            id: this.data.id,
            column: newColumn,
            columnSpan: dragSection.columnSpan,
            properties: this.data.properties,
            module: this.data.module
          };
          this.appendElm = await dropRow.addElement(newElData);
          pageObject.addElement(this.dropRowId, newElData);

        } else if (sortedSectionList[dropSectionIdx].columnSpan!=1) {
          // if moving the current section cannot allocate enough space for the new section,
          // check if the current section colSpan = 1

          // if the current section colSpan != 1, current section collapse to allocate space for new elm

          const splitIndex = Math.ceil(softEmptySpace / 2);

          // resize & move the currect section
          dropRow.clearData();

          sortedSectionList[dropSectionIdx].column = isFront?
            frontLimit + splitIndex :
            softFrontLimit ;

          sortedSectionList[dropSectionIdx].columnSpan = isFront? 
            softEmptySpace - splitIndex :
            splitIndex;

          const newRowData = {
            id: (dropRowData as any).id,
            row: (dropRowData as any).row,
            elements: sortedSectionList
          }
          dropRow.setData(newRowData);

          // add new section
          const newColumn = isFront? 
            frontLimit :
            softFrontLimit + splitIndex;

          const newColumnSpan = isFront? 
            splitIndex :
            softEmptySpace - splitIndex;

          const newElData = {
            id: this.data.id,
            column: newColumn,
            columnSpan: newColumnSpan,
            properties: this.data.properties,
            module: this.data.module
          };
          this.appendElm = await dropRow.addElement(newElData);
          pageObject.addElement(this.dropRowId, newElData);
        } else {
          // if the current section colSpan == 1, cannot resize and ungroup
          dropRow.setData(this.oriDropRowData)
          pageObject.setRow(this.oriDropRowData, this.dropRowId)

          dragRow.setData(this.oriDragRowData)
          pageObject.setRow(this.oriDragRowData, this.dragRowId)
        }
      }
      // const dropSectionData = pageObject.getRow(dropRowId);
      // this.dropRow.toggleUI(!!dropSectionData?.elements?.length);
    }
  }

  async undo() {

    // reset ui
    const dropRow = document.getElementById(`row-${this.dropRowId}`) as any;
    const dragRow = document.getElementById(`row-${this.dragRowId}`) as any;
    await dropRow.setData(this.oriDropRowData);
    await dragRow.setData(this.oriDragRowData);

    // reset data
    pageObject.setRow(this.oriDropRowData, this.dropRowId);
    pageObject.setRow(this.oriDragRowData, this.dragRowId);
  }

  redo(): void {}
}
