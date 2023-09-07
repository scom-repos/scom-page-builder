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
    const {fullWidth, customBackground, backgroundColor, customTextColor, textColor, customTextSize, textSize,
      border, borderColor, customBackdrop, backdropColor, backdropImage, padding, sectionWidth,  } = config;

    const sectionEl = this.element;
    const innerEl = this.element.querySelector('#pnlRowContainer');

    if(sectionWidth !== undefined) {
      // innerEl.width = sectionWidth;
      innerEl.maxWidth = sectionWidth;
    }

    if(fullWidth) {
      if(customBackground && backgroundColor) {
        sectionEl.style.setProperty('--custom-background-color', backgroundColor);
        innerEl.style.setProperty('--custom-background-color', backgroundColor);
      }
      else {
        sectionEl.style.removeProperty('--custom-background-color');
        innerEl.style.removeProperty('--custom-background-color');
      }
    }
    else {
      if(customBackdrop) {
        if(backdropImage) {
          const ipfsUrl = `https://ipfs.scom.dev/ipfs`;
          sectionEl.style.setProperty('--custom-background-color', `url("${ipfsUrl}/${backdropImage}")`);
        }
        else if(backdropColor) {
          sectionEl.style.setProperty('--custom-background-color', backdropColor);
        }
      }
      else {
        sectionEl.style.removeProperty('--custom-background-color');
      }
      if(customBackground) {
        // Add background image later
        if(backgroundColor) {
          innerEl.style.setProperty('--custom-background-color', backgroundColor);
        }
      }
      else {
        innerEl.style.removeProperty('--custom-background-color');
      }
    }

    if(customTextSize && textSize) {
      sectionEl.classList.add(`font-${textSize}`);
    }
    else {
      sectionEl.classList.forEach(v => {
        if(v.indexOf('font-') >= 0)
          sectionEl.classList.remove(v);
      })
    }

    if(customTextColor && textColor) {
      sectionEl.style.setProperty('--custom-text-color', textColor);
    }
    else {
      sectionEl.style.removeProperty('--custom-text-color');
    }

    if(border && borderColor) {
      innerEl.border = {
        width: 2,
        style: 'solid',
        color: borderColor,
        radius: 10
      }
    }

    if(padding && (padding.top !== undefined || padding.bottom !== undefined || padding.left !== undefined || padding.right !== undefined)) {
      if(padding.top !== undefined) {
        sectionEl.style.setProperty('--custom-padding-top', `${padding.top}px`)
      }
      else {
        sectionEl.style.setProperty('--custom-padding-top', '0px')
      }
      if(padding.bottom !== undefined) {
        sectionEl.style.setProperty('--custom-padding-bottom', `${padding.bottom}px`)
      }
      else {
        sectionEl.style.setProperty('--custom-padding-bottom', '0px')
      }
      if(padding.left !== undefined) {
        sectionEl.style.setProperty('--custom-padding-left', `${padding.left}px`)
      }
      else {
        sectionEl.style.setProperty('--custom-padding-left', '0px')
      }
      if(padding.right !== undefined) {
        sectionEl.style.setProperty('--custom-padding-right', `${padding.right}px`)
      }
      else {
        sectionEl.style.setProperty('--custom-padding-right', '0px')
      }
    }
    else {
      sectionEl.style.removeProperty('--custom-padding-top');
      sectionEl.style.removeProperty('--custom-padding-bottom');
      sectionEl.style.removeProperty('--custom-padding-left');
      sectionEl.style.removeProperty('--custom-padding-right');

    }

    pageObject.updateSection(id, {config});
    const rowConfig = pageObject.getRowConfig(id);
    this.element.updateRowConfig(pageObject.getRowConfig(id));
  };

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
