import { ICommand } from "./interface";
import { pageObject } from "../store/index";
import { Control } from "@ijstech/components";
import { application } from "@ijstech/components";
import { EVENT } from "../const/index";
import { IMergeType } from "./interface";
import { findNearestSectionInRow, getDropFrontBackResult } from '../utility/index'

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
  private clientX: number;
  private clientY: number;

  constructor(dragToolbar: Control, dragSection: Control, dropElm: Control, config: any, mergeType: IMergeType, clientX?: number, clientY?: number) {
    // set dragging related params
    this.dragToolbarId = dragToolbar.id.replace('elm-', '');
    this.dragRowId = dragToolbar.closest('ide-row').id.replace('row-', '');
    this.dragSectionId = dragSection.id;
    this.oriDragRowData = JSON.parse(JSON.stringify(pageObject.getRow(this.dragRowId)));

    // set dropping related params
    this.dropElm = dropElm;
    this.dropRowId = dropElm.closest('ide-row').id.replace('row-', '');
    this.dropSectionId = dropElm.closest('ide-section')?.id;
    this.oriDropRowData = JSON.parse(JSON.stringify(pageObject.getRow(this.dropRowId)));
    this.data = JSON.parse(JSON.stringify((dragToolbar as any).data));

    this.config = config;
    this.mergeType = mergeType;
    this.clientX = clientX;
    this.clientY = clientY;
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
    } else if (this.mergeType == "none") {
      // simple ungroup
      const MAX_COLUMN = pageObject.getColumnsNumber(this.dropRowId);
      if (!this.clientX && !this.clientY) {
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
          module: this.data.module,
          tag: this.data.tag
        };
        this.appendElm = await dropRow.addElement(newElData);
        pageObject.addElement(this.dropRowId, newElData);
        const dropSectionData = pageObject.getRow(this.dropRowId);
        dropRow.toggleUI(!!dropSectionData?.elements?.length);
      } else {
        const nearestDropSection = findNearestSectionInRow(dropRow, this.clientX, this.clientY, false)
        const nearestDropSectionBound = nearestDropSection.getBoundingClientRect();
        const middleLine = nearestDropSectionBound.left + nearestDropSectionBound.width/2;
        const isFront = (this.clientX < middleLine) ? true : false;
        const targetSection = nearestDropSection;
        await this.moveSection(dropRow, dragRow, targetSection, dragSection, isFront);
      }
    } else {
      const isFront = this.mergeType == "front";
      const dropSection = (dropRow as HTMLElement).querySelector(`[id='${this.dropSectionId}']`) as any;
      await this.moveSection(dropRow, dragRow, dropSection, dragSection, isFront);
    }
  }

  async moveSection(dropRow: any, dragRow: any, nearestDropSection: any, dragSection: any, isFront: boolean) {

    const dragSectionCol = parseInt(nearestDropSection.dataset.column);
    const dragSectionColSpan = parseInt(nearestDropSection.dataset.columnSpan);
    const newData = getDropFrontBackResult(dropRow, nearestDropSection, dragSectionCol, dragSectionColSpan, isFront, this.data);

    if (newData) {
      if (newData.newRowData) {
        dropRow.setData(newData.newRowData);
      }
      this.appendElm = await dropRow.addElement(newData.newElmdata);
      pageObject.addElement(this.dropRowId, newData.newElmdata);
    } else {
      dropRow.setData(this.oriDropRowData)
      pageObject.setRow(this.oriDropRowData, this.dropRowId)

      dragRow.setData(this.oriDragRowData)
      pageObject.setRow(this.oriDragRowData, this.dragRowId)
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

  redo(): void { }
}
