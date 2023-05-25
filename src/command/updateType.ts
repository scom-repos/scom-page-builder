import { ICommand } from "./interface";
import { pageObject } from "../store/index";
import { Control } from "@ijstech/components";
import { generateUUID } from "../utility/index";
import { ElementType, IElementConfig } from "../interface/index";

export class UpdateTypeCommand implements ICommand {
  private element: any;
  private elementParent: any;
  private dropParent: Control;
  private data: any;
  private oldDropData: any;
  private config: any;
  private dropSectionId: string;
  private isNew: boolean;

  constructor(dropElm: Control, element?: any, config?: IElementConfig) {
    this.element = element || null;
    this.elementParent = (element ? element.closest('ide-row') : dropElm.closest('ide-row')) as Control;
    this.dropParent = dropElm.closest('ide-row') as Control;
    this.data = element ? JSON.parse(JSON.stringify(element.data)) : null;
    this.config = config || null;
    const dropRowId = this.dropParent?.id.replace('row-', '');
    const dropSection = dropElm.closest('ide-section');
    this.dropSectionId = (dropSection?.id || '');
    this.oldDropData = JSON.parse(JSON.stringify(pageObject.getElement(dropRowId, this.dropSectionId)));
    this.isNew = !this.element;
  }

  private getElements() {
    if (this.isNew) {
      const isMicroDapps= this.config?.module?.category === 'micro-dapps';
      const newElData = {
        id: generateUUID(),
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
      if (this.data?.type === ElementType.COMPOSITE)
        return this.data?.elements || [];
      else
        return [this.data];
    }
  }

  execute(): void {
    if (this.element && this.elementParent) {
      this.element = this.elementParent.querySelector(`[id='${this.element.id}']`) as Control;
    }
    const dropRowId = this.dropParent?.id.replace('row-', '');
    const dropSection = this.dropParent.querySelector(`[id='${this.dropSectionId}']`) as Control;

    const dropSectionData = pageObject.getElement(dropRowId, this.dropSectionId);
    const clonedDropSecData = JSON.parse(JSON.stringify(dropSectionData));
    if (!this.dropSectionId || !dropRowId || !dropSectionData) return;

    const elementList = this.getElements();
    if (clonedDropSecData?.type === ElementType.COMPOSITE) {
      const elementIndex = dropSectionData.elements.findIndex(elm => elm.id === this.dropSectionId);
      for (let i = 0; i < elementList.length; i++) {
        pageObject.addElement(dropRowId, elementList[i], this.dropSectionId, elementIndex + i + 1);
      }
    } else if (clonedDropSecData?.type === ElementType.PRIMITIVE) {
      clonedDropSecData.id = generateUUID();
      pageObject.setElement(dropRowId, this.dropSectionId, {
        type: ElementType.COMPOSITE,
        elements: [clonedDropSecData, ...elementList],
        dropId: this.data?.id || ''
      })
    }
    const newDropData = pageObject.getElement(dropRowId, this.dropSectionId);
    (dropSection as any).setData(dropRowId, newDropData);
    if (this.isNew) return;
    if (this.elementParent) {
      const elementRowId = (this.elementParent?.id || '').replace('row-', '');
      const elementSection = pageObject.getRow(elementRowId);
      if (elementRowId !== dropRowId)
        pageObject.removeElement(elementRowId, this.element.id);
      this.elementParent.visible = !!elementSection?.elements?.length;
    }
    if (this.element) this.element.remove();
  }

  undo(): void {
    const dropRowId = this.dropParent?.id.replace('row-', '');
    const dropSection: any = this.dropParent.querySelector(`[id='${this.dropSectionId}']`);
    dropSection && dropSection.setData(dropRowId, this.oldDropData);
    pageObject.setElement(dropRowId, this.oldDropData.id, this.oldDropData);
    if (this.isNew) return;
    const rowId = (this.elementParent?.id || '').replace('row-', '');
    pageObject.addElement(rowId, this.data);
    if (this.elementParent) {
      const oldElementSection = pageObject.getRow(rowId);
      this.elementParent.visible = !!oldElementSection?.elements?.length;
    }
  }

  redo(): void {}
}
