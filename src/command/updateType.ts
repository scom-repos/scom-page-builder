import { ICommand } from "./interface";
import { pageObject } from "../store/index";
import { Control } from "@ijstech/components";
import { ElementType, IElementConfig } from "../interface/index";

export class UpdateTypeCommand implements ICommand {
  private element: any;
  private elementParent: any;
  private dropParent: any;
  private data: any;
  private oldDropData: any;
  private config: any;
  private dropSectionId: string;
  private dropElementIndex: number;
  private isNew: boolean;

  constructor(dropElm: Control, element?: any, config?: IElementConfig) {
    this.element = element || null;
    this.elementParent = (element ? element.closest('ide-row') : dropElm.closest('ide-row')) as Control;
    this.dropParent = dropElm.closest('ide-row') as Control;
    this.data = element ? JSON.parse(JSON.stringify(element.data)) : null;
    this.config = config ? JSON.parse(JSON.stringify(config)) : null;
    const dropRowId = this.dropParent?.id.replace('row-', '');
    const dropSection = dropElm.closest('ide-section');
    this.dropSectionId = (dropSection?.id || '');
    const toolbars = dropSection.querySelectorAll('ide-toolbar');
    const dropElementId = (dropElm.closest('ide-toolbar') as any)?.id.replace('elm-', '');
    this.dropElementIndex = Array.from(toolbars).findIndex(toolbar => dropElementId && (toolbar as any).elementId === dropElementId);
    this.oldDropData = JSON.parse(JSON.stringify(pageObject.getElement(dropRowId, this.dropSectionId)));
    this.isNew = !this.element;
  }

  private getElements() {
    if (this.isNew) {
      const isMicroDapps= this.config?.module?.category === 'micro-dapps';
      const newElData = {
        id: this.config.id,
        column: 1,
        columnSpan: 6,
        type: this.config?.type || ElementType.PRIMITIVE,
        properties: {
          showHeader: isMicroDapps,
          showFooter: isMicroDapps
        },
        module: this.config?.module || {}
      };
      return [newElData];
    } else {
      const clonedData = JSON.parse(JSON.stringify(this.data))
      if (clonedData?.type === ElementType.COMPOSITE)
        return clonedData?.elements || [];
      else
        return [clonedData];
    }
  }

  execute(): void {
    if (this.element && this.elementParent) {
      this.element = this.elementParent.querySelector(`[id='${this.data.id}']`) as Control;
      this.data = JSON.parse(JSON.stringify(this.element.data));
    }
    const dropRowId = this.dropParent?.id.replace('row-', '');
    const dropSection = this.dropParent.querySelector(`[id='${this.dropSectionId}']`) as Control;
    if (this.elementParent) {
      const elementRowId = (this.elementParent?.id || '').replace('row-', '');
      const elementSection = pageObject.getRow(elementRowId);
      if (elementRowId && this.element)
        pageObject.removeElement(elementRowId, this.element.id);
      this.elementParent.visible = !!elementSection?.elements?.length;
    }
    if (this.element) this.element.remove();

    const dropSectionData = pageObject.getElement(dropRowId, this.dropSectionId);
    const clonedDropSecData = JSON.parse(JSON.stringify(dropSectionData));
    if (!this.dropSectionId || !dropRowId || !dropSectionData) return;

    const elementList = this.getElements();
    if (clonedDropSecData?.type === ElementType.COMPOSITE) {
      for (let i = 0; i < elementList.length; i++) {
        pageObject.addElement(dropRowId, elementList[i], this.dropSectionId, this.dropElementIndex + i + 1);
      }
    } else if (clonedDropSecData?.type === ElementType.PRIMITIVE) {
      clonedDropSecData.id = this.config.id;
      const updatedList = [...elementList].map(elm => {
        elm.column = clonedDropSecData.column;
        elm.columnSpan = clonedDropSecData.columnSpan;
        return elm;
      })
      pageObject.setElement(dropRowId, this.dropSectionId, {
        type: ElementType.COMPOSITE,
        elements: [clonedDropSecData, ...updatedList],
        dropId: this.data?.id || ''
      })
    }
    const newDropData = pageObject.getElement(dropRowId, this.dropSectionId);
    (dropSection as any).setData(dropRowId, newDropData);
  }

  undo(): void {
    const dropRowId = this.dropParent?.id.replace('row-', '');
    const dropSection: any = this.dropParent.querySelector(`[id='${this.dropSectionId}']`);
    dropSection && dropSection.setData(dropRowId, this.oldDropData);
    pageObject.setElement(dropRowId, this.oldDropData.id, this.oldDropData);
    if (this.isNew) return;
    if (this.elementParent) {
      const rowId = (this.elementParent?.id || '').replace('row-', '');
      pageObject.addElement(rowId, this.data);
      this.elementParent.addElement(this.data);
      const oldElementSection = pageObject.getRow(rowId);
      this.elementParent.visible = !!oldElementSection?.elements?.length;
    }
  }

  redo(): void {}
}
