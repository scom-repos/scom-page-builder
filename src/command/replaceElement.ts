import { application } from "@ijstech/components";
import { EVENT } from "../const/index";
import { ICommand } from "./interface";
import { IPageElement } from "../interface/index";

const onChangeElement = async (element: any, data: any, properties: any, tag: any, newData?: any, newCurrentReplaceData?: any) => {
  element.setData(properties, data?.module);
  element.clearComponent();
  await element.fetchModule(data);
  await element.setProperties({ ...properties });
  if (tag) await element.setTag({ ...tag });
  application.EventBus.dispatch(EVENT.ON_UPDATE_SECTIONS);
  if (newData) {
    newData = JSON.parse(JSON.stringify(element.data));
  }
  if (newCurrentReplaceData) {
    newCurrentReplaceData = JSON.parse(JSON.stringify(element.currentReplaceData));
  }
}

export class ReplaceElementCommand implements ICommand {
  private element: any;
  private pageRow: any;
  private oldReplaceData: IPageElement;
  private currentReplaceData: IPageElement;
  private data: IPageElement;

  constructor(element: any) {
    this.element = element;
    this.pageRow = this.element.closest('ide-row');
    this.data = JSON.parse(JSON.stringify(element.data));
    this.currentReplaceData = JSON.parse(JSON.stringify(element.currentReplaceData));
  }

  execute(): void {
    let isEmpty = false;
    if (!this.element.closest('ide-row')) {
      const elm = this.pageRow?.querySelector(`ide-toolbar#${this.element.id}`);
      if (elm) {
        this.element = elm;
        isEmpty = true;
      }
    }
    this.oldReplaceData = { ...this.data };
    let value = this.currentReplaceData;
    if (!value) return;
    const { tag, properties, module, elements } = value;
    let data = {
      ...this.data,
      module,
      properties
    };
    // if (type) {
    //   data.type = type;
    // }
    if (tag) {
      data.tag = tag;
    }
    if (elements) {
      data.elements = elements;
    }
    if (isEmpty) {
      onChangeElement(this.element, data, properties, tag, this.data, this.currentReplaceData);
    } else {
      onChangeElement(this.element, data, properties, tag);
    }
  }

  undo(): void {
    if (!this.oldReplaceData) return;
    const { properties, tag } = this.oldReplaceData;
    let isEmpty = false;
    if (!this.element.closest('ide-row')) {
      const elm = this.pageRow?.querySelector(`ide-toolbar#${this.element.id}`);
      if (elm) {
        this.element = elm;
        isEmpty = true;
      }
    }
    if (isEmpty) {
      onChangeElement(this.element, this.oldReplaceData, properties, tag, this.data, this.currentReplaceData);
    } else {
      onChangeElement(this.element, this.oldReplaceData, properties, tag);
    }
  }

  redo(): void { }
}
