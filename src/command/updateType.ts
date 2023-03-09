import { ICommand } from "./interface";
import { pageObject } from "../store/index";
import { Control } from "@ijstech/components";
import { generateUUID } from "../utility/index";
import { ElementType } from "../interface/index";

export class UpdateTypeCommand implements ICommand {
  private element: any;
  private dropElm: Control;
  private oldDataRow: string;
  private data: any;
  private oldDropData: any;

  constructor(element: any, dropElm: Control) {
    this.element = element;
    this.dropElm = dropElm;
    const pageRow = element.closest('ide-row') as Control;
    this.oldDataRow = (pageRow?.id || '').replace('row-', '');
    this.data = JSON.parse(JSON.stringify(element.data));
    const dropToolbar = this.dropElm.closest('ide-toolbar') as any;
    const dropRowId = dropToolbar?.rowId;
    const dropSection = this.dropElm.closest('ide-section');
    const dropSectionId = (dropSection?.id || '');
    this.oldDropData = JSON.parse(JSON.stringify(pageObject.getElement(dropRowId, dropSectionId)));
  }

  private getElements() {
    if (this.data?.type === ElementType.COMPOSITE)
      return this.data?.elements || [];
    else
      return [this.data];
  }

  execute(): void {
    this.dropElm.style.border = "";
    const dropToolbar = this.dropElm.closest('ide-toolbar') as any;
    if (!dropToolbar) return;
    const dropRowId = dropToolbar?.rowId;
    const dropToolbarId = dropToolbar?.elementId;
    const dropSection = dropToolbar.parent.closest('ide-section');
    const dropSectionId = (dropSection?.id || '');
    const dropSectionData = pageObject.getElement(dropRowId, dropSectionId);
    const clonedDropSecData = JSON.parse(JSON.stringify(dropSectionData));
    if (!dropSectionId || !dropRowId || !dropSectionData) return;

    if (clonedDropSecData?.type === ElementType.COMPOSITE) {
      const elementIndex = dropSectionData.elements.findIndex(elm => elm.id === dropToolbarId);
      const elementList = this.getElements();
      for (let i = 0; i < elementList.length; i++) {
        pageObject.addElement(dropRowId, elementList[i], dropSectionId, elementIndex + i + 1);
      }
    } else if (clonedDropSecData?.type === ElementType.PRIMITIVE) {
      const elementList = this.getElements();
      clonedDropSecData.id = generateUUID();
      pageObject.setElement(dropRowId, dropSectionId, {
        type: ElementType.COMPOSITE,
        elements: [clonedDropSecData, ...elementList]
      })
    }

    (dropSection as any).setData(dropRowId, pageObject.getElement(dropRowId, dropSectionId));

    const elementRow = this.element.closest('ide-row') as Control;
    const elementRowId = (elementRow?.id || '').replace('row-', '');
    pageObject.removeElement(elementRowId, this.element.id);

    const elementSection = pageObject.getRow(elementRowId);
    elementRow.visible = !!elementSection?.elements?.length;
  }

  undo(): void {
    const dropToolbar = this.dropElm.closest('ide-toolbar') as any;
    const dropRowId = dropToolbar?.rowId;
    const dropSection = dropToolbar.parent.closest('ide-section');
    dropSection && (dropSection as any).setData(dropRowId, this.oldDropData);
    pageObject.setElement(dropRowId, this.oldDropData.id, this.oldDropData);

    const oldElementRow = document.querySelector(`#row-${this.oldDataRow}`) as Control;
    pageObject.addElement(this.oldDataRow, this.data);

    const oldElementSection = pageObject.getRow(this.oldDataRow);
    oldElementRow && (oldElementRow.visible = !!oldElementSection?.elements?.length);
  }

  redo(): void {}
}
