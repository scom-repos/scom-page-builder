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
      this.element.style.backgroundColor = backgroundColor;
    }
    pageObject.updateSection(id, { backgroundColor, config });
    if (config) {
      this.element.updateColumn();
      this.element.setData(pageObject.getRow(id));
    }
  }

  undo(): void {
    const { backgroundColor = '', config } = this.oldSettings;
    const id = this.element.id.replace('row-', '');
    this.element.style.backgroundColor = backgroundColor;
    pageObject.updateSection(id, { backgroundColor, config });
    this.element.updateColumn();
    this.element.setData(pageObject.getRow(id));
  }

  redo(): void {}
}
