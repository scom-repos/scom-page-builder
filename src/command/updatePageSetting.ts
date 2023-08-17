import { Control, application } from "@ijstech/components";
import { getMargin, getPageConfig, pageObject } from "../store/index";
import { ICommand } from "./interface";
import { IPageConfig, IPageSectionConfig } from '../interface/index';
import { EVENT } from "../const/index";

export class UpdatePageSettingsCommand implements ICommand {
  private element: any;
  private settings: IPageConfig
  private oldSettings: IPageConfig;
  private rowsConfig: {[key: string]: string} = {};

  constructor(element: Control, settings: IPageConfig) {
    this.element = element;
    this.oldSettings = {...getPageConfig()};
    this.settings = {...getPageConfig(), ...settings};
    const rows = this.element.querySelectorAll('ide-row');
    for (let row of rows) {
      const id = (row?.id || '').replace('row-', '');
      const oldConfig = pageObject.getRowConfig(id) || {};
      this.rowsConfig[id] = JSON.stringify({...this.oldSettings, ...oldConfig});
    }
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

  private updateConfig(config: IPageConfig, updatedValues: string[]) {
    const { backgroundColor, backgroundImage, textColor, margin, sectionWidth, ptb, plr } = config;
    let newConfig: IPageConfig = {};
    for (let prop of updatedValues) {
      newConfig[prop] = config[prop];
    }
    const element = this.element.closest('i-scom-page-builder') || this.element;

    if (updatedValues.includes('backgroundImage')) {
      application.EventBus.dispatch(EVENT.ON_UPDATE_PAGE_BG, {image: backgroundImage});
    }
    if (updatedValues.includes('backgroundColor')) {
      element.style.setProperty('--builder-bg', backgroundColor);
      application.EventBus.dispatch(EVENT.ON_UPDATE_PAGE_BG, {backgroundColor});
    }
    if (updatedValues.includes('textColor')) {
      element.style.setProperty('--builder-color', textColor);
      application.EventBus.dispatch(EVENT.ON_UPDATE_PAGE_BG, {textColor});
    }
    this.element.maxWidth = '100%'; // maxWidth ?? '100%';
    this.element.margin = getMargin(margin);
    pageObject.config = {backgroundColor, backgroundImage, margin, sectionWidth, ptb, plr, textColor};
    return newConfig;
  }

  execute(): void {
    const updatedValues = this.getChangedValues(this.settings, this.oldSettings);
    const newConfig = this.updateConfig(this.settings, updatedValues);
    application.EventBus.dispatch(EVENT.ON_UPDATE_PAGE_CONFIG, {config: newConfig});
  }

  undo(): void {
    const updatedValues = this.getChangedValues(this.oldSettings, this.settings);
    const newConfig = this.updateConfig(this.oldSettings, updatedValues);
    application.EventBus.dispatch(EVENT.ON_UPDATE_PAGE_CONFIG, {config: newConfig, rowsConfig: this.rowsConfig});
  }

  redo(): void {}
}
