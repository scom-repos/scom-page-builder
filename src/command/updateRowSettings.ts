import { Control } from "@ijstech/components";
import { pageObject } from "../store/index";
import { ICommand } from "./interface";
import { IRowSettings } from '../interface/index';

export class UpdateRowSettingsCommand implements ICommand {
  private element: any;
  private settings: IRowSettings
  private oldSettings: any;

  constructor(element: Control, settings: IRowSettings) {
    this.element = element;
    this.settings = settings;
    const id = this.element.id.replace('row-', '');
    const data = pageObject.getRow(id) || {};
    this.oldSettings = {...data};
  }

  execute(): void {
    const { backgroundColor, config } = this.settings;
    const id = this.element.id.replace('row-', '');
    if (backgroundColor !== undefined) {
      this.element.background = {color: backgroundColor};
    }
    pageObject.updateSection(id, { backgroundColor, config });
    if (config) {
      this.element.setData(pageObject.getRow(id));
      const align = config.align || 'left';
      let alignValue = 'start';
      switch(align) {
        case 'right':
          alignValue = 'end';
          break;
        case 'center':
          alignValue = 'center';
          break;
      }
      this.element.style.justifyContent = alignValue;
    }
  }

  undo(): void {
    const { backgroundColor = '', config } = this.oldSettings;
    const id = this.element.id.replace('row-', '');
    this.element.background = {color: backgroundColor};
    pageObject.updateSection(id, {
      backgroundColor,
      config: config || {
        // columnLayout: IColumnLayoutType.FIXED,
        // columnsNumber: 12,
        align: 'left'
    }});
    this.element.setData(pageObject.getRow(id));
  }

  redo(): void {}
}
