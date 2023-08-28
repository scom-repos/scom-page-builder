import { Control } from "@ijstech/components";
import { getMargin, getPageConfig, pageObject } from "../store/index";
import { ICommand } from "./interface";
import { IPageSectionConfig } from '../interface/index';

export class UpdateRowSettingsCommand implements ICommand {
  private element: any;
  private settings: IPageSectionConfig
  private oldSettings: any;

  constructor(element: Control, settings: IPageSectionConfig) {
    this.element = element;
    const id = this.element.id.replace('row-', '');
    const data = pageObject.getRowConfig(id) || getPageConfig();
    this.settings = Object.assign({}, data, settings);
    this.oldSettings = {...data};
  }

  private getChangedValues(newValue: IPageSectionConfig, oldValue: IPageSectionConfig) {
    let result = [];
    if (newValue.backgroundColor === undefined) newValue.backgroundColor = ''
    if (newValue.textColor === undefined) newValue.textColor = ''
    if (newValue.textSize === undefined) newValue.textSize = ''
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

    const { textSize, customTextSize } = newConfig
    for (let i = this.element.classList.length - 1; i >= 0; i--) {
      const className = this.element.classList[i];
      if (className.startsWith('font-')) {
          this.element.classList.remove(className);
      }
    }
    if (customTextSize && textSize) {          
      this.element.classList.add(`font-${newConfig.textSize}`)
    }
    if (updatedValues.includes('backgroundColor') || updatedValues.includes('textColor') || updatedValues.includes('textSize')) {
      const newValue: any = {};
      if (updatedValues.includes('backgroundColor')) {
        newValue.backgroundColor = newConfig?.backgroundColor || '';
        newValue.customBackgroundColor = newConfig?.customBackgroundColor ?? false
        const innerEl = this.element.querySelector('#pnlRowContainer')
        innerEl && innerEl.style.setProperty('--row-background', newValue.backgroundColor)
      }
      if (updatedValues.includes('textColor')) {
        newValue.textColor = newConfig?.textColor || '';
        newValue.customTextColor = newConfig?.customTextColor ?? false
        this.element.style.setProperty('--row-font_color', newValue.textColor)
      }
      newValue.customTextSize = newConfig?.customTextSize ?? false
      const toolbars = this.element.querySelectorAll('ide-toolbar');
      for (let toolbar of toolbars) {
        toolbar.updateUI(newValue);
      }
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
