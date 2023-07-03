import { Control, application } from "@ijstech/components";
import { getMargin, getPageConfig, pageObject } from "../store/index";
import { ICommand } from "./interface";
import { IPageSectionConfig } from '../interface/index';
import { EVENT } from "../const/index";

export class UpdateRowSettingsCommand implements ICommand {
  private element: any;
  private settings: IPageSectionConfig
  private oldSettings: any;

  constructor(element: Control, settings: IPageSectionConfig) {
    this.element = element;
    this.settings = {...settings};
    const id = this.element.id.replace('row-', '');
    const data = pageObject.getRowConfig(id) || getPageConfig();
    this.oldSettings = {...data};
  }

  private getChangedValues(newValue: IPageSectionConfig, oldValue: IPageSectionConfig) {
    let result = [];
    for (let prop in newValue) {
      if (prop === 'margin') {
        const { x: newX, y: newY } = newValue.margin;
        const { x: oldX, y: oldY } = oldValue.margin;
        if (newX !== oldX || newY !== oldY) result.push(prop);
      } else {
        if (newValue[prop] !== oldValue[prop]) result.push(prop);
      }
    }
    return result;
  }

  private updateConfig(config: IPageSectionConfig, updatedValues: string[]) {
    const id = this.element.id.replace('row-', '');
    const { margin } = config;
    const marginStyle = getMargin(margin);
    const newConfig = {...config, margin: {x: marginStyle.left , y: marginStyle.top}};
    pageObject.updateSection(id, {config: {...newConfig}});
    this.element.updateRowConfig(pageObject.getRowConfig(id));
    if (updatedValues.includes('backgroundColor')) {
      application.EventBus.dispatch(EVENT.ON_UPDATE_PAGE_BG, {color: newConfig?.backgroundColor || ''});
    }
  }

  execute(): void {
    const updatedValues = this.getChangedValues(this.settings, this.oldSettings);
    this.updateConfig(this.settings, updatedValues);
  }

  undo(): void {
    const updatedValues = this.getChangedValues(this.oldSettings, this.settings);
    this.updateConfig(this.oldSettings, updatedValues);
  }

  redo(): void {}
}
